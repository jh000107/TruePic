import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Ready to upload:", image);
    // Upload logic will go here

    if (!image) {
      alert("Please select an image before submitting.");
      return;
    }

    setIsLoading(true);

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
      setIsLoading(false);
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

      {previewURL && (
        <div style={{ marginTop: "1rem" }}>
          <p>Preview:</p>
          <img src={previewURL} alt="preview" className="preview"/>
        </div>
      )}

      {isLoading && <div className="spinner"></div>}

      {result && (
        <div className="result-card">
          <div
            className={`result-badge ${result.predicted_class === 1 ? "ai" : "human"}`}
          >
            {result.predicted_class === 1 ? "AI-generated" : "Human-generated"}
          </div>
          <div className="result-confidence">
            Confidence: {(result.confidence * 100).toFixed(2)}%
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: "1.5rem" }}>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "CHECK IMAGE"}
        </button>
      </form>
    </div>
  );
}

export default App;