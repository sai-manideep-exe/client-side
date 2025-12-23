import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
    const navigate = useNavigate();
    const [code, setCode] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (code) navigate('/app');
    };

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Background glows */}
            <div className="absolute inset-0 bg-black z-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/20 rounded-full blur-[80px]" />
            </div>

            <div className="relative z-10 w-full max-w-xs space-y-8">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center text-center"
                >
                    <div className="w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-xl flex items-center justify-center mb-6 ring-1 ring-white/10 shadow-2xl">
                        <Sparkles className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">AI4Realtor</h1>
                    <p className="text-gray-400 text-sm">Your personal real‑estate journey starts here.</p>
                </motion.div>

                {/* Invite Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-xl"
                >
                    <div className="flex items-center gap-3 mb-6 p-3 bg-white/5 rounded-2xl border border-white/5">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 overflow-hidden shrink-0">
                            <img
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=128&q=80"
                                alt="Realtor"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Invited by</p>
                            <p className="text-sm font-bold text-white">Alex Thompson</p>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-2">Access Code</label>
                            <div className="relative">
                                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    type="password"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="••••••"
                                    className="w-full bg-black/40 border border-white/10 text-white text-center text-xl font-bold tracking-widest rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-700"
                                />
                            </div>
                        </div>

                        <button
                            disabled={!code}
                            className="w-full bg-white text-black font-bold p-4 rounded-2xl mt-4 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Begin Journey <ArrowRight size={18} />
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
