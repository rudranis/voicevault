import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// ✅ Amplify Core Configuration
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
Amplify.configure(awsExports); // Automatically sets up Auth + S3 + more

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
