import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from "./context/AuthContext.jsx";

import Home from './pages/Home';
import MainApp from './pages/MainApp'; // your existing core functionality
import Login from './pages/Login'; // your login component
import Register from './pages/Register'; // Uncomment if you have a registration component
import Dashboard from './pages/Dashboard';

function App() {
  const {user} = useAuth();

  return (
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/" element={user ? <Dashboard /> : <Home />} />
      <Route path="/app" element={<MainApp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;