import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import VoiceRecorder from "./components/VoiceRecorder";
import VoiceDashboard from "./components/VoiceDashboard";

const App = () => {
  return (
    <Router>
      <div style={{ padding: "2rem" }}>
        <nav>
          <Link to="/" style={{ marginRight: "1rem" }}>
            🎙️ Recorder
          </Link>
          <Link to="/dashboard">📁 Dashboard</Link>
        </nav>
        <Routes>
          <Route path="/" element={<VoiceRecorder />} />
          <Route path="/dashboard" element={<VoiceDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
