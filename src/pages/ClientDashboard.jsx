import React, { useState, useEffect, useRef } from 'react';
import { Home, Calendar, User, Heart, Send, X, TrendingUp, CheckCircle, AlertCircle, Moon, Sun, Loader2, Sparkles, ChevronRight, MessageCircle, GraduationCap, MapPin, ShoppingBag, Dumbbell, Coffee, Train, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_MATCHES, MOCK_VISITS, CLIENT_QUESTIONS } from '../data/mockData';

export default function ClientDashboard() {
    const [tab, setTab] = useState('chat');
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [isDark, setIsDark] = useState(true);
    const [visitStatus, setVisitStatus] = useState('idle'); // idle | loading | success
    const [visits, setVisits] = useState(MOCK_VISITS);
    const [matches, setMatches] = useState([]); // Initially empty, populated after chat
    const [savedIds, setSavedIds] = useState(new Set());
    const [isComparing, setIsComparing] = useState(false);
    const [selectedForCompare, setSelectedForCompare] = useState([]);
    const [showCompareModal, setShowCompareModal] = useState(false);

    // Chat State
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
    const chatEndRef = useRef(null);
    const hasChatStarted = useRef(false);

    // Toggle Dark Mode
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    // Chat Effects
    useEffect(() => {
        if (tab === 'chat') {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping, showOptions, tab]);

    // Initial Chat Trigger
    useEffect(() => {
        if (tab === 'chat' && step === 0 && messages.length === 1 && !hasChatStarted.current) {
            hasChatStarted.current = true;
            setTimeout(() => askQuestion(0), 1000);
        }
    }, [tab]);

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
            setSelectedOptions([]); // Reset 
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
            setTimeout(() => {
                setMatches(MOCK_MATCHES); // Populate matches
                setTab('matches');
            }, 3000);
        }, 2000);
    };

    // 2. Updated Request Visit Logic
    const handleRequestVisit = () => {
        setVisitStatus('loading');
        setTimeout(() => {
            const newVisit = {
                id: Date.now(),
                property: selectedProperty.address,
                date: 'Pending Confirmation',
                time: 'TBD',
                status: 'Pending'
            };
            setVisits([newVisit, ...visits]);
            setVisitStatus('success');
        }, 1500);
    };

    const closeModal = () => {
        setSelectedProperty(null);
        setVisitStatus('idle');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white pb-24 relative transition-colors duration-300">
            {/* Header */}
            <div className="sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md p-4 z-20 border-b border-gray-200 dark:border-white/5 flex justify-between items-center transition-colors">
                <div className="flex items-center gap-3">
                    <h1 className="text-lg font-bold">
                        {tab === 'matches' && 'Your Matches'}
                        {tab === 'saved' && 'Saved Homes'}
                        {tab === 'visits' && 'Scheduled Visits'}
                        {tab === 'profile' && 'Profile'}
                        {tab === 'chat' && 'AI Assistant'}
                    </h1>
                    {tab === 'chat' && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold tracking-wider uppercase border border-indigo-200 dark:border-indigo-500/20">
                            Beta
                        </span>
                    )}
                </div>

            </div>

            <div className="h-full">
                {/* Chat Tab */}
                {tab === 'chat' && (
                    <div className="flex flex-col h-[calc(100vh-140px)]">
                        <div className="flex-1 overflow-y-auto w-full max-w-3xl mx-auto p-4 space-y-6 scroll-smooth no-scrollbar">
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
                            <div ref={chatEndRef} className="h-4" />
                        </div>

                        {/* Interactive Area */}
                        <div className="p-4 pt-2">
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
                            <div className="relative max-w-3xl mx-auto">
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
                )}

                {/* Matches & Saved Tabs */}
                {(tab === 'matches' || tab === 'saved' || tab === 'visits' || tab === 'profile') && (
                    <div className="p-4 space-y-4 pb-24">
                        {(tab === 'matches' || tab === 'saved') && (
                            (() => {
                                const displayedMatches = tab === 'saved'
                                    ? matches.filter(m => savedIds.has(m.id))
                                    : matches;

                                if (displayedMatches.length === 0) {
                                    return (
                                        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                                            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
                                                {tab === 'saved' ? <Heart size={32} className="text-red-500" /> : <Sparkles size={32} className="text-indigo-500 dark:text-indigo-400" />}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                                {tab === 'saved' ? 'No Saved Properties' : 'No Matches Yet'}
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mb-8">
                                                {tab === 'saved' ? 'Tap the heart icon on any property to save it here for later.' : 'Chat with our AI Assistant to help us understand your dream home criteria.'}
                                            </p>
                                            {tab === 'matches' && <button
                                                onClick={() => setTab('chat')}
                                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25"
                                            >
                                                Start AI Chat
                                            </button>}
                                        </div>
                                    );
                                }

                                return (
                                    <>
                                        {/* Banner - Matches Only */}
                                        {tab === 'matches' && (
                                            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-500/20 mb-6 flex items-start gap-3">
                                                <div className="p-2 bg-indigo-500 rounded-lg shrink-0">
                                                    <Send size={16} className="text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Shared by Alex</h3>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                                        “Based on our chat, I’ve shortlisted these {matches.length} homes. Tap any card for full AI analysis.”
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Compare Toggle */}
                                        <div className="flex justify-end px-2 mb-2">
                                            <button
                                                onClick={() => {
                                                    setIsComparing(!isComparing);
                                                    setSelectedForCompare([]);
                                                    setShowCompareModal(false);
                                                }}
                                                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${isComparing
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10'
                                                    }`}
                                            >
                                                {isComparing ? <X size={14} /> : <TrendingUp size={14} />}
                                                {isComparing ? 'Cancel Compare' : 'Compare Properties'}
                                            </button>
                                        </div>

                                        {/* List */}
                                        {displayedMatches.map((p) => (
                                            <motion.div
                                                key={p.id}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    if (isComparing) {
                                                        if (selectedForCompare.includes(p.id)) {
                                                            setSelectedForCompare(prev => prev.filter(id => id !== p.id));
                                                        } else {
                                                            if (selectedForCompare.length < 3) {
                                                                setSelectedForCompare(prev => [...prev, p.id]);
                                                            }
                                                        }
                                                    } else {
                                                        setSelectedProperty(p);
                                                    }
                                                }}
                                                className={`rounded-[1.5rem] border overflow-hidden group shadow-md dark:shadow-lg cursor-pointer transition-all hover:border-indigo-500/30 ${isComparing && selectedForCompare.includes(p.id)
                                                    ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500 ring-2 ring-indigo-500'
                                                    : 'bg-white dark:bg-[#121212] border-gray-100 dark:border-white/5'
                                                    }`}
                                            >
                                                <div className="relative h-48">
                                                    <img src={p.image} alt={p.address} className="w-full h-full object-cover" />
                                                    {/* Selection Indicator for Compare Mode */}
                                                    {isComparing && (
                                                        <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10 ${selectedForCompare.includes(p.id) ? 'bg-indigo-600 text-white' : 'bg-black/40 text-transparent border-2 border-white'
                                                            }`}>
                                                            <CheckCircle size={16} className={selectedForCompare.includes(p.id) ? 'opacity-100' : 'opacity-0'} />
                                                        </div>
                                                    )}

                                                    {!isComparing && (
                                                        <div
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSavedIds(prev => {
                                                                    const next = new Set(prev);
                                                                    if (next.has(p.id)) next.delete(p.id);
                                                                    else next.add(p.id);
                                                                    return next;
                                                                });
                                                            }}
                                                            className={`absolute top-3 right-3 w-8 h-8 backdrop-blur-md rounded-full flex items-center justify-center transition-all ${savedIds.has(p.id) ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-black/60'
                                                                }`}
                                                        >
                                                            <Heart size={16} fill={savedIds.has(p.id) ? "currentColor" : "none"} />
                                                        </div>
                                                    )}

                                                    {p.tags.includes('Realtor Pick') && (
                                                        <div className="absolute top-3 left-3 bg-indigo-600 text-[10px] font-bold px-2 py-1 rounded-full shadow-lg text-white">
                                                            Realtor Pick
                                                        </div>
                                                    )}
                                                    {/* AI Score Badge on Card */}
                                                    <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-black/60 backdrop-blur-md border border-gray-200 dark:border-white/10 px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 animate-pulse" />
                                                        <span className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-wider">AI Match</span>
                                                        <span className="text-xs font-bold text-green-600 dark:text-green-400">{p.aiScore}%</span>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white max-w-[70%] leading-tight">{p.address}</h2>
                                                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">{p.price}</span>
                                                    </div>
                                                    <p className="text-gray-500 text-xs mb-3">
                                                        {p.city} • {p.beds} Beds • {p.baths} Baths
                                                    </p>
                                                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 mb-4 flex items-center gap-2 border border-gray-100 dark:border-transparent">
                                                        <TrendingUp size={14} className="text-indigo-500 dark:text-indigo-400 shrink-0" />
                                                        <p className="text-xs text-gray-600 dark:text-gray-300 italic truncate">“{p.matchReason}”</p>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (!isComparing) setSelectedProperty(p);
                                                        }}
                                                        disabled={isComparing}
                                                        className={`w-full font-bold py-3 rounded-xl text-sm transition-colors shadow-sm ${isComparing
                                                            ? 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed'
                                                            : 'bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {isComparing
                                                            ? (selectedForCompare.includes(p.id) ? 'Selected' : 'Tap to Compare')
                                                            : 'Request Visit'}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </>
                                );
                            })()
                        )}

                        {/* Visits Tab */}
                        {tab === 'visits' && (
                            <div className="space-y-3">
                                {/* 3. Render dynamic visits */}
                                {visits.map((v) => (
                                    <div key={v.id} className="bg-white dark:bg-[#121212] p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center justify-between shadow-sm">
                                        <div>
                                            <div className="text-xs font-bold text-gray-500 uppercase mb-1">
                                                {v.date} • {v.time}
                                            </div>
                                            <h3 className="text-gray-900 dark:text-white font-bold text-sm truncate max-w-[200px]">{v.property}</h3>
                                        </div>
                                        <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${v.status === 'Confirmed' ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20' : 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20'}`}>
                                            {v.status}
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-8 p-6 text-center text-gray-500">
                                    <Calendar size={32} className="mx-auto mb-3 opacity-50" />
                                    <p className="text-sm">No more upcoming visits.</p>
                                </div>
                            </div>
                        )}

                        {/* Profile Tab */}
                        {tab === 'profile' && (
                            <div className="space-y-6">
                                <div className="text-center pt-4">
                                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-3 overflow-hidden border-2 border-white/50 dark:border-white/10 shadow-lg">
                                        <img
                                            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&q=80"
                                            alt="avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Yash</h2>
                                    <p className="text-sm text-gray-500">Client</p>
                                </div>

                                {/* Dark Mode Toggle */}
                                <div className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-white/5 p-4 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-100 dark:bg-white/5 rounded-lg text-indigo-600 dark:text-indigo-400">
                                            {isDark ? <Moon size={20} /> : <Sun size={20} />}
                                        </div>
                                        <span className="font-medium text-sm">Dark Mode</span>
                                    </div>
                                    <button
                                        onClick={() => setIsDark(!isDark)}
                                        className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${isDark ? 'bg-indigo-600' : 'bg-gray-300'}`}
                                    >
                                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-sm ${isDark ? 'left-6' : 'left-1'}`} />
                                    </button>
                                </div>

                                <div className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
                                    <div className="p-4 border-b border-gray-100 dark:border-white/5">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Preferences</h3>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <Row label="Budget" value="$800k‑$1.2M" />
                                        <Row label="Location" value="San Jose, CA" />
                                        <Row label="Bedrooms" value="3+" />
                                        <Row label="Must‑have" value="Top Schools" />
                                    </div>
                                </div>

                                <button className="w-full text-red-500 text-sm font-bold py-4 bg-white dark:bg-[#121212] hover:bg-red-50 dark:hover:bg-white/5 rounded-xl transition-colors border border-gray-100 dark:border-white/5 shadow-sm">
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* AI Insight Modal */}
            <AnimatePresence>
                {selectedProperty && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />

                        {/* Modal Sheet */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1A1A1A] rounded-t-[2rem] border-t border-gray-200 dark:border-white/10 overflow-hidden max-w-sm mx-auto w-full md:max-w-2xl shadow-2xl"
                            style={{ maxHeight: '85vh' }}
                        >
                            {/* Drag Handle */}
                            <div className="w-full h-6 flex items-center justify-center pt-2 cursor-pointer" onClick={closeModal}>
                                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
                            </div>

                            <div className="p-6 pb-8 space-y-6 overflow-y-auto no-scrollbar" style={{ maxHeight: 'calc(85vh - 24px)' }}>

                                {/* Modal Header */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-none mb-1">{selectedProperty.address}</h2>
                                        <span className="text-indigo-600 dark:text-indigo-400 text-lg font-bold">{selectedProperty.price}</span>
                                    </div>
                                    <button onClick={closeModal} className="p-2 bg-gray-100 dark:bg-white/5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:text-white transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Description */}
                                {selectedProperty.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {selectedProperty.description}
                                    </p>
                                )}

                                {/* Features */}
                                {selectedProperty.features && (
                                    <div className="space-y-2">
                                        {selectedProperty.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                <span className="text-sm text-gray-700 dark:text-gray-200">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Nearby Amenities */}
                                {selectedProperty.nearbyAmenities && (
                                    <div className="grid grid-cols-3 gap-3">
                                        {selectedProperty.nearbyAmenities.map((amenity, idx) => {
                                            const Icon = getAmenityIcon(amenity.type);
                                            return (
                                                <div key={idx} className="bg-gray-50 dark:bg-white/5 p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1 border border-gray-100 dark:border-white/5">
                                                    <Icon size={18} className="text-indigo-500 mb-1" />
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{amenity.distance}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* AI Score Overview */}
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/40 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl p-5 flex items-center gap-5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500/10 dark:bg-indigo-500/20 blur-2xl rounded-full" />

                                    {/* Donut Chart Simulation */}
                                    <div className="relative shrink-0 w-20 h-20">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                            <path className="text-gray-200 dark:text-gray-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                            <path className="text-indigo-600 dark:text-indigo-500" strokeDasharray={`${selectedProperty.aiScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                                            <span className="text-lg font-bold text-gray-900 dark:text-white">{selectedProperty.aiScore}%</span>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold text-indigo-600 dark:text-indigo-300 uppercase tracking-widest mb-1">AI Compatibility</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-tight">This home matches <span className="text-gray-900 dark:text-white font-bold">98%</span> of your preferences.</p>
                                    </div>
                                </div>

                                {/* Investment Rating */}
                                <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 dark:bg-green-500/20 rounded-lg text-green-600 dark:text-green-400">
                                            <TrendingUp size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Investment Rating</p>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">Projected Growth: High</p>
                                        </div>
                                    </div>
                                    <div className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter opacity-80">{selectedProperty.investmentRating}</div>
                                </div>

                                {/* Pros & Cons */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest flex items-center gap-2">
                                            <CheckCircle size={12} /> The Upside
                                        </h4>
                                        <ul className="space-y-2">
                                            {selectedProperty.pros.map((pro, i) => (
                                                <li key={i} className="text-xs text-gray-600 dark:text-gray-300 leading-normal border-l-2 border-green-500/30 pl-2">
                                                    {pro}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-widest flex items-center gap-2">
                                            <AlertCircle size={12} /> The Tradeoff
                                        </h4>
                                        <ul className="space-y-2">
                                            {selectedProperty.cons.map((con, i) => (
                                                <li key={i} className="text-xs text-gray-600 dark:text-gray-300 leading-normal border-l-2 border-yellow-500/30 pl-2">
                                                    {con}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <button
                                    onClick={handleRequestVisit}
                                    disabled={visitStatus !== 'idle'}
                                    className={`w-full py-4 rounded-xl text-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2
                    ${visitStatus === 'success'
                                            ? 'bg-green-500 hover:bg-green-600 text-white'
                                            : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'
                                        }
                  `}
                                >
                                    {visitStatus === 'idle' && 'Schedule Private Tour'}
                                    {visitStatus === 'loading' && <><Loader2 className="animate-spin" /> Booking...</>}
                                    {visitStatus === 'success' && <><CheckCircle /> Request Sent!</>}
                                </button>

                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Compare Floating Button */}
            <AnimatePresence>
                {isComparing && selectedForCompare.length >= 2 && !showCompareModal && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-24 left-0 right-0 z-40 flex justify-center px-4"
                    >
                        <button
                            onClick={() => setShowCompareModal(true)}
                            className="bg-gray-900 dark:bg-white text-white dark:text-black font-bold py-3.5 px-8 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition-transform"
                        >
                            <TrendingUp size={18} />
                            Compare ({selectedForCompare.length})
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Comparison Modal */}
            <AnimatePresence>
                {showCompareModal && (
                    <motion.div
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        className="fixed inset-0 z-50 bg-gray-50 dark:bg-[#0E0E0E] flex flex-col"
                    >
                        <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#121212] flex items-center justify-between">
                            <h2 className="text-lg font-bold">Comparing {selectedForCompare.length} Homes</h2>
                            <button
                                onClick={() => setShowCompareModal(false)}
                                className="p-2 bg-gray-100 dark:bg-white/5 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4">
                            {selectedForCompare.map(id => {
                                const p = matches.find(m => m.id === id);
                                return (
                                    <div key={p.id} className="space-y-4">
                                        <div className="aspect-[4/3] rounded-xl overflow-hidden relative">
                                            <img src={p.image} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <p className="absolute bottom-2 left-2 text-white font-bold text-sm">{p.price}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm leading-tight mb-1">{p.address}</h3>
                                            <p className="text-xs text-gray-500">{p.sqft} sqft</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Specs</p>
                                                <div className="text-xs font-semibold">{p.beds} Bed • {p.baths} Bath</div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">AI Score</p>
                                                <div className="text-sm font-bold text-green-600 dark:text-green-400">{p.aiScore}% Match</div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Investment</p>
                                                <div className="text-xs font-semibold">{p.investmentRating}</div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Top Feature</p>
                                                <div className="text-xs text-gray-600 dark:text-gray-300">{p.features?.[0] || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 p-2 pb-6 z-30 transition-colors">
                <div className="flex justify-around items-center">
                    <NavBtn icon={MessageCircle} label="Assistant" active={tab === 'chat'} onClick={() => setTab('chat')} />
                    <NavBtn icon={Home} label="Matches" active={tab === 'matches'} onClick={() => setTab('matches')} />
                    <NavBtn icon={Heart} label="Saved" active={tab === 'saved'} onClick={() => setTab('saved')} />
                    <NavBtn icon={Calendar} label="Visits" active={tab === 'visits'} onClick={() => setTab('visits')} />
                    <NavBtn icon={User} label="Profile" active={tab === 'profile'} onClick={() => setTab('profile')} />
                </div>
            </div>
        </div>
    );
}

function getAmenityIcon(type) {
    switch (type) {
        case 'School': return GraduationCap;
        case 'Park': return MapPin;
        case 'Shopping': return ShoppingBag;
        case 'Gym': return Dumbbell;
        case 'Cafe': return Coffee;
        case 'Transit': return Train;
        case 'Entertainment': return Music;
        default: return MapPin;
    }
}

function Row({ label, value }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 dark:text-gray-500">{label}</span>
            <span className="text-gray-900 dark:text-white font-medium">{value}</span>
        </div>
    );
}

function NavBtn({ icon: Icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors w-16 ${active ? 'text-indigo-600 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-400'
                }`}
        >
            <Icon size={22} strokeWidth={active ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{label}</span>
        </button>
    );
}
