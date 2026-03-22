import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authService.register(username, email, password);
            navigate('/');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-bg-main text-text-main relative overflow-hidden transition-colors duration-500 font-sans">
            {/* Ambient Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            
            <div className="w-full max-w-[540px] p-6 relative z-10">
                <div className="bg-white dark:bg-bg-surface rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-10 md:p-14 shadow-xl-saas relative overflow-hidden transition-all duration-300">
                    <div className="absolute top-0 right-0 p-8">
                        <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black shadow-glow border border-primary/20">
                            GC
                        </div>
                    </div>
                    <div className="mb-12">
                        <h2 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">Start Creating</h2>
                        <p className="text-sm font-medium text-slate-500 dark:text-text-muted">
                            Already registered?{' '}
                            <Link to="/login" className="text-primary hover:text-primary-hover font-bold decoration-primary/30 underline-offset-4 underline">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <form className="space-y-8" onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-3 ml-1">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 dark:bg-bg-main border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white px-6 py-4.5 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                    placeholder="choose_username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-3 ml-1">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-slate-50 dark:bg-bg-main border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white px-6 py-4.5 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-3 ml-1">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full bg-slate-50 dark:bg-bg-main border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white px-6 py-4.5 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-white text-xs font-bold bg-red-500/90 p-4 rounded-xl shadow-lg animate-shake">
                                {error}
                            </div>
                        )}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-primary hover:bg-primary-hover text-[#0a0c0e] transition-all rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-glow hover:shadow-[0_15px_30px_rgba(0,240,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                            >
                                {loading ? 'Creating Identity...' : 'Join the Revolution'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
