import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import './Dashboard.css'; // <- Includes both navbar and dashboard styles

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to public home after logout
      alert("You have been logged out successfully.");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Dashboard Navbar */}
      <div className="nav-bar dashboard">
        <a href="/" className="logo">TruePic</a>
        <div className="nav-links">
          <button className="nav-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Dashboard Main Content */}
      <div className="dashboard-wrapper">
        <h1>Welcome back!</h1>
        <p>You are now logged in. Ready to start detecting AI images?</p>
        <Link to="/app">
          <button className="cta-button">Go to App</button>
        </Link>
      </div>
    </>
  );
}

export default Dashboard;
