import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ variant = 'default' }) {
  return (
    <nav className={`nav-bar ${variant}`}>
    <Link to="/" className="logo">TruePic</Link>
    <div className="nav-links">
        <Link to="/login" className="nav-button">Login</Link>
        <Link to="/register" className="nav-button">Register</Link>
    </div>
    </nav>
  );
}

export default Navbar;