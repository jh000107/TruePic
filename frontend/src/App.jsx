import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import MainApp from './pages/MainApp'; // your existing core functionality
import Login from './pages/Login'; // your login component
import Register from './pages/Register'; // Uncomment if you have a registration component

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/app" element={<MainApp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;