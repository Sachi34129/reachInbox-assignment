# 📧 AI Email Automation System

A full-stack intelligent email management platform that syncs multiple IMAP accounts in real-time, indexes emails into Elasticsearch, performs AI-based categorization, sends Slack/webhook notifications, and provides smart reply suggestions using RAG (Retrieval-Augmented Generation).

---

## 🚀 Tech Stack

**Backend:**
- TypeScript (Node.js runtime)
- Express.js
- IMAP (persistent connections using IDLE)
- Elasticsearch (Docker)
- LangChain / Ollama / OpenAI (LLM for categorization + RAG)
- Slack API integration
- Webhook trigger support

**Frontend:**
- React (TypeScript)
- Tailwind CSS
- Axios for API communication

**Database / Services:**
- Elasticsearch for email search
- Vector DB (e.g., Pinecone / Chroma / FAISS) for RAG retrieval

---

## 📸 Preview

### 🎬 Demo Video
> 🎥 [Watch Demo](https://drive.google.com/file/d/1xry1csFSHRtd_lJev3e8aBHP06tj60Kk/view?usp=sharing)  
> *(Showcasing real-time sync, AI categorization, Slack + webhook triggers, and RAG reply suggestions)*

---

### 🖼️ Screenshots
<img width="1470" height="718" alt="Screenshot 2025-10-21 at 7 35 15 AM" src="https://github.com/user-attachments/assets/8073ac68-80ec-4fc8-9101-162f89c7aef6" />

---

## 🧩 Core Features

### 1️⃣ Real-Time Email Synchronization
- Supports **multiple IMAP accounts** (minimum 2).
- Fetches the **last 30 days of emails** on startup.
- Uses **persistent IMAP IDLE connections** for real-time updates.
- No cron jobs — real-time sync only.

### 2️⃣ Searchable Storage using Elasticsearch
- Emails are **stored and indexed** into a local Elasticsearch instance (via Docker).
- Supports **search and filtering** by folder and account.
- Search powered by full-text query matching.

### 3️⃣ AI-Based Email Categorization
- Each incoming email is categorized using an **LLM-based model**.
- Categories:
  - 📬 Interested  
  - 📅 Meeting Booked  
  - ❌ Not Interested  
  - 🚫 Spam  
  - 🕒 Out of Office
- Categorization stored alongside email metadata.

### 4️⃣ Slack & Webhook Integration
- Sends **Slack notifications** for each new “Interested” email.
- Triggers **webhooks** (via [webhook.site](https://webhook.site)) for external automation whenever an email is marked as “Interested”.

### 5️⃣ Frontend Interface
- Built with **React + Tailwind**.
- Displays all synced emails with:
  - Folder/account filters
  - AI category tags
  - Search bar powered by Elasticsearch
- Responsive and minimal UI.

### 6️⃣ AI-Powered Suggested Replies (RAG)
- Stores product info + outreach agenda in a **vector database**.
- Uses **Retrieval-Augmented Generation (RAG)** to suggest contextually relevant replies.
- Example:
  - **Email:** “Your resume has been shortlisted. When will be a good time for a technical interview?”
  - **AI Suggestion:**  
    “Thank you for shortlisting my profile! I'm available for a technical interview. You can book a slot here: [https://cal.com/example](https://cal.com/example)”

---

## 🏗️ Architecture Overview
```
                ┌────────────────────────┐
                │     IMAP Accounts      │
                │ (Gmail, Outlook, etc.) │
                └──────────┬─────────────┘
                           │
                  Real-Time Sync (IDLE)
                           │
          ┌────────────────▼───────────────┐
          │         Node.js Backend        │
          │────────────────────────────────│
          │  • Email Fetcher (IMAP)        │
          │  • AI Categorizer (LLM)        │
          │  • Slack / Webhook Notifier    │
          │  • RAG Reply Generator         │
          └────────────────┬───────────────┘
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      │                      │
┌───────▼───────┐     ┌────────▼───────┐     ┌────────▼────────┐
│ Elasticsearch │     │ Vector Database│     │ React Frontend  │
│ (Search Index)│     │ (RAG Context)  │     │ (Email Viewer)  │
└───────────────┘     └────────────────┘     └─────────────────┘
```

---

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository
```
git clone https://github.com/<your-username>/reachInbox-assignment.git
cd email-onebox-backend
```
---
## 2️⃣ Environment Setup
### Create a .env file in the project root:

# IMAP
IMAP_EMAIL_1=user1@gmail.com
IMAP_PASSWORD_1=xxxxxx
IMAP_EMAIL_2=user2@gmail.com
IMAP_PASSWORD_2=xxxxxx

# Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# Webhook
WEBHOOK_URL=https://webhook.site/your-url

# Elasticsearch
ELASTICSEARCH_URL=http://localhost:9200

# LLM / Ollama
OLLAMA_MODEL=gemma3:4b

---

## 3️⃣ Start Elasticsearch (Docker)

```
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -e "discovery.type=single-node" \
  docker.elastic.co/elasticsearch/elasticsearch:8.10.0
```
---
### 4️⃣ Install Dependencies
```
npm install
```
---
### 5️⃣ Start Backend
```
npm run dev
```
---
### 6️⃣ Start Frontend
```
cd frontend
npm install
npm run dev
```
Frontend runs at → http://localhost:5173

---

## 🏁 Summary

This project is a complete end-to-end **AI Email Automation System** built with modern technologies and intelligent automation.  
It brings together real-time email synchronization, AI-based categorization, and smart replies — all within an intuitive frontend interface.

### ✨ Key Highlights:
- 🔄 **Real-Time IMAP Sync** — Fetches and updates emails instantly using persistent IMAP IDLE connections (no cron jobs).  
- 🔍 **Elasticsearch Integration** — Enables fast and efficient full-text search and filtering by account or folder.  
- 🧠 **AI Categorization** — Uses an LLM (Gemma / Phi / Ollama) to classify emails into actionable categories like *Interested*, *Meeting Booked*, *Spam*, etc.  
- 📢 **Slack & Webhook Automation** — Notifies teams instantly about key leads (Interested emails) and triggers external workflows.  
- 💬 **AI-Powered Suggested Replies** — Combines RAG (Retrieval-Augmented Generation) and a vector database to craft personalized, context-aware responses.  
- 🖥️ **Frontend Dashboard** — React + Tailwind interface to view, search, and interact with emails seamlessly.

### 💡 Why This Matters:
This system demonstrates the power of combining **AI, automation, and real-time data pipelines** to streamline communication workflows.  
It’s a scalable foundation for intelligent email CRMs, sales automation tools, or productivity assistants.

---

> 🧩 *Built with TypeScript, Node.js, React, Elasticsearch, Ollama, and Slack API integrations.*
