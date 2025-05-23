import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [result, setResult] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [similarImages, setSimilarImages] = useState([]);


  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleSubmit = async () => {
    if (!image) {
      alert("Please select an image.");
      return;
    }

    setIsChecking(true);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Prediction result:", result);

      setResult({
        predicted_class: result.predicted_class,
        confidence: result.confidence,
      });
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed");
    } finally {
      setIsChecking(false);
    }

  };

  const handleReverseImageSearch = async () => {
    if (!image) {
      alert("Please select an image.");
      return;
    }

    setIsSearching(true);
    const formData = new FormData();
    formData.append("file", image);

    try {
      // Step 1: Upload to ImgBB
      const uploadRes = await fetch("http://localhost:8000/upload-imgbb", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadData.url) {
        alert("Failed to upload to ImgBB.");
        return;
      }

      // Step 2: Send the URL to the backend for reverse search
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

  return (
    <div id="app-wrapper">
      <h1>AI Image Detector</h1>

      <div className={`dropzone ${isDragActive ? "active" : ""}`} {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here...</p>
        ) : (
          <p>Drag and drop an image here, or click to select one</p>
        )}
      </div>

      <div className="button-group">
        <button onClick={handleSubmit} disabled={isChecking || isSearching}>
          {isChecking ? <span className="spinner"></span> : "Check Image"}
        </button>
        
        <button onClick={handleReverseImageSearch} disabled={isChecking || isSearching}>
          {isSearching ? <span className="spinner"></span> : "Find Similar Images"}
        </button>
      </div>

      {previewURL && (
        <div style={{ marginTop: "1rem" }}>
          <p>Preview:</p>
          <img src={previewURL} alt="preview" className="preview"/>
        </div>
      )}

      {result && (
        <div className="result-card">
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

              {/* Base arc (grey background) */}
              <path
                d="M10,90 A80,80 0 0,1 170,90"
                stroke="#333"
                strokeWidth="20"
                fill="none"
              />

              {/* Colored arc */}
              <path
                d="M10,90 A80,80 0 0,1 170,90"
                stroke={`url(#${result.predicted_class === 1 ? "gaugeGradientAI" : "gaugeGradientHuman"})`}
                strokeWidth="20"
                fill="none"
                strokeDasharray="252"
                strokeDashoffset={`${252 - 252 * result.confidence}`}
                style={{ transition: "stroke-dashoffset 0.6s ease-in-out", filter: "drop-shadow(0 0 6px rgba(255,255,255,0.3))" }}
              />

              {/* Percentage */}
              <text x="90" y="60" textAnchor="middle" fontSize="18" fill="#fff" fontWeight="bold">
                {(result.confidence * 100).toFixed(0)}%
              </text>

              {/* Label */}
              <text x="90" y="80" textAnchor="middle" fontSize="14" fill="#ccc">
                {result.predicted_class === 1 ? "AI" : "Human"}
              </text>
            </svg>
          </div>
        </div>
      )}

      {similarImages.length > 0 && (
        <div className="similar-images-section">
          <h3>Similar Images</h3>
          <div className="similar-images-container">
            {similarImages.map((img, idx) => (
              <div key={idx} className="similar-image-card">
                <a href={img.source_url} target="_blank" rel="noopener noreferrer">
                  <img src={img.url} alt={`Similar ${idx}`} className="similar-image" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}






    </div>
  );
}

export default App;