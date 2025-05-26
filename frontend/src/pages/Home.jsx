import { Link } from 'react-router-dom';
import './Home.css';
import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
    <Navbar variant="home" />
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
            <p>Upload an image to begin.</p>
            <img src="/upload_image.png" alt="Upload step" />
          </div>
          <div className="step-card">
            <h3>Step 2</h3>
            <p>View your result.</p>
            <img src="/result.png" alt="Analyze step" />
          </div>
          <div className="step-card">
            <h3>Step 3</h3>
            <p>Find similar images.</p>
            <img src="/similar_images.png" alt="Google image search step" />
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p>© 2025 TruePic — AI Truth, Delivered.</p>
      </footer>
    </div>
    </>
  );
}

export default Home;
