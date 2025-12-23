import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, User, Send, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CLIENT_QUESTIONS } from '../data/mockData';

export default function AIChat() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: "Hello! I'm your sophisticated real estate AI. I'm here to find your exceptional home. Let's begin."
        },
    ]);
    const [step, setStep] = useState(0);
    const [showOptions, setShowOptions] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const endRef = useRef(null);

    // Ref to track if the initial question has been triggered
    const hasStarted = useRef(false);

    const scroll = () => endRef.current?.scrollIntoView({ behavior: 'smooth' });

    useEffect(() => {
        scroll();
    }, [messages, isTyping, showOptions]);

    // Initial question trigger (prevent double firing)
    useEffect(() => {
        if (step === 0 && messages.length === 1 && !hasStarted.current) {
            hasStarted.current = true;
            setTimeout(() => askQuestion(0), 1000);
        }
    }, []);

    const askQuestion = (i) => {
        if (i >= CLIENT_QUESTIONS.length) {
            finishChat();
            return;
        }
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages((m) => [...m, { type: 'bot', text: CLIENT_QUESTIONS[i].text }]);
            setShowOptions(true);
            setSelectedOptions([]); // Reset selections for new question
        }, 1500);
    };

    const handleOptionToggle = (option) => {
        setSelectedOptions(prev => {
            if (prev.includes(option)) {
                return prev.filter(o => o !== option);
            } else {
                return [...prev, option];
            }
        });
    };

    const handleSend = () => {
        if (selectedOptions.length === 0) return;

        const answer = selectedOptions.join(', ');
        setShowOptions(false);
        setMessages((m) => [...m, { type: 'user', text: answer }]);
        setTimeout(() => {
            const next = step + 1;
            setStep(next);
            askQuestion(next);
        }, 800);
    };

    const finishChat = () => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages((m) => [...m, { type: 'bot', text: "Perfect. I've curated a list of exclusive properties that match your criteria. Analyzing market data now..." }]);
            setTimeout(() => navigate('/app'), 3000);
        }, 2000);
    };

    return (
        <div className="flex flex-col h-screen bg-[#F0F2F5] dark:bg-[#0E0E0E] text-gray-900 dark:text-[#E3E3E3] font-sans transition-colors duration-300">

            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between bg-white/80 dark:bg-[#0E0E0E]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 sticky top-0 z-10 transition-colors">
                <div className="flex items-center gap-3">
                    <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                        Gemini Estate
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold tracking-wider uppercase border border-indigo-200 dark:border-indigo-500/20">
                        Beta
                    </span>
                </div>
            </div>

            {/* Chat Container */}
            <div className="flex-1 overflow-y-auto w-full max-w-3xl mx-auto p-4 sm:p-6 space-y-6 scroll-smooth no-scrollbar">
                <AnimatePresence mode='popLayout'>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className={`flex gap-3 sm:gap-4 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {/* Bot Avatar */}
                            {msg.type === 'bot' && (
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[1.5px] shadow-sm">
                                        <div className="w-full h-full rounded-full bg-white dark:bg-[#0E0E0E] flex items-center justify-center">
                                            <Sparkles size={14} className="text-indigo-500 dark:text-indigo-300" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Message Bubble */}
                            <div
                                className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${msg.type === 'user' ? 'items-end' : 'items-start'
                                    }`}
                            >
                                <div
                                    className={`relative px-5 py-3.5 text-[0.95rem] leading-relaxed shadow-sm
                    ${msg.type === 'user'
                                            ? 'bg-indigo-600 text-white rounded-[20px] rounded-br-[4px]'
                                            : 'bg-white dark:bg-[#2A2A2A] text-gray-800 dark:text-gray-200 rounded-[20px] rounded-tl-[4px] border border-gray-100 dark:border-white/5'
                                        }
                  `}
                                >
                                    {msg.text}
                                </div>
                            </div>

                            {/* User Avatar */}
                            {msg.type === 'user' && (
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#2A2A2A] flex items-center justify-center border border-gray-300 dark:border-white/5 text-gray-500 dark:text-gray-400">
                                        <User size={14} />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-4 justify-start w-full max-w-3xl mx-auto pl-1"
                        >
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[1.5px] opacity-70">
                                    <div className="w-full h-full rounded-full bg-white dark:bg-[#0E0E0E] flex items-center justify-center">
                                        <Sparkles size={14} className="text-indigo-400" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-[#2A2A2A] border border-gray-100 dark:border-white/5 px-4 py-3 rounded-[20px] rounded-tl-[4px] flex items-center gap-1.5 shadow-sm h-11">
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_0ms]" />
                                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-[bounce_1s_infinite_200ms]" />
                                <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-[bounce_1s_infinite_400ms]" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div ref={endRef} className="h-24" />
            </div>

            {/* Interactive Footer */}
            <div className="fixed bottom-0 left-0 right-0 w-full bg-[#F0F2F5]/90 dark:bg-[#0E0E0E]/90 backdrop-blur-lg pt-4 pb-6 px-4 z-20 border-t border-gray-200 dark:border-white/5 transition-colors">
                <div className="max-w-2xl mx-auto">
                    <AnimatePresence>
                        {showOptions ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="flex flex-wrap gap-2.5 justify-center mb-4"
                            >
                                {CLIENT_QUESTIONS[step].options.map((opt, idx) => {
                                    const isSelected = selectedOptions.includes(opt);
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleOptionToggle(opt)}
                                            className={`group relative px-5 py-2.5 rounded-full border shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 text-sm font-medium
                                                ${isSelected
                                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                                    : 'bg-white dark:bg-[#1E1E1E] text-gray-800 dark:text-gray-200 border-gray-200 dark:border-white/10 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-white dark:hover:bg-[#252525]'
                                                }`}
                                        >
                                            {opt}
                                            {isSelected && <Sparkles size={14} className="text-white animate-pulse" />}
                                        </button>
                                    );
                                })}
                            </motion.div>
                        ) : null}
                    </AnimatePresence>

                    {/* Input Area */}
                    <div className="relative">
                        <input
                            type="text"
                            value={selectedOptions.join(', ')}
                            readOnly
                            placeholder="Select options above..."
                            className="w-full h-12 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-full px-5 text-gray-900 dark:text-gray-100 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium placeholder-gray-400"
                        />
                        <button
                            onClick={handleSend}
                            disabled={selectedOptions.length === 0}
                            className={`absolute right-1.5 top-1.5 bottom-1.5 aspect-square rounded-full flex items-center justify-center text-white shadow-sm transition-all duration-200 ${selectedOptions.length > 0
                                    ? 'bg-indigo-500 hover:bg-indigo-600 active:scale-95'
                                    : 'bg-gray-300 dark:bg-[#2A2A2A] text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
