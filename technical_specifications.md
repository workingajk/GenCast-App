# GenCast - Verified Technical Specifications & Application Flow

## 1. Technical Specifications (Verified against Codebase)

### Tech Stack Overview
- **Frontend**: React.js, Vite
- **Backend**: Python, Django, Django REST Framework (DRF)
- **Database**: SQLite (Active default configured in `settings.py`)
### AI/LLM: Google Gemini 2.5 Flash API (Integrated natively in the Backend)
- **Audio/TTS Services**: 
  - Backend: Edge-TTS (Default), gTTS, Resemble AI Chatterbox (via Gradio API client).
- **Audio Processing**: Raw Python byte concatenation (`b"".join()`). Note: While `pydub` and FFmpeg are listed in `requirements.txt`, they are bypassed entirely in the codebase.
- **Storage**: Local Django `media/` directory by default. Seamless upgrade to AWS S3/Supabase if AWS environment variables are provided (`storages.backends.s3boto3.S3Boto3Storage`).

### Frontend Dependencies & Libraries
- **UI & Routing**: `react`, `react-dom`, `react-router-dom`
- **Styling**: `tailwindcss`, `autoprefixer`, `postcss`
- **Networking**: `axios`
- **Icons & Utils**: `lucide-react`, `clsx`
- **Tooling**: `vite`, `@playwright/test`

### Backend Dependencies & Libraries
- **Core Framework**: `Django`, `djangorestframework`, `django-cors-headers`
- **Authentication**: `djangorestframework_simplejwt`, `PyJWT`
- **Google GenAI Integrations**: `google-genai`, `google-ai-generativelanguage`, `google-api-python-client`
- **Speech Synthesis**: `edge-tts`, `gTTS`, `gradio_client`
- **Storage**: `boto3`, `django-storages`
- **Networking/Misc**: `requests`, `urllib3`, `httplib2`, `pydantic`, `python-dotenv`

### Database Models (Django ORM)
1. **User**: Standard Django AbstractUser.
2. **Podcast**: 
   - Tracks all stages of creation: `topic`, `title`, `speaker_count`, `speaker_characteristics`.
   - Stores generative artifacts as `JSONField`: `outline`, `sources`, and `script_content`.
   - Media: `audio_file` (FileField storing reference to the concatenated final recording).
   - Tracks pipeline states with `status` (`planning`, `planned`, `scripted`, `synthesizing`, `completed`, `failed`).

---

## 2. Verified Application Flow & Logic

The application follows a strictly backend-driven pipeline where each stage builds on the previous one. The frontend acts exclusively as a dumb client, calling the Django REST API to trigger AI operations.

### Phase 1: Topic Input & Configuration (Plan Generation)
**Goal:** Gather user configuration and generate a foundational outline with factual sources.
1. **User Input:** The user inputs a `topic` along with `speaker_count` and custom `characteristics` for each speaker on the Creator dashboard.
2. **Generation Logic:** 
   - The frontend calls the backend API: POST `/api/podcasts/create/`.
3. **Logic & Tools:** The backend (`services.py`) prompts Gemini 2.5 Flash as an expert researcher with `google_search` tools enabled. 
4. **Extraction:** The AI output provides a structured JSON outline (Title, Summary, Topics) and extracts grounded sources directly from the candidate's `groundingChunks` metadata.
5. **State Update:** Podcast record is created with `status="planned"`. 

### Phase 2: Plan to Script Conversion
**Goal:** Expand the outline and sources into a conversational dialogue for the requested number of speakers.
1. **User Action:** The user reviews the generated outline and accepts it or clicks to transition to the script editor.
2. **Generation Logic:** 
   - Backend API POST `/api/podcasts/{id}/generate-script/` relies on `generate_script`.
   - The LLM is provided the outline, sources, speaker count, and crucially, assigned characteristics and a verified list of accepted Edge-TTS Voices.
3. **Voice Mapping & Prompting:** The LLM is forced to output a JSON array of conversational turns, where each item adheres to: `{ speaker, voice, pitch (e.g., "+0Hz"), rate (e.g., "+0%"), text }`.
4. **State Update:** Podcast record is updated with `script_content` and `status="scripted"`.
5. **Human-in-the-Loop:** The script is rendered in the frontend (`ScriptEditor`). The user can manually edit the text, dialogue assignments, and adjust TTS parameters.

### Phase 3: Script to Audio Generation
**Goal:** Synthesize the written script into distinct voices and merge them into a single podcast mp3.
1. **Synthesis Selection (`tts.py`):** 
   - The backend runs `synthesize_podcast()`.
   - **Main Engine:** Edge-TTS generating asynchronous chunks natively.
   - **Fallbacks:** The backend conditionally routes speech generation to standard `gTTS` or calls a distant HuggingFace/Gradio interface (`resembleai/chatterbox`) depending on availability or models passed.
2. **Merge Logic (`concatenate_and_save`):**
   - **Important Deviation:** Despite early specifications pointing to Pydub/FFmpeg, the implementation bypasses them. All synthesized byte streams are collected into a python array and joined cleanly via a standard byte concatenation: `b"".join(segments)`.
3. **Finalization:** The raw multi-part byte stream is handed directly to Django's active storage engine (Local or AWS S3), saved as an `.mp3` object, setting `status="completed"`. The `/api/podcasts/{id}` endpoint returns the `audio_url`, matching the frontend playback client.
