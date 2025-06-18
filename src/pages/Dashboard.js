import React from "react";
import VoiceRecorder from "../components/VoiceRecorder";

const Dashboard = ({ user, signOut }) => {
  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <h1 style={styles.heading}>🎙️ VoiceVault Dashboard</h1>
        <p style={styles.welcome}>
          Welcome, <strong>{user.username}</strong> 🎉
        </p>

        <button onClick={signOut} style={styles.signOutButton}>
          🚪 Sign Out
        </button>

        <div style={styles.recorderWrapper}>
          <VoiceRecorder />
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    background: "linear-gradient(to right, #c6ffdd, #fbd786, #f7797d)",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    maxWidth: "800px",
    width: "100%",
    textAlign: "center",
  },
  heading: {
    fontSize: "2.5rem",
    color: "#2c3e50",
    marginBottom: "10px",
  },
  welcome: {
    fontSize: "1.2rem",
    color: "#444",
    marginBottom: "20px",
  },
  signOutButton: {
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "30px",
  },
  recorderWrapper: {
    marginTop: "20px",
  },
};

export default Dashboard;
