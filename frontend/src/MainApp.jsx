import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './MainApp.css';

function MainApp() {
  const [image, setImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [result, setResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [similarImages, setSimilarImages] = useState([]);

  const reset = () => {
    setImage(null);
    setPreviewURL(null);
    setResult(null);
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewURL(url);

      const formData = new FormData();
      formData.append("file", file);
      setIsChecking(true);

      fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((result) => {
          setResult({
            predicted_class: result.predicted_class,
            confidence: result.confidence,
          });
        })
        .catch((err) => {
          console.error("Upload failed", err);
          alert("Upload failed");
        })
        .finally(() => setIsChecking(false));
    }
  }, []);

  const handleReverseImageSearch = async () => {
    if (!image) {
      alert("Please select an image.");
      return;
    }

    setIsSearching(true);
    const formData = new FormData();
    formData.append("file", image);

    try {
      const uploadRes = await fetch("http://localhost:8000/upload-imgbb", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadData.url) {
        alert("Failed to upload to ImgBB.");
        return;
      }

      const urlForm = new FormData();
      urlForm.append("url", uploadData.url);

      const searchRes = await fetch("http://localhost:8000/google-reverse-search", {
        method: "POST",
        body: urlForm,
      });

      const data = await searchRes.json();
      setSimilarImages(data.results || []);
    } catch (error) {
      console.error("Reverse image search failed:", error);
      alert("An error occurred.");
    } finally {
      setIsSearching(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  return (
    <>
    <div className="card-wrapper">
      {!previewURL || !result ? (
        <div className={`drop-card ${isDragActive ? "active" : ""}`} {...getRootProps()}>
          <input {...getInputProps()} />
          <h2>Check if image is AI-generated</h2>
          <div className="upload-area">
            <div className="upload-icon">+</div>
            <p><strong>Drag and drop your image here</strong><br />or click to select</p>
            <small>Max image size 32MB</small>

            {isChecking && <div className="loading-spinner" />}

          </div>
        </div>) : (
        <div className="result-card">
          <h2>Check if image is AI-generated</h2>
          <div className="result-body">
            <img src={previewURL} alt="Uploaded" className="result-image" />
            <p className="result-message">
              <strong>
                {result.predicted_class === 1
                  ? "We're quite confident that this image, or significant part of it, was created by AI."
                  : "We're quite confident that NO AI was used when producing this image."}
              </strong>
            </p>
            
            <div className="confidence-gauge">
              <svg viewBox="0 0 180 100" className="gauge-svg">
                <defs>
                  <linearGradient id="gaugeGradientAI" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f88" />
                    <stop offset="100%" stopColor="#d32f2f" />
                  </linearGradient>
                  <linearGradient id="gaugeGradientHuman" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8bc34a" />
                    <stop offset="100%" stopColor="#2e7d32" />
                  </linearGradient>
                </defs>

                <path d="M10,90 A80,80 0 0,1 170,90" stroke="#eee" strokeWidth="20" fill="none" />
                <path
                  d="M10,90 A80,80 0 0,1 170,90"
                  stroke={`url(#${result.predicted_class === 1 ? "gaugeGradientAI" : "gaugeGradientHuman"})`}
                  strokeWidth="20"
                  fill="none"
                  strokeDasharray="252"
                  strokeDashoffset={`${252 - 252 * result.confidence}`}
                  style={{ transition: "stroke-dashoffset 0.6s ease-in-out" }}
                />
                <text x="90" y="60" textAnchor="middle" fontSize="18" fill="#333" fontWeight="bold">
                  {(result.confidence * 100).toFixed(0)}%
                </text>
                <text x="90" y="80" textAnchor="middle" fontSize="14" fill="#555">
                  {result.predicted_class === 1 ? "AI" : "Human"}
                </text>
              </svg>
            </div>

          </div>
          <button className="reset-button" onClick={reset}>Reset</button>
        </div>)}
    </div>
    <div className="google-image-search-section">
      <button className="google-image-search-button" onClick={handleReverseImageSearch} disabled={isSearching}>
        {isSearching ? "Searching..." : "Reverse Image Search"}
      </button>
    </div>
    
    </>
  );
}

export default MainApp;
