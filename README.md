# ATS Resume Parser & Filter Platform

A modern, high-performance resume analysis platform built with **React**, **Vite**, and **InsForge**.

## 🚀 Features

- **AI-Powered Analysis**: Uses InsForge AI to parse PDF/DOCX resumes and extract candidate details, skills, experience, and scoring metrics.
- **Modern Dashboard**: A sleek, dark-themed operator interface with glassmorphism and real-time filtering.
- **Secure Storage**: Up-to-date resume files stored in InsForge Storage buckets.
- **Full-Text Filter**: Search candidates by name, email, or specific skills instantly.
- **Insightful Metrics**: Visual gauges for Overall Match, Keyword Optimization, and Experience Quality.
- **Robust Deletion**: Safe removal of records and files with race-condition protection.

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Lucide React (Icons)
- **Styling**: Vanilla CSS (Custom Design System)
- **Backend-as-a-Service**: [InsForge](https://insforge.dev)
  - **Storage**: For resume file hosting.
  - **Database**: Postgres for analysis metadata.
  - **AI**: LLM-based parsing and extraction.

## 📦 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- An InsForge Account & Project

### 2. Installation
```bash
npm install
```

### 3. Configuration
The project is pre-configured to point to your InsForge instance. Ensure your `src/lib/insforge.js` has the correct `baseUrl` and API keys.

### 4. Development
```bash
npm run dev
```

## 📄 License
MIT
