import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

import "./login.css";
import Navbar from "../components/Navbar";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Logged in successfully!");
            navigate("/"); // Redirect to the app page after login           
        } catch (err) {
            alert(err.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
            alert("Logged in with Google successfully!");
            navigate("/"); // Redirect to the app page after login 
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <>
        <Navbar variant="login" />
        <div className="login-wrapper">
            <div className="login-card">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
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
                <div className="remember-me">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Remember me</label>
                </div>
                <button type="submit" className="login-btn">Login</button>
            </form>

            <div className="divider">or login with</div>
            <button className="google-btn" onClick={handleGoogleLogin}>
                <img src="/google-logo.png" alt="Google" />
                Login with Google
            </button>

            <p className="bottom-text">
                Not a member? <a href="/register">Sign up now</a>
            </p>
            </div>
        </div>
        </>
    );
}

export default Login;