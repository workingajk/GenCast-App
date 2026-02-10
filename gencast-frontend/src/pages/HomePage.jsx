import React, { useState } from 'react';
import { StepIndicator } from '../components/StepIndicator';
import { TopicInput } from '../components/TopicInput';
import { PlanningView } from '../components/PlanningView';
import { ScriptEditor } from '../components/ScriptEditor';
import { AudioPlayer } from '../components/AudioPlayer';
import { generatePodcastPlan, generatePodcastScript, synthesizeSpeech } from '../services/geminiService';
import { decodeBase64, decodeAudioData, concatenateAudioBuffers } from '../utils/audioUtils';
import { SPEAKER_VOICE_MAP } from '../constants';

const HomePage = () => {
    // State
    const [step, setStep] = useState('input');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Data
    const [config, setConfig] = useState({ topic: '', speakers: 2 });
    const [outline, setOutline] = useState(null);
    const [sources, setSources] = useState([]);
    const [script, setScript] = useState([]);
    const [finalAudio, setFinalAudio] = useState(null);

    // Handlers
    const handleGeneratePlan = async (topic, speakers) => {
        setLoading(true);
        setError(null);
        setConfig({ topic, speakers });

        try {
            const { outline: plan, sources: refs } = await generatePodcastPlan(topic, speakers);
            setOutline(plan);
            setSources(refs);
            setStep('planning');
        } catch (e) {
            console.error(e);
            setError("Failed to generate plan. Please try again. Ensure API_KEY is set.");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateScript = async () => {
        if (!outline) return;
        setLoading(true);
        setError(null);

        try {
            const generatedScript = await generatePodcastScript(
                config.topic,
                outline,
                config.speakers,
                sources
            );
            setScript(generatedScript);
            setStep('scripting');
        } catch (e) {
            console.error(e);
            setError("Failed to generate script. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSynthesizeAudio = async () => {
        setLoading(true);
        setError(null);

        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const buffers = [];

            // Process sequentially to maintain order and context
            for (const line of script) {
                if (!line.text.trim()) continue;

                // Map speaker to voice
                const voice = SPEAKER_VOICE_MAP[line.speaker] || 'Puck'; // Default to Puck

                const base64Audio = await synthesizeSpeech(line.text, voice);
                const audioBytes = decodeBase64(base64Audio);
                // Pass 24000Hz and 1 channel as Gemini 2.5 Flash TTS outputs raw PCM at this rate
                const audioBuffer = await decodeAudioData(audioBytes, audioContext, 24000, 1);
                buffers.push(audioBuffer);
            }

            const combinedBuffer = concatenateAudioBuffers(buffers, audioContext);
            setFinalAudio(combinedBuffer);
            setStep('audio');

            // Clean up temp context
            audioContext.close();

        } catch (e) {
            console.error(e);
            setError("Failed to synthesize audio. Check API quotas or connection.");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setStep('input');
        setOutline(null);
        setScript([]);
        setFinalAudio(null);
        setError(null);
    };

    return (
        <div className="flex flex-col items-center w-full min-h-screen pb-24 bg-bg-main text-text-main relative overflow-hidden transition-colors duration-500">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,189,199,0.08),transparent_50%)] pointer-events-none"></div>
            <header className="mb-12 text-center pt-12 relative z-10">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-heading mb-4 neon-text-glow dark:text-white">
                    Gen<span className="text-primary">Cast</span>
                </h1>
                <p className="text-text-muted font-medium max-w-xl mx-auto leading-relaxed">
                    Research-Based RAG Podcast Generation. Just provide a topic, and we'll handle the rest.
                </p>
            </header>

            <StepIndicator currentStep={step} />

            <main className="w-full max-w-6xl px-4">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-center border border-red-100 max-w-2xl mx-auto">
                        {error}
                    </div>
                )}

                {step === 'input' && (
                    <TopicInput onGenerate={handleGeneratePlan} isGenerating={loading} />
                )}

                {step === 'planning' && outline && (
                    <PlanningView
                        outline={outline}
                        sources={sources}
                        onConfirm={handleGenerateScript}
                        isGeneratingScript={loading}
                    />
                )}

                {step === 'scripting' && (
                    <ScriptEditor
                        script={script}
                        setScript={setScript}
                        onSynthesize={handleSynthesizeAudio}
                        isSynthesizing={loading}
                    />
                )}

                {step === 'audio' && (
                    <AudioPlayer
                        audioBuffer={finalAudio}
                        onReset={reset}
                    />
                )}
            </main>
        </div>
    );
};

export default HomePage;

