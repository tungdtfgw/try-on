import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Placeholder routes for now */}
        <Route path="/login" element={<div className="min-h-screen flex items-center justify-center">Login Page</div>} />
        <Route path="/register" element={<div className="min-h-screen flex items-center justify-center">Register Page</div>} />
        <Route path="/about" element={<div className="min-h-screen flex items-center justify-center">About Page</div>} />
      </Routes>
    </Router>
  );
}

export default App;
