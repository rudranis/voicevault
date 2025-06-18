import React, { useState, useRef } from "react";
import {
  FaMicrophone,
  FaStop,
  FaDownload,
  FaCloudUploadAlt,
  FaWaveSquare,
} from "react-icons/fa";
import { uploadData } from "@aws-amplify/storage"; // ✅ Correct for Amplify v6+

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        const timestamp = Date.now();
        const filename = `public/voice 1 - ${timestamp}.webm`;

        try {
          await uploadData({
            key: filename,
            data: audioBlob,
            options: {
              contentType: "audio/webm",
            },
          }).result;

          alert("✅ Voice uploaded to S3!");
        } catch (err) {
          console.error("❌ Upload failed:", err);
          alert("❌ Failed to upload to S3");
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert("❌ Microphone error or permission denied.");
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const downloadRecording = () => {
    if (audioUrl) {
      const a = document.createElement("a");
      a.href = audioUrl;
      a.download = `recording-${Date.now()}.webm`;
      a.click();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "2rem",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        padding: "3rem 1rem",
        margin: "2rem auto",
        maxWidth: 700,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "2.5rem",
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: "5rem",
            color: "#fff",
            textShadow: "0 4px 24px rgba(102,126,234,0.3)",
            marginBottom: "1rem",
            animation: "pulse 2s infinite",
          }}
        >
          <FaMicrophone />
        </div>
        <h1
          style={{
            color: "#fff",
            fontSize: "2.8rem",
            fontWeight: 800,
            letterSpacing: "-1px",
            marginBottom: "0.5rem",
            textShadow: "0 2px 8px rgba(76,205,196,0.2)",
          }}
        >
          VoiceVault Recorder
        </h1>
        <p
          style={{
            color: "#e0e0e0",
            fontSize: "1.2rem",
            marginBottom: "0.5rem",
          }}
        >
          Record, download, and save your voice securely in the cloud.
        </p>
      </div>
      {/* Animated Wave */}
      <div style={{ marginBottom: "2rem" }}>
        <svg
          width="120"
          height="30"
          viewBox="0 0 120 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 15 Q20 0 40 15 T80 15 T120 15"
            stroke="#4ecdc4"
            strokeWidth="4"
            fill="none"
          >
            <animate
              attributeName="d"
              values="M0 15 Q20 0 40 15 T80 15 T120 15;M0 15 Q20 30 40 15 T80 15 T120 15;M0 15 Q20 0 40 15 T80 15 T120 15"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
      {/* Recording Timer */}
      {isRecording && (
        <div
          style={{
            fontSize: "2.2rem",
            color: "#fff",
            fontFamily: "monospace",
            fontWeight: "bold",
            marginBottom: "1.5rem",
          }}
        >
          {formatTime(recordingTime)}
        </div>
      )}
      {/* Main Recording Button */}
      <div style={{ marginBottom: "2rem" }}>
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="modern-button"
            style={{
              fontSize: "1.3rem",
              padding: "1.5rem 3.5rem",
              borderRadius: "2rem",
              background: "linear-gradient(90deg, #4ecdc4 0%, #667eea 100%)",
              boxShadow: "0 4px 24px rgba(76,205,196,0.2)",
              color: "#fff",
              border: "none",
              fontWeight: 700,
              letterSpacing: "1px",
              transition: "all 0.2s",
            }}
          >
            <FaMicrophone style={{ fontSize: "1.7rem", marginRight: 10 }} />
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="modern-button recording"
            style={{
              fontSize: "1.3rem",
              padding: "1.5rem 3.5rem",
              borderRadius: "2rem",
              background: "linear-gradient(90deg, #ff6b6b 0%, #ee5a24 100%)",
              boxShadow: "0 4px 24px rgba(255,107,107,0.2)",
              color: "#fff",
              border: "none",
              fontWeight: 700,
              letterSpacing: "1px",
              transition: "all 0.2s",
            }}
          >
            <FaStop style={{ fontSize: "1.7rem", marginRight: 10 }} />
            Stop Recording
          </button>
        )}
      </div>
      {/* Audio Player and Download Section */}
      {audioUrl && (
        <div
          className="glass-card"
          style={{ marginTop: "2rem", width: "100%", maxWidth: 500 }}
        >
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <FaWaveSquare
              style={{
                fontSize: "2rem",
                color: "#4ecdc4",
                marginBottom: "1rem",
              }}
            />
            <h3 style={{ color: "#333", marginBottom: "1rem" }}>
              Your Recording
            </h3>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: "15px",
              padding: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <audio
              controls
              src={audioUrl}
              style={{ width: "100%", borderRadius: "10px" }}
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <button
              onClick={downloadRecording}
              className="modern-button download"
              style={{ marginRight: "1rem" }}
            >
              <FaDownload />
              Download
            </button>
            <button className="modern-button secondary">
              <FaCloudUploadAlt />
              Upload to Cloud
            </button>
          </div>
        </div>
      )}
      {/* Features Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
          marginTop: "3rem",
          width: "100%",
          maxWidth: 600,
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.13)",
            padding: "1.2rem",
            borderRadius: "18px",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(102,126,234,0.08)",
            transition: "transform 0.2s",
            cursor: "pointer",
          }}
        >
          <div style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>🎯</div>
          <h4 style={{ color: "#333", marginBottom: "0.5rem" }}>
            High Quality
          </h4>
          <p style={{ color: "#555", fontSize: "0.98rem" }}>
            Crystal clear audio recording
          </p>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.13)",
            padding: "1.2rem",
            borderRadius: "18px",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(102,126,234,0.08)",
            transition: "transform 0.2s",
            cursor: "pointer",
          }}
        >
          <div style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>☁️</div>
          <h4 style={{ color: "#333", marginBottom: "0.5rem" }}>
            Cloud Storage
          </h4>
          <p style={{ color: "#555", fontSize: "0.98rem" }}>
            Secure cloud backup
          </p>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.13)",
            padding: "1.2rem",
            borderRadius: "18px",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(102,126,234,0.08)",
            transition: "transform 0.2s",
            cursor: "pointer",
          }}
        >
          <div style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>⚡</div>
          <h4 style={{ color: "#333", marginBottom: "0.5rem" }}>Instant</h4>
          <p style={{ color: "#555", fontSize: "0.98rem" }}>
            Real-time processing
          </p>
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
};

export default VoiceRecorder;
