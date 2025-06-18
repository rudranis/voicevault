import React, { useEffect, useState } from "react";
import { list, getUrl } from "aws-amplify/storage"; // ✅ Correct modular imports

const VoiceDashboard = () => {
  const [audioFiles, setAudioFiles] = useState([]);

  useEffect(() => {
    const fetchAudioFiles = async () => {
      try {
        const { items } = await list(); // 🔁 List all files from public scope

        const signedURLs = await Promise.all(
          items.map(async (file) => {
            const url = await getUrl({ key: file.key });
            return { key: file.key, url: url.url };
          })
        );

        setAudioFiles(signedURLs);
      } catch (error) {
        console.error("❌ Error listing files:", error);
      }
    };

    fetchAudioFiles();
  }, []);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>📁 Uploaded Voice Files</h2>
      {audioFiles.length === 0 ? (
        <p>No recordings found.</p>
      ) : (
        <ul>
          {audioFiles.map((file, index) => (
            <li key={index} style={{ marginBottom: "1rem" }}>
              <p>{file.key}</p>
              <audio controls src={file.url} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VoiceDashboard;
