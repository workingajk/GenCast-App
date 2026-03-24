# GenCast - Verified Technical Specifications & Application Flow

## 1. Technical Specifications (Verified against Codebase)

### Tech Stack Overview
- **Frontend**: React.js, Vite
- **Backend**: Python, Django, Django REST Framework (DRF)
- **Database**: SQLite (Active default configured in `settings.py`)
### AI/LLM: Google Gemini 2.5 Flash API (Integrated natively in the Backend)
- **Audio/TTS Services**: 
  - Backend: Edge-TTS (Default), gTTS, Resemble AI Chatterbox (via Gradio API client).
- **Audio Processing**: `pydub` + FFmpeg for decoding, aligning, and re-encoding audio segments into a valid MP3 file.
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

#### `User` table
Standard Django `AbstractUser`. No extra fields.

---

#### `Podcast` table

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | AutoField (PK) | No | Auto-incremented primary key |
| `user` | ForeignKey → User | No | Owner of the podcast |
| `title` | CharField(255) | Yes (blank) | Podcast title (populated from AI outline) |
| `topic` | TextField | No | User-provided topic string |
| `speaker_count` | IntegerField | No | Number of speakers (default: 2) |
| `speaker_characteristics` | JSONField | Yes | List of speaker personality descriptors |
| `outline` | JSONField | Yes | AI-generated plan: `{title, summary, topics[]}` |
| `sources` | JSONField | Yes | List of grounding sources: `[{title, uri}]` |
| `script_content` | JSONField | Yes | List of dialogue turns: `[{speaker, voice, pitch, rate, text}]` |
| `audio_file` | FileField | Yes | Path to the final `.mp3` file in storage |
| `status` | CharField(20) | No | Pipeline state: `planning`, `planned`, `scripted`, `synthesizing`, `completed`, `failed` |
| `planning_latency` | FloatField | Yes | Time taken for planning phase (seconds) |
| `scripting_latency` | FloatField | Yes | Time taken for script generation (seconds) |
| `audio_latency` | FloatField | Yes | Time taken for audio synthesis (seconds) |
| `created_at` | DateTimeField | No | Auto-set on creation |

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
3. **Real-Time Grounding:** The `generate_script` call uses `tools=[{"google_search": {}}]`, enabling Gemini to perform live web searches to verify facts and enrich the dialogue with current information. New grounding sources discovered during this phase are extracted from `grounding_metadata.grounding_chunks`, deduplicated, and **merged into the podcast's existing `sources` list** — making them visible in the Script Editor's right-side Grounding Sources panel.
4. **Voice Mapping & Prompting:** The LLM is instructed to output a JSON array of conversational turns, where each item adheres to: `{ speaker, voice, pitch (e.g., "+0Hz"), rate (e.g., "+0%"), text }`.
5. **State Update:** Podcast record is updated with `script_content`, merged `sources`, and `status="scripted"`.
6. **Human-in-the-Loop:** The script is rendered in the frontend (`ScriptEditor`). The user can manually edit the text, dialogue assignments, and adjust TTS parameters. Grounding sources are shown in a dedicated right-side panel.

### Phase 3: Script to Audio Generation
**Goal:** Synthesize the written script into distinct voices and merge them into a single podcast mp3.
1. **Synthesis Selection (`tts.py`):** 
   - The backend runs `synthesize_podcast()`.
   - **Main Engine:** Edge-TTS generating asynchronous chunks natively.
   - **Fallbacks:** The backend conditionally routes speech generation to standard `gTTS` or calls a distant HuggingFace/Gradio interface (`resembleai/chatterbox`) depending on availability or models passed.
   - **Parallel Execution:** All dialogue lines are dispatched concurrently via `asyncio.gather()`. Each line runs as an independent coroutine with its own 3-attempt retry. `asyncio.gather` guarantees results are returned in the original script order regardless of completion order, delivering a significant speedup (especially for longer scripts) vs. the prior sequential loop.
2. **Merge Logic (`concatenate_and_save`):**
   - All synthesized byte segments are decoded using `pydub`, aligned to consistent audio parameters (sample rate, channels, bit depth), re-encoded, and saved as a single clean `.mp3` file.
3. **Finalization:** The audio file is handed directly to Django's active storage engine (Local or AWS S3), saved as an `.mp3` object, setting `status="completed"`. The `/api/podcasts/{id}` endpoint returns the `audio_url`, matching the frontend playback client.

---

## 3. Authentication (Verified)

The app uses **JWT (JSON Web Token)** authentication via `djangorestframework_simplejwt`. This is confirmed — `TokenObtainPairView` and `TokenRefreshView` are directly wired in `gencast_backend/urls.py`, and `RefreshToken.for_user()` is issued in the `RegisterView`.

