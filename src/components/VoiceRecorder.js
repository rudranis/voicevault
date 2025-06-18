import React, { useState, useRef } from "react";
import { FaMicrophone, FaStop, FaDownload } from "react-icons/fa";
import { uploadData } from "@aws-amplify/storage"; // ✅ Correct for Amplify v6+

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

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

        const filename = `public/voice-${Date.now()}.webm`;

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
    } catch (err) {
      alert("❌ Microphone error or permission denied.");
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
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

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎙️ Voice Recorder</h2>
      {!isRecording ? (
        <button onClick={startRecording} style={styles.button}>
          <FaMicrophone /> Start Recording
        </button>
      ) : (
        <button onClick={stopRecording} style={styles.buttonStop}>
          <FaStop /> Stop Recording
        </button>
      )}

      {audioUrl && (
        <div style={styles.audioSection}>
          <audio controls src={audioUrl}></audio>
          <button onClick={downloadRecording} style={styles.buttonDownload}>
            <FaDownload /> Download Recording
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "40px",
    padding: "30px",
    background: "linear-gradient(135deg, #dfe9f3 0%, #ffffff 100%)",
    borderRadius: "12px",
    boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  title: {
    fontSize: "24px",
    color: "#333",
    marginBottom: "20px",
  },
  button: {
    padding: "12px 24px",
    fontSize: "16px",
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "0.3s",
  },
  buttonStop: {
    padding: "12px 24px",
    fontSize: "16px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "0.3s",
  },
  buttonDownload: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#2196f3",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "15px",
  },
  audioSection: {
    marginTop: "25px",
  },
};

export default VoiceRecorder;
