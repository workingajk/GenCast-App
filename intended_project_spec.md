# Project Specification: GenCast (AI-Powered Podcast Generator)

## 1. Project Overview
We are building a web application that takes a simple text "topic" from a user and automatically generates a multi-speaker audio podcast. The system uses RAG (Retrieval-Augmented Generation) to fetch real-world facts, an LLM to write the script, and TTS to voice it.

## 2. Tech Stack
* **Frontend:** React.js (Vite), Tailwind CSS, React Router.
* **Backend:** Django (Python) with Django REST Framework (DRF).
* **Database:** PostgreSQL.
* **AI Models:**
    * **Planner/Script:** Google Gemini API.
    * **TTS:** Coqui TTS (or Edge-TTS for a lighter prototype).
    * **Search:** Google Search API or Serper.dev (for RAG).
* **Storage:** Cloudflare R2 or AWS S3 (for audio files).

## 3. Database Schema (PostgreSQL)
Based on the ER Diagram, we need two primary models:
1.  **User**:
    * `id` (PK), `username`, `email`, `password_hash`, `created_at`.
2.  **Podcast**:
    * `id` (PK), `user_id` (FK to User), `title`, `topic`, `script_content` (JSON/Text), `audio_file_url`, `created_at`.

## 4. Core Logic (The Algorithm)
The backend must implement this specific pipeline:
1.  **Input:** Receive `topic` from user.
2.  **Planning:** Call LLM to generate a podcast outline + search queries.
3.  **Retrieval (RAG):** Execute search queries to get web content/snippets.
4.  **Scripting:** Call LLM with the web content to generate a dialogue script (Host/Guest).
    * *Output Format:* JSON List `[{ "speaker": "Host", "text": "..." }, { "speaker": "Guest", "text": "..." }]`.
5.  **Human-in-the-Loop:** Save script to DB and pause. Wait for User to edit/confirm via API.
6.  **Synthesis:** Iterate through the confirmed script. Send "Host" lines to Voice A and "Guest" lines to Voice B.
7.  **Merge:** Concatenate audio segments using FFMPEG/Pydub.
8.  **Finalize:** Upload MP3 to storage and update the Podcast record.

## 5. API Endpoints Required
* `POST /api/auth/register` & `login`
* `POST /api/podcasts/create` (Input: topic) -> Returns: script_id
* `GET /api/podcasts/{id}/script` (View generated script)
* `PUT /api/podcasts/{id}/script` (User edits script)
* `POST /api/podcasts/{id}/generate_audio` (Triggers TTS)
* `GET /api/podcasts/{id}` (Returns audio URL)