### Auth Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/api/auth/register/` | No | Creates a new user, returns `access` + `refresh` JWT tokens |
| POST | `/api/auth/login/` | No | Authenticates user credentials, returns `access` + `refresh` tokens |
| POST | `/api/auth/refresh/` | No (needs valid refresh token) | Exchanges a refresh token for a new access token |

### Token Lifecycle
- **Access token:** Short-lived, sent in the `Authorization: Bearer <token>` header on every protected API request.
- **Refresh token:** Long-lived, used to silently renew access tokens via `/api/auth/refresh/` when the access token expires. The frontend handles this automatically via an axios interceptor.

---

## 4. REST API Endpoint Reference (Verified)

All podcast endpoints require `Authorization: Bearer <access_token>`.

| Method | Endpoint | Description | Key Response Fields |
|---|---|---|---|
| POST | `/api/auth/register/` | Register new user | `user`, `access`, `refresh` |
| POST | `/api/auth/login/` | Login | `access`, `refresh` |
| POST | `/api/auth/refresh/` | Refresh access token | `access` |
| POST | `/api/podcasts/create/` | Generate plan + create Podcast record | Full `Podcast` object |
| GET | `/api/podcasts/` | List all podcasts for logged-in user | Array of `Podcast` summaries |
| GET | `/api/podcasts/{id}/` | Get full podcast detail | Full `Podcast` object |
| DELETE | `/api/podcasts/{id}/` | Delete podcast + audio file | 204 No Content |
| GET | `/api/podcasts/{id}/script/` | Get current script | `script_content` |
| PUT | `/api/podcasts/{id}/script/` | Manually update/save script | `script_content` |
| POST | `/api/podcasts/{id}/generate-script/` | AI-generate script from outline | `script_content`, `sources` |
| POST | `/api/podcasts/{id}/generate-audio/` | Synthesize script to MP3 | `audio_url`, `status` |

---

## 5. Frontend Page Architecture (Verified)

All pages live under `gencast-frontend/src/pages/` and are routed via `react-router-dom`.

| Page | Route | Description |
|---|---|---|
| `LoginPage.jsx` | `/login` | JWT login form. Stores tokens in localStorage. |
| `RegisterPage.jsx` | `/register` | User registration form. Auto-logs in after successful signup. |
| `HomePage.jsx` | `/` | Main creator dashboard. Hosts the topic input form, `PlanningView` (outline + sources review), and `ScriptEditor` in sequence as state advances. |
| `PlayerPage.jsx` | `/podcast/:id` | Full podcast playback page. Shows `AudioPlayer`, and the `ScriptEditor` with the option to re-synthesize audio. |
| `EditorPage.jsx` | `/podcast/:id/edit` | Dedicated script editing page (standalone). |

### Key Shared Components
| Component | Purpose |
|---|---|
| `PlanningView.jsx` | Displays the AI-generated outline and grounding sources after Phase 1. |
| `ScriptEditor.jsx` | 3-column layout: full-width header (title + actions), then script editor + grounding sources side-by-side. |
| `AudioPlayer.jsx` | Custom audio player UI for the final MP3 playback. |

---

## 6. Status State Machine (Verified)

The `Podcast.status` field tracks which phase of the pipeline the podcast is currently in.

```
[planning] → (generate_plan succeeds) → [planned]
[planned]  → (generate_script succeeds) → [scripted]
[scripted] → (generate_audio starts) → [synthesizing]
[synthesizing] → (concatenate_and_save succeeds) → [completed]
[any state] → (exception thrown) → [failed]
```

| Status | Set By | Meaning |
|---|---|---|
| `planning` | Model default | Initial state on object creation |
| `planned` | `PodcastCreateView` | Outline + sources generated successfully |
| `scripted` | `PodcastGenerateScriptView` | Script content generated and saved |
| `synthesizing` | `PodcastGenerateAudioView` (start) | TTS synthesis in progress |
| `completed` | `PodcastGenerateAudioView` (end) | Audio file saved and ready |
| `failed` | Any view on exception | An unrecoverable error occurred during generation |

---

## 7. Latency Tracking (Verified)

Each key generation phase measures wall-clock time using `time.time()` and saves the elapsed seconds (rounded to 2 decimal places) to the `Podcast` record.

| Field | Captured In | Covers |
|---|---|---|
| `planning_latency` | `PodcastCreateView.post` | Duration of `generate_plan()` call |
| `scripting_latency` | `PodcastGenerateScriptView.post` | Duration of `generate_script()` call |
| `audio_latency` | `PodcastGenerateAudioView.post` | Duration of `synthesize_podcast()` + `concatenate_and_save()` combined |
