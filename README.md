# JOB INSIGHT
https://github.com/user-attachments/assets/a6af0ccc-2b1f-43ef-a84f-aa7112c5f089


This is an AI-driven web application that provides job insights, career advice, and tailored resume generation. Powered by **Lyzr AI**, the platform leverages the latest in generative AI to help candidates analyze job descriptions, ask career-related questions in a chat interface, and automatically draft ATS-friendly resumes.

## 🔍 Project Overview

- **Job Insights Chat**: Interactive chat powered by Lyzr AI to ask questions about job descriptions and receive actionable advice.
- **Job Details Viewer**: Clean, formatted HTML display of job details processed by AI.
- **Resume Generator**: Automatically create a tailored resume PDF based on job requirements.
- **User-friendly UI**: Built with Next.js, React, and Tailwind CSS for a responsive, modern interface.

## 🚀 Features

- Analyze and format job descriptions
- Chat with AI for tailored career guidance
- Generate and download PDFs of AI-crafted resumes
- Save and view past conversations via local storage or a mock database

## 🛠 Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **AI Services**: Lyzr AI (via genAI/chats)
- **PDF Generation**: html2canvas, jsPDF
- **State & Storage**: React Context, Local Storage (mock Supabase)
- **Deployment**: Vercel (recommended) or Netlify

## 📦 Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/your-org/ai-job-assistant.git
   cd ai-job-assistant
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file (if needed) and add any API keys.

## ⚙️ Development

- Run the dev server:
  ```bash
  npm run dev
  ```
- Open [http://localhost:3000](http://localhost:3000) in your browser.

## 💡 Production Build

- Build the app:
  ```bash
  npm run build
  ```
- Start the production server:
  ```bash
  npm start
  ```

## ☁️ Deployment

- **Vercel**: Recommended. Run `npx vercel --prod` to deploy.
- **Netlify**: Use the Netlify Next.js plugin. Drag-and-drop the `.next` folder or use CLI.

## 📄 License

This project is licensed under the MIT License.
