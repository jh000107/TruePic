import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-wrapper">
      <header className="hero-section">
        <h2>
            Spot the Fake. <br />Know What's Real.
        </h2>
        <p>
          AI Detection at Your Fingertips. Don’t let AI-generated images fool you.<br /> <strong>TruePic</strong> delivers reliable results instantly.
        </p>
        <Link to="/app">
          <button className="cta-button">Try It Now</button>
        </Link>
      </header>

      <section className="steps-section">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step-card">
            <h3>Step 1</h3>
            <p>Upload an image or paste a URL to begin.</p>
            <img src="/sample-upload.png" alt="Upload step" />
          </div>
          <div className="step-card">
            <h3>Step 2</h3>
            <p>We analyze the image using our AI model.</p>
            <img src="/sample-analyze.png" alt="Analyze step" />
          </div>
          <div className="step-card">
            <h3>Step 3</h3>
            <p>View your result and see how confident we are.</p>
            <img src="/sample-result.png" alt="Result step" />
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p>© 2025 TruePic — AI Truth, Delivered.</p>
      </footer>
    </div>
  );
}

export default Home;
