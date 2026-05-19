export const VoiceName = {
    Puck: 'Puck',
    Kore: 'Kore',
    Fenrir: 'Fenrir',
    Charon: 'Charon',
    Zephyr: 'Zephyr'
};

export const SPEAKER_VOICE_MAP = {
    'Host': VoiceName.Puck,
    'Guest': VoiceName.Kore,
    'Speaker 1': VoiceName.Puck,
    'Speaker 2': VoiceName.Kore,
    'Speaker 3': VoiceName.Fenrir,
    'Speaker 4': VoiceName.Zephyr,
};

export const PROVIDERS_AND_MODELS = {
    'Google': [
        'gemini-3.1-pro-preview',
        'gemini-3.1-flash-lite-preview',
        'gemini-3-pro-preview',
        'gemini-3-flash-preview',
        'gemini-2.5-pro',
        'gemini-2.5-flash',
        'gemini-2.5-flash-lite',
        'gemini-2.0-flash',
        'gemini-2.0-flash-lite'
    ],
    'OpenAI': [
        'gpt-4o',
        'gpt-4o-mini',
        'gpt-4-turbo',
        'gpt-3.5-turbo'
    ],
    'Anthropic': [
        'claude-3-5-sonnet',
        'claude-3-5-haiku',
        'claude-3-opus',
        'claude-3-sonnet',
        'claude-3-haiku'
    ],
    'Ollama': [
        'gemma4:e2b',
        'gemma4:e4b',
        'mistral:latest',
        'llama3.2:latest',
        'qwen3:4b',
        'qwen3-vl:4b',
        'functiongemma:latest',
        'gemma3:4b',
        'gemma:2b',
        'mistral:7b-instruct-q4_K_M'
    ]
};
