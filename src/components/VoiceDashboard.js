import React, { useEffect, useState, useRef } from "react";
import { list, getUrl, remove } from "aws-amplify/storage";
import {
  FaMusic,
  FaPlay,
  FaDownload,
  FaTrash,
  FaCloud,
  FaClock,
  FaSpinner,
} from "react-icons/fa";

// Decorative SVGs for interactivity
const AnimatedWave = () => (
  <svg
    width="60"
    height="20"
    viewBox="0 0 60 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block", margin: "0 auto" }}
  >
    <path
      d="M0 10 Q10 0 20 10 T40 10 T60 10"
      stroke="#4ecdc4"
      strokeWidth="3"
      fill="none"
    >
      <animate
        attributeName="d"
        values="M0 10 Q10 0 20 10 T40 10 T60 10;M0 10 Q10 20 20 10 T40 10 T60 10;M0 10 Q10 0 20 10 T40 10 T60 10"
        dur="2s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
);

const AnimatedMic = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block", margin: "0 auto" }}
  >
    <circle
      cx="20"
      cy="20"
      r="18"
      stroke="#667eea"
      strokeWidth="3"
      fill="#fff"
      opacity="0.2"
    />
    <rect x="15" y="10" width="10" height="15" rx="5" fill="#667eea" />
    <rect x="18" y="25" width="4" height="7" fill="#667eea" />
    <rect x="13" y="32" width="14" height="3" fill="#667eea" />
  </svg>
);

