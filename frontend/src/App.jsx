import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import MainApp from './MainApp'; // your existing core functionality
// import Login from './Login'; // your login component
// import Register from './Register'; // Uncomment if you have a registration component

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/app" element={<MainApp />} />
    </Routes>
  );
}

export default App;