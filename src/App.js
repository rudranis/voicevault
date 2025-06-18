import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import VoiceRecorder from "./components/VoiceRecorder";
import VoiceDashboard from "./components/VoiceDashboard";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <div className="background-animation"></div>
        <nav className="modern-nav">
          <div className="nav-brand">
            <div className="logo-icon">🎙️</div>
            <h1 className="brand-text">VoiceVault</h1>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">
              <span className="nav-icon">🎙️</span>
              <span className="nav-text">Recorder</span>
            </Link>
            <Link to="/dashboard" className="nav-link">
              <span className="nav-icon">📁</span>
              <span className="nav-text">Dashboard</span>
            </Link>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<VoiceRecorder />} />
            <Route path="/dashboard" element={<VoiceDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
