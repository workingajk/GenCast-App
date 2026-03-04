import React from 'react';
import { Play, Trash2, Plus, User, Download } from 'lucide-react';
import { clsx } from 'clsx';
import { SPEAKER_VOICE_MAP } from '../constants';

export const ScriptEditor = ({
    script,
    setScript,
    onSynthesize,
    isSynthesizing
}) => {

    const [selectedModel, setSelectedModel] = React.useState('edge');

    const updateLine = (id, field, value) => {
        setScript(prev => prev.map(line =>
            line.id === id ? { ...line, [field]: value } : line
        ));
    };

    const removeLine = (id) => {
        setScript(prev => prev.filter(line => line.id !== id));
    };

    const addLine = (afterId) => {
        const idx = script.findIndex(l => l.id === afterId);
        const newLine = {
            id: Math.random().toString(36).substr(2, 9),
            speaker: idx >= 0 ? (script[idx].speaker === 'Host' ? 'Guest' : 'Host') : 'Host',
            text: ''
        };

        const newScript = [...script];
        newScript.splice(idx + 1, 0, newLine);
        setScript(newScript);
    };

    const handleExport = () => {
        const data = JSON.stringify(script, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'podcast-script.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-5xl mx-auto h-[calc(100vh-220px)] flex flex-col text-text-main transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-bold dark:text-white font-heading">Script Editor</h3>
                    <p className="text-text-muted text-sm">Fine-tune the dialogue before generating audio.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        className="px-5 py-3 bg-bg-surface border border-border-main hover:bg-primary/5 hover:border-primary/20 text-text-muted hover:text-text-main rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
                        title="Export Script to JSON"
                    >
                        <Download size={16} />
                        <span className="hidden sm:inline">Export</span>
                    </button>

                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="bg-bg-surface border border-border-main text-text-main text-sm rounded-2xl px-4 py-2 outline-none focus:border-primary/50 cursor-pointer h-full py-3"
                    >
                        <option value="edge">Edge TTS (High Quality)</option>
                        <option value="gtts">gTTS (Standard)</option>
                    </select>

                    <button
                        onClick={() => onSynthesize(selectedModel)}
                        disabled={isSynthesizing}
                        className="px-8 py-3 bg-primary hover:bg-primary-hover disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-text-muted text-[#0a0c0e] rounded-2xl font-bold text-xs uppercase tracking-widest shadow-glow hover:shadow-[0_15px_30px_rgba(0,189,199,0.3)] transition-all flex items-center gap-2"
                    >
                        {isSynthesizing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-[#0a0c0e]/30 border-t-[#0a0c0e] rounded-full animate-spin"></div>
                                <span>Synthesizing...</span>
                            </>
                        ) : (
                            <>
                                <Play size={16} fill="currentColor" />
                                <span>Generate Audio</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-bg-surface rounded-[2rem] border border-border-main overflow-hidden flex flex-col shadow-xl dark:shadow-2xl relative">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                    {script.map((line) => (
                        <div key={line.id} className="group relative flex gap-6 hover:bg-primary/5 p-6 rounded-3xl transition-all border border-transparent hover:border-border-main -mx-4">
                            {/* Speaker Avatar/Selector */}
                            <div className="flex flex-col items-center gap-3 shrink-0 w-28">
                                <div className={clsx(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105",
                                    line.speaker.toLowerCase().includes('host')
                                        ? 'bg-primary/20 text-primary border border-primary/30'
                                        : 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30'
                                )}>
                                    <User size={24} />
                                </div>
                                <div className="space-y-1 w-full text-center">
                                    <input
                                        type="text"
                                        value={line.speaker}
                                        onChange={(e) => updateLine(line.id, 'speaker', e.target.value)}
                                        className="w-full text-[11px] font-bold text-center bg-transparent border-b border-transparent hover:border-border-main focus:border-primary/50 outline-none dark:text-white text-text-main uppercase tracking-widest transition-all"
                                    />
                                    <p className="text-[10px] text-text-muted font-medium">
                                        {SPEAKER_VOICE_MAP[line.speaker] || 'Default Voice'}
                                    </p>
                                </div>
                            </div>

                            {/* Text Editor */}
                            <div className="flex-1">
                                <textarea
                                    value={line.text}
                                    onChange={(e) => updateLine(line.id, 'text', e.target.value)}
                                    className="w-full h-full min-h-[100px] bg-transparent border-0 focus:ring-0 p-0 text-text-muted focus:text-text-main text-lg leading-relaxed resize-none outline-none placeholder:text-text-muted/30"
                                    placeholder="Enter dialogue..."
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => removeLine(line.id)}
                                    className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                    title="Remove line"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button
                                    onClick={() => addLine(line.id)}
                                    className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                                    title="Add line below"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={() => addLine(script[script.length - 1]?.id || '0')}
                        className="w-full py-5 border-2 border-dashed border-border-main rounded-3xl text-text-muted hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-center gap-2 font-bold uppercase text-[11px] tracking-widest"
                    >
                        <Plus size={18} />
                        Add Dialogue Turn
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScriptEditor;
