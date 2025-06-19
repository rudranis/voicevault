# 🎙️ **VoiceVault - Secure Voice Recording and Storage App**

**VoiceVault** is a modern **React + AWS-powered application** that allows users to **record voice**, **download audio**, and **securely store voice recordings in Amazon S3**. It uses **AWS Amplify**, **Cognito for user authentication**, and **Amazon S3 for media storage**.

---

## 🔍 **Overview**

VoiceVault is designed to provide a secure, easy-to-use browser-based voice recording solution for authenticated users.

### Supported Features:
- 🎤 Voice recording via browser
- 📥 Downloadable audio files (WebM)
- ☁️ Secure upload to Amazon S3
- 🔐 Authentication via AWS Cognito
- 🌐 Fully responsive user interface

---

## ✨ **Core Features**

✅ Secure voice recording  
✅ AWS Cognito user authentication  
✅ Upload recorded audio to S3  
✅ Download recordings locally  
✅ Beautiful dashboard with minimal UI  
✅ Upload status notifications  
✅ AWS Amplify backend integration  

---

## 🧱 **Project Architecture**

Before jumping into implementation, understand how the VoiceVault ecosystem works:

![WhatsApp Image 2025-06-18 at 20 47 50_4d153fd0](https://github.com/user-attachments/assets/97b53c75-509c-4bb7-8963-2bc140f775da)

*This diagram represents the flow from user actions to cloud storage using React, Amplify, Cognito, and S3.*

---

## 🚀 **Getting Started with Create React App**

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### 📦 Available Scripts

In the project directory, run:

#### `npm start`
Runs the app in development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

#### `npm test`
Launches the test runner in interactive watch mode.

#### `npm run build`
Builds the app for production to the `build` folder.  
Optimized for best performance and deployment.

#### `npm run eject`
⚠️ Use only if you want full control over Webpack, Babel, ESLint etc.

---

## 🧾 **AWS Setup Summary**

| Service         | Value / Resource Name |
|-----------------|------------------------|
| **User Pool ID**       | `us-east-1_ACra8dicf` |
| **Identity Pool ID**   | `us-east-1:54a406bc-7001-4e47-8c77-45cfeaaf96c1` |
| **S3 Bucket Name**     | `voicevault-user-notes` |
| **IAM Role (Auth)**    | `amplify-voicevaultai-dev-c28e8-authRole` |

> Make sure your IAM role has correct S3 PutObject permissions!
> 
OUTPUT:
![image](https://github.com/user-attachments/assets/0e3b641d-0057-4670-8fa0-a1d4d496a235)
An architecture diagram showing the workflow of the VoiceVault app: from user interaction on the React frontend to authentication via AWS Cognito (User Pool & Identity Pool), and finally storing the audio recordings securely in Amazon S3.

![image](https://github.com/user-attachments/assets/83437aa4-1f91-4ce4-b9ca-56208d870fa5)
Screenshot of the AWS S3 bucket interface displaying successfully uploaded .webm voice recordings with timestamped filenames. Confirms successful S3 integration from the React app.

![image](https://github.com/user-attachments/assets/c8f5b980-30e3-44a7-9690-a90ba9df3d16)
The AWS Identity and Access Management (IAM) section showing an IAM role (amplify-voicevaultai-dev-c28e8-authRole) configured with S3 permissions. This is essential for authorized users to upload audio.

![image](https://github.com/user-attachments/assets/6f65499f-9d97-4c76-abb5-1a6a6c7c167b)
Frontend UI of the VoiceVault dashboard with options like "🎙️ Recorder 📁 Dashboard" and a "Start Recording" button. It represents the clean, user-friendly interface for capturing voice inputs.

📧 **Contact**: For questions or feedback, feel free to reach out at [rudranishinde2005@gmail.com](mailto:rudranishinde2005@gmail.com).  
🛠️ Built with 💙 using React, AWS Amplify, Cognito, and S3.
