import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Download, RotateCcw, CheckCircle } from 'lucide-react';

export const AudioPlayer = ({ audioUrl, onReset }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(null);

    useEffect(() => {
        if (!audioRef.current) return;
        
        const audio = audioRef.current;
        
        const updateProgress = () => {
            if (audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(100);
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', handleEnded);
        
        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;
        
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        if (!audioRef.current || !audioRef.current.duration) return;
        
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.min(Math.max(x / rect.width, 0), 1);
        
        audioRef.current.currentTime = percentage * audioRef.current.duration;
        setProgress(percentage * 100);
    };

    const formatTime = (seconds) => {
        if (!seconds) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-2xl mx-auto text-center space-y-12 text-text-main transition-colors duration-300">
            <audio ref={audioRef} src={audioUrl} preload="metadata" />
            
            <div className="bg-white dark:bg-bg-surface p-12 rounded-[3rem] border border-slate-200 dark:border-white/5 flex flex-col items-center gap-8 shadow-xl-saas relative overflow-hidden transition-all duration-300">
                <div className="size-24 bg-primary/20 text-primary rounded-[2rem] flex items-center justify-center shadow-glow animate-bounce-subtle">
                    <CheckCircle size={48} strokeWidth={2.5} />
                </div>
                <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Podcast Mastered!</h2>
                    <p className="text-slate-500 dark:text-text-muted font-medium max-w-[280px] mx-auto text-sm leading-relaxed">Your studio-quality episode is finalized and ready for the world to hear.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-bg-surface p-10 py-12 rounded-[3rem] border border-slate-200 dark:border-white/5 relative overflow-hidden shadow-xl-saas transition-all duration-300">
                {/* Visualizer bg (simulated) */}
                <div className="absolute inset-x-0 bottom-0 top-1/2 flex items-end justify-center opacity-[0.05] gap-1.5 pointer-events-none px-6">
                    {[...Array(40)].map((_, i) => (
                        <div key={i} className="w-full max-w-[4px] bg-primary rounded-full" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
                    ))}
                </div>

                <div className="relative z-10 space-y-10">
                    <div className="flex items-center justify-between text-[11px] font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase px-2">
                        <span className="bg-slate-50 dark:bg-bg-main px-4 py-2 rounded-xl border border-slate-100 dark:border-white/5 shadow-soft">{formatTime(audioRef.current?.currentTime)}</span>
                        <span className="bg-slate-50 dark:bg-bg-main px-4 py-2 rounded-xl border border-slate-100 dark:border-white/5 shadow-soft">{formatTime(audioRef.current?.duration)}</span>
                    </div>

                    <div 
                        className="h-3 bg-slate-100 dark:bg-bg-main rounded-full overflow-hidden relative cursor-pointer group shadow-inner"
                        onClick={handleSeek}
                    >
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-100 ease-linear shadow-glow"
                            style={{ width: `${progress}%` }}
                        ></div>
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-4 bg-white border-2 border-primary rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ left: `${progress}%` }}></div>
                    </div>

                    <div className="flex items-center justify-center gap-10">
                        <button
                            onClick={onReset}
                            className="p-4 rounded-2xl text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all shadow-soft active:scale-90"
                            title="Restart"
                        >
                            <RotateCcw size={32} />
                        </button>

                        <button
                            onClick={togglePlay}
                            className="size-28 bg-primary hover:bg-primary-hover text-[#0a0c0e] rounded-[2.5rem] flex items-center justify-center shadow-glow hover:shadow-[0_20px_40px_rgba(0,240,255,0.5)] transition-all transform active:scale-95"
                        >
                            {isPlaying ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" className="ml-2" />}
                        </button>

                        <a
                            href={audioUrl}
                            download="podcast.mp3"
                            className="p-4 rounded-2xl text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all shadow-soft flex items-center justify-center active:scale-90"
                            title="Download Audio"
                        >
                            <Download size={32} />
                        </a>
                    </div>
                </div>
            </div>

            <button
                onClick={onReset}
                className="group inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.25em] text-slate-400 hover:text-primary transition-all pb-2 px-1 relative"
            >
                Start New Project
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </button>
        </div>
    );
};
