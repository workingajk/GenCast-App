import { GoogleGenAI } from "@google/genai";

// Initialize the API client. 
// NOTE: We recreate the client in functions to ensure we pick up the latest API Key if it changes.
const getAI = () => new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const generatePodcastPlan = async (
    topic,
    speakerCount
) => {
    const ai = getAI();

    const prompt = `
    You are an expert podcast producer. 
    Topic: "${topic}"
    Target format: A structured podcast with ${speakerCount} speakers.
    
    Task:
    1. Research the topic using Google Search to find relevant, factual, and up-to-date information.
    2. Create a high-level outline for a 5-minute podcast episode.
    3. The outline should include a catchy title, a brief summary, and 4-5 key discussion points (subtopics).
    
    OUTPUT FORMAT:
    Return strictly a JSON object with this structure:
    {
      "title": "Episode Title",
      "summary": "Brief summary...",
      "topics": ["Topic 1", "Topic 2", ...]
    }
    Do not include any markdown formatting or explanations outside the JSON.
  `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash", // Using 2.5-flash for tools support
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
            // responseMimeType: "application/json" is not supported with tools in this model
        }
    });

    let text = response.text || "{}";

    // Clean markdown if present (e.g. \`\`\`json ... \`\`\`)
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let outline;
    try {
        outline = JSON.parse(text);
    } catch (e) {
        // Fallback: try to find the JSON object if there is extra text
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                outline = JSON.parse(jsonMatch[0]);
            } catch (e2) {
                console.error("Failed to parse JSON", text);
                throw new Error("Failed to parse generation plan. The AI response was not valid JSON.");
            }
        } else {
            console.error("Failed to parse JSON", text);
            throw new Error("Failed to parse generation plan. The AI response was not valid JSON.");
        }
    }

    // Extract grounding metadata for sources
    const sources = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    chunks.forEach((chunk) => {
        if (chunk.web?.uri && chunk.web?.title) {
            sources.push({
                title: chunk.web.title,
                uri: chunk.web.uri
            });
        }
    });

    // Deduplicate sources
    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => t.uri === v.uri) === i);

    return { outline, sources: uniqueSources };
};

export const generatePodcastScript = async (
    topic,
    outline,
    speakerCount,
    sources
) => {
    const ai = getAI();

    const sourceContext = sources.map(s => `- ${s.title}: ${s.uri}`).join('\n');

    const prompt = `
    You are a professional scriptwriter.
    
    Podcast Title: ${outline.title}
    Summary: ${outline.summary}
    Key Topics: ${outline.topics.join(', ')}
    Context/Sources:
    ${sourceContext}
    
    Task:
    Write a natural, engaging podcast script for ${speakerCount} speakers.
    The speakers should be labeled as "Host", "Guest", "Speaker 3", etc.
    The dialogue should flow naturally, be informative, and follow the provided outline.
    Include approximately 10-15 dialogue turns.
    
    Return a JSON array of script lines.
  `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash", // Good reasoning for script generation
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        speaker: { type: "STRING" },
                        text: { type: "STRING" }
                    },
                    required: ["speaker", "text"]
                }
            }
        }
    });

    const text = response.text || "[]";
    let rawScript;
    try {
        rawScript = JSON.parse(text);
    } catch (e) {
        console.error("Script JSON parse failed", text);
        throw new Error("Failed to parse script. Please try again.");
    }

    // Add IDs for UI handling
    return rawScript.map((line) => ({
        id: Math.random().toString(36).substr(2, 9),
        speaker: line.speaker,
        text: line.text
    }));
};

export const synthesizeSpeech = async (
    text,
    voiceName
) => {
    const ai = getAI();

    // Clean text of characters that might confuse TTS
    const cleanText = text.replace(/[\*\_\(\)]/g, '');

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-tts",
        contents: {
            parts: [{ text: cleanText }]
        },
        config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: {
                        voiceName: voiceName
                    }
                }
            }
        }
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) {
        throw new Error("No audio data returned");
    }

    return audioData;
};
