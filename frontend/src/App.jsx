import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import MainApp from './MainApp'; // your existing core functionality

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/app" element={<MainApp />} />
    </Routes>
  );
}

export default App;