const VoiceDashboard = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingKey, setDeletingKey] = useState(null);
  const audioRefs = useRef({});

  useEffect(() => {
    const fetchAudioFiles = async () => {
      try {
        setLoading(true);
        const { items } = await list();

        const signedURLs = await Promise.all(
          items.map(async (file) => {
            const url = await getUrl({ key: file.key });
            return {
              key: file.key,
              url: url.url,
              size: file.size,
              lastModified: file.lastModified,
            };
          })
        );

        setAudioFiles(signedURLs);
      } catch (error) {
        console.error("❌ Error listing files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAudioFiles();
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const extractId = (key) => {
    // Extracts the id from 'voice 1 - <id>.webm'
    const match = key.match(/voice 1 - (\d+)\.webm$/);
    if (match) {
      return match[1];
    }
    return key.split("/").pop().replace(".webm", "");
  };

  // Play audio programmatically
  const handlePlay = (key) => {
    if (audioRefs.current[key]) {
      audioRefs.current[key].play();
    }
  };

  // Download audio
  const handleDownload = (file) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = extractId(file.key) + ".webm";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete audio from S3 and UI
  const handleDelete = async (key) => {
    if (!window.confirm("Are you sure you want to delete this recording?"))
      return;
    setDeletingKey(key);
    try {
      await remove({ key });
      setAudioFiles((prev) => prev.filter((file) => file.key !== key));
    } catch (err) {
      alert("Failed to delete file.");
      console.error(err);
    } finally {
      setDeletingKey(null);
    }
  };

  if (loading) {
    return (
      <div
        className="glass-card"
        style={{ maxWidth: "1000px", margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
          <h2 style={{ color: "white", marginBottom: "1rem" }}>
            Loading Your Recordings
          </h2>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "3px solid rgba(255,255,255,0.3)",
              borderTop: "3px solid white",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto",
            }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header Section */}
      <div className="glass-card" style={{ marginBottom: "2rem" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📁</div>
          <h1
            style={{
              color: "white",
              fontSize: "2.5rem",
              marginBottom: "0.5rem",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Voice Dashboard
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "1.1rem",
              marginBottom: "1rem",
            }}
          >
            Manage and play your recorded voice files
          </p>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              padding: "1rem",
              borderRadius: "15px",
              display: "inline-block",
            }}
          >
            <FaCloud
              style={{
                fontSize: "1.5rem",
                color: "white",
                marginRight: "0.5rem",
              }}
            />
            <span style={{ color: "white", fontWeight: "bold" }}>
              {audioFiles.length}{" "}
              {audioFiles.length === 1 ? "Recording" : "Recordings"}
            </span>
          </div>
        </div>
      </div>

      {/* Audio Files Grid */}
      {audioFiles.length === 0 ? (
        <div
          className="glass-card"
          style={{ textAlign: "center", padding: "4rem" }}
        >
          <div style={{ fontSize: "5rem", marginBottom: "2rem" }}>🎵</div>
          <h2 style={{ color: "white", marginBottom: "1rem" }}>
            No Recordings Found
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "1.1rem",
              marginBottom: "2rem",
            }}
          >
            Start recording to see your voice files here
          </p>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              padding: "2rem",
              borderRadius: "20px",
              display: "inline-block",
            }}
          >
            <AnimatedMic />
            <p style={{ color: "rgba(255,255,255,0.8)" }}>
              Your recordings will appear here once uploaded
            </p>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {audioFiles.map((file, index) => (
            <div
              key={index}
              className="glass-card"
              style={{
                transition: "all 0.3s ease",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Interactive SVG at the top of each card */}
              <div
                style={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}
              >
                <AnimatedWave />
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "15px",
                  padding: "1.5rem",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <FaMusic
                    style={{
                      fontSize: "1.5rem",
                      color: "white",
                      marginRight: "0.5rem",
                    }}
                  />
                  <h3
                    style={{
                      color: "white",
                      margin: 0,
                      fontSize: "1.1rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {`voice ${index + 1} ${extractId(file.key)}`}
                  </h3>
                </div>

                <audio
                  ref={(el) => (audioRefs.current[file.key] = el)}
                  controls
                  src={file.url}
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    marginBottom: "1rem",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.9rem",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FaClock style={{ marginRight: "0.3rem" }} />
                    {formatDate(file.lastModified)}
                  </div>
                  <div>{formatFileSize(file.size)}</div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  justifyContent: "center",
                  marginTop: "1rem",
                  width: "100%",
                }}
              >
                <button
                  className="modern-button secondary"
                  style={{
                    flex: "1 1 0",
                    minWidth: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    padding: "0.7rem 0.2rem",
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => handlePlay(file.key)}
                  title="Play"
                >
                  <FaPlay />
                  <span style={{ marginLeft: 6 }}>Play</span>
                </button>
                <button
                  className="modern-button download"
                  style={{
                    flex: "1 1 0",
                    minWidth: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    padding: "0.7rem 0.2rem",
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => handleDownload(file)}
                  title="Download"
                >
                  <FaDownload />
                  <span style={{ marginLeft: 6 }}>Download</span>
                </button>
                <button
                  className="modern-button"
                  style={{
                    flex: "1 1 0",
                    minWidth: 0,
                    background:
                      deletingKey === file.key
                        ? "#ccc"
                        : "linear-gradient(45deg, #ff6b6b, #ee5a24)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    padding: "0.7rem 0.2rem",
                    whiteSpace: "nowrap",
                    cursor:
                      deletingKey === file.key ? "not-allowed" : "pointer",
                    opacity: deletingKey === file.key ? 0.7 : 1,
                  }}
                  onClick={() => handleDelete(file.key)}
                  disabled={deletingKey === file.key}
                  title="Delete"
                >
                  {deletingKey === file.key ? (
                    <FaSpinner className="fa-spin" />
                  ) : (
                    <FaTrash />
                  )}
                  <span style={{ marginLeft: 6 }}>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Section */}
      {audioFiles.length > 0 && (
        <div className="glass-card" style={{ marginTop: "2rem" }}>
          <h3
            style={{
              color: "white",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            📊 Storage Statistics
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "1rem",
                borderRadius: "15px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📁</div>
              <h4 style={{ color: "white", marginBottom: "0.5rem" }}>
                Total Files
              </h4>
              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                }}
              >
                {audioFiles.length}
              </p>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "1rem",
                borderRadius: "15px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>💾</div>
              <h4 style={{ color: "white", marginBottom: "0.5rem" }}>
                Total Size
              </h4>
              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                }}
              >
                {formatFileSize(
                  audioFiles.reduce((acc, file) => acc + file.size, 0)
                )}
              </p>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "1rem",
                borderRadius: "15px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🕒</div>
              <h4 style={{ color: "white", marginBottom: "0.5rem" }}>
                Latest Upload
              </h4>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem" }}>
                {audioFiles.length > 0
                  ? formatDate(
                      Math.max(...audioFiles.map((f) => f.lastModified))
                    )
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .fa-spin {
          animation: fa-spin 1s infinite linear;
        }
        @keyframes fa-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(359deg);
          }
        }
      `}</style>
    </div>
  );
};

export default VoiceDashboard;
