import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import './Dashboard.css'; // Reuse navbar styles
import './Profile.css';   // Profile-specific styles

function Profile() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <>
      {/* Profile Navbar */}
      <div className="nav-bar dashboard">
        <a href="/" className="logo">TruePic</a>
        <div className="nav-links">
          <button className="nav-button" onClick={() => navigate('/')}>
            Dashboard
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-wrapper">
        <div className="profile-card">
          <h1>Your Profile</h1>
          <img
            src={user.photoURL || '/default-avatar.png'}
            alt="Profile Avatar"
          />
          <p><strong>Name:</strong> {user.displayName || 'N/A'}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>UID:</strong> {user.uid}</p>
        </div>
      </div>
    </>
  );
}

export default Profile;
