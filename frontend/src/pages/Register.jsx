import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import "./Register.css";
import Navbar from "../components/Navbar";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created!");
      // Optionally redirect to login or home page
      navigate("/login");

    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await signInWithPopup(auth, provider);
      alert("Signed up with Google!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
    <Navbar variant="login" />
    <div className="register-wrapper">
      <div className="register-card">
        <h2>Sign Up</h2>
        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="register-btn">Create Account</button>
        </form>

        <div className="divider">or sign up with</div>
        <button className="google-btn" onClick={handleGoogleRegister}>
          <img src="/google-logo.png" alt="Google" />
          Sign up with Google
        </button>

        <p className="bottom-text">
          Already have an account? <a href="/login">Log in here</a>
        </p>
      </div>
    </div>
    </>
  );
}

export default Register;
