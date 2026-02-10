import React from 'react';
import { clsx } from 'clsx';

const steps = [
    { id: 'input', label: 'Topic & Config' },
    { id: 'planning', label: 'Research & Plan' },
    { id: 'scripting', label: 'Script Editor' },
    { id: 'audio', label: 'Audio Synthesis' },
];

export const StepIndicator = ({ currentStep }) => {
    const currentIdx = steps.findIndex(s => s.id === currentStep);

    return (
        <div className="w-full max-w-4xl mx-auto mb-8 px-4">
            <div className="relative flex justify-between">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -z-10 -translate-y-1/2 rounded-full"></div>
                <div
                    className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary/50 to-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(0,189,199,0.3)]"
                    style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((step, idx) => {
                    const isActive = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;
                    return (
                        <div key={step.id} className="flex flex-col items-center gap-3 bg-bg-main px-2 relative z-10 transition-colors duration-300">
                            <div
                                className={clsx(
                                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300",
                                    isActive 
                                        ? "bg-primary border-primary text-[#0a0c0e] shadow-glow" 
                                        : "bg-bg-main border-border-main text-text-muted",
                                    isCurrent && "ring-4 ring-primary/20 scale-110"
                                )}
                            >
                                {idx + 1}
                            </div>
                            <span
                                className={clsx(
                                    "text-[10px] font-bold uppercase tracking-widest hidden sm:block transition-colors",
                                    isActive ? "text-primary" : "text-text-muted"
                                )}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
