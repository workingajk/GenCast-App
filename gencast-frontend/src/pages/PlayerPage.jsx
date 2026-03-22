import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { podcastService, authService } from '../services/api';
import { ScriptEditor } from '../components/ScriptEditor';
import { AudioPlayer } from '../components/AudioPlayer';
import { Loader2 } from 'lucide-react';

const PlayerPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [podcast, setPodcast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSynthesizing, setIsSynthesizing] = useState(false);

    useEffect(() => {
        loadPodcast();
    }, [id]);

    const loadPodcast = async () => {
        try {
            setLoading(true);
            const data = await podcastService.get(id);
            // Ensure every script line has a unique ID for the editor
            if (data.script_content && Array.isArray(data.script_content)) {
                data.script_content = data.script_content.map(line => ({
                    ...line,
                    id: line.id || Math.random().toString(36).substr(2, 9)
                }));
            }
            setPodcast(data);
        } catch (e) {
            console.error("Failed to load podcast", e);
            if (e.response && e.response.status === 401) {
                navigate('/login');
            } else {
                setError("Failed to load podcast. It might not exist.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateScript = async (newScript) => {
        // Optimistic update
        setPodcast(prev => ({ ...prev, script_content: newScript }));
        try {
            await podcastService.updateScript(id, newScript);
        } catch (e) {
            console.error("Failed to save script", e);
            // Revert or notify (omitted for simplicity)
        }
    };

    const handleSynthesize = async (selectedModel) => {
        setIsSynthesizing(true);
        try {
            // Save script first
            if (podcast.script_content) {
                await podcastService.updateScript(id, podcast.script_content);
            }

            const data = await podcastService.generateAudio(id, selectedModel);
            // Refresh podcast data to get new audio URL
            setPodcast(prev => ({
                ...prev,
                status: 'completed',
                audio_file: data.audio_url || data.audio_file // API might return audio_url or check serializer
            }));
            // Reload fully to be safe about URL formats
            loadPodcast();

        } catch (e) {
            console.error("Failed to synthesize", e);
            alert("Failed to synthesize audio");
        } finally {
            setIsSynthesizing(false);
        }
    };

    const getAudioUrl = () => {
        if (!podcast?.audio_file) return null;
        if (podcast.audio_file.startsWith('http')) return podcast.audio_file;
        return `${import.meta.env.VITE_API_URL.replace('/api', '')}${podcast.audio_file}`;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-bg-main text-text-main">
                <Loader2 className="animate-spin mb-4 text-primary" size={32} />
                <p className="text-text-muted">Loading Podcast...</p>
            </div>
        );
    }

    if (error || !podcast) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-bg-main text-text-main p-4">
                <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
                <p className="text-text-muted mb-6">{error || "Podcast not found"}</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-bg-surface border border-border-main rounded-xl hover:bg-bg-surface/80 transition-colors"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col relative">
            <div className="absolute inset-x-0 top-0 h-[40vh] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -mx-6 md:-mx-12 -mt-12 opacity-50"></div>

            <header className="max-w-6xl mx-auto w-full pb-6 flex items-center justify-between relative z-10 border-b border-slate-100 dark:border-white/5 mb-8">
                <button
                    onClick={() => navigate('/')}
                    className="text-slate-500 dark:text-text-muted hover:text-primary transition-colors flex items-center gap-2 text-sm font-bold group"
                >
                    <div className="p-2 bg-slate-50 dark:bg-bg-surface rounded-xl border border-slate-100 dark:border-white/5 group-hover:border-primary/30 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    </div>
                    Back to Projects
                </button>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-1.5 bg-slate-50 dark:bg-bg-surface border border-slate-200 dark:border-white/10 rounded-full text-xs font-bold text-slate-600 dark:text-text-muted flex items-center gap-2 shadow-soft">
                        <span className={`size-2 rounded-full ${podcast.status === 'completed' ? 'bg-primary shadow-glow' : 'bg-amber-500 animate-pulse'}`}></span>
                        Status: <span className="capitalize">{podcast.status}</span>
                    </div>
                    <button
                        onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this podcast?')) {
                                try {
                                    await podcastService.delete(podcast.id);
                                    navigate('/');
                                } catch (err) {
                                    console.error("Failed to delete podcast", err);
                                    alert("Failed to delete podcast");
                                }
                            }
                        }}
                        className="p-2.5 flex items-center justify-center bg-slate-50 dark:bg-bg-surface border border-slate-200 dark:border-white/10 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all shadow-soft group"
                        title="Delete Podcast"
                    >
                        <span className="material-symbols-outlined block text-[20px] group-active:scale-95 transition-transform">delete</span>
                    </button>
                </div>
            </header>

            <div className="max-w-4xl mx-auto w-full relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4 leading-tight text-balance max-w-4xl mx-auto">
                        {podcast.title || podcast.topic}
                    </h1>
                    <div className="h-1.5 w-24 bg-primary/20 mx-auto rounded-full mb-6">
                        <div className="h-full w-1/3 bg-primary rounded-full"></div>
                    </div>
                    <p className="text-xs font-bold text-slate-500 dark:text-text-muted uppercase tracking-widest">
                        Generated • {new Date(podcast.created_at).toLocaleDateString()}
                    </p>
                </div>

                {/* Audio Player */}
                {podcast.audio_file ? (
                    <div className="mb-16">
                        <AudioPlayer
                            audioUrl={getAudioUrl()}
                            onReset={() => navigate('/')} // Redirect to home on "New Project"
                        />
                    </div>
                ) : (
                    <div className="text-center mb-16 p-12 bg-slate-50 dark:bg-bg-main border border-slate-200 dark:border-white/10 border-dashed rounded-[2.5rem] shadow-none flex flex-col items-center justify-center transition-colors">
                        <div className="p-4 bg-slate-200 dark:bg-slate-800 rounded-2xl text-slate-500 mx-auto mb-5 border border-slate-300 dark:border-white/5">
                             {isSynthesizing ? (
                                 <Loader2 className="animate-spin text-primary" size={28} />
                             ) : (
                                 <span className="material-symbols-outlined text-[28px]">graphic_eq</span>
                             )}
                        </div>
                        <p className="text-slate-500 dark:text-text-muted font-bold tracking-wide">
                            {isSynthesizing ? 'Synthesizing Audio...' : 'Audio not generated'}
                        </p>
                    </div>
                )}

                {/* Script Editor */}
                <div className="mt-8">
                    <ScriptEditor
                        script={podcast.script_content || []}
                        setScript={handleUpdateScript}
                        onSynthesize={handleSynthesize}
                        isSynthesizing={isSynthesizing}
                    />
                </div>
            </div>
        </div>
    );
};

export default PlayerPage;
