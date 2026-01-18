import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { Home, Calendar, User, Heart, Send, X, TrendingUp, CheckCircle, AlertCircle, Moon, Sun, Loader2, Sparkles, ChevronRight, MessageCircle, GraduationCap, MapPin, ShoppingBag, Dumbbell, Coffee, Train, Music, Map, Clock, DollarSign, Eye, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MOCK_MATCHES, MOCK_VISITS, CLIENT_QUESTIONS } from '../data/mockData';
import { useBrand } from '../context/BrandContext';
import VirtualTour from '../components/VirtualTour';
import MortgageCalculator from '../components/MortgageCalculator';
import 'leaflet/dist/leaflet.css';

export default function ClientDashboard() {
    const navigate = useNavigate();
    const { name: brandName, aiName, theme } = useBrand();
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
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'

    // Schedule Visit State
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');

    // Property Chat State
    const [showPropertyChat, setShowPropertyChat] = useState(false);

    // Property Modal Tab State
    const [modalTab, setModalTab] = useState('overview'); // 'overview' | 'tour' | 'calculator'

    // Chat State
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: `Hi Yash! I'm ${aiName}, your private concierge for ${brandName}. Let's find your exceptional home.`
        },
    ]);
    const [step, setStep] = useState(0);
    const [showOptions, setShowOptions] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [inputText, setInputText] = useState('');
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
            const next = prev.includes(option)
                ? prev.filter(o => o !== option)
                : [...prev, option];
            setInputText(next.join(', '));
            return next;
        });
    };

    const handleSend = () => {
        if (!inputText.trim()) return;

        const answer = inputText;
        setSelectedOptions([]);
        setInputText(''); // Clear input immediately
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
    // 2. Updated Request Visit Logic (Opens Modal)
    const handleRequestVisit = () => {
        setShowScheduleModal(true);
    };

    const confirmVisit = (e) => {
        e.preventDefault();
        setVisitStatus('loading');
        setShowScheduleModal(false); // Close modal immediately to show loading on button or handle nicely

        // Simulate API call
        setTimeout(() => {
            // Format Date and Time
            let formattedDate = 'TBD';
            let formattedTime = 'TBD';

            if (scheduleDate && scheduleTime) {
                const dateObj = new Date(`${scheduleDate}T${scheduleTime}`);
                if (!isNaN(dateObj.getTime())) {
                    formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
                    formattedTime = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                } else {
                    // Fallback if parsing fails but strings exist
                    formattedDate = scheduleDate;
                    formattedTime = scheduleTime;
                }
            }

            const newVisit = {
                id: Date.now(),
                property: selectedProperty.address,
                date: formattedDate,
                time: formattedTime,
                status: 'Pending'
            };
            setVisits(prev => {
                const filtered = prev.filter(v => !(v.property === selectedProperty.address && (v.status === 'Reschedule' || v.status === 'Declined' || v.status === 'Action Needed')));
                return [newVisit, ...filtered];
            });
            setVisitStatus('success');

            // Reset form
            setScheduleDate('');
            setScheduleTime('');
        }, 1500);
    };

    const closeModal = () => {
        setSelectedProperty(null);
        setVisitStatus('idle');
        setShowScheduleModal(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white pb-24 md:pb-0 relative transition-colors duration-300 md:flex">

            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-col w-64 border-r border-gray-200 dark:border-white/5 bg-white dark:bg-black p-4 z-40 sticky top-0 h-screen">
                <div className="flex items-center gap-3 px-4 mb-8">
                    <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/30">
                        <Sparkles size={16} className="text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg tracking-tight">{aiName}</h2>
                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider transform -translate-y-0.5 block">{brandName}</span>
                    </div>
                </div>

                <div className="flex-1 space-y-1">
                    <NavSidebarItem icon={MessageCircle} label="Assistant" active={tab === 'chat'} onClick={() => setTab('chat')} />
                    <NavSidebarItem icon={Home} label="Matches" active={tab === 'matches'} onClick={() => setTab('matches')} />
                    <NavSidebarItem icon={Heart} label="Saved" active={tab === 'saved'} onClick={() => setTab('saved')} />
                    <NavSidebarItem icon={Calendar} label="Visits" active={tab === 'visits'} onClick={() => setTab('visits')} />
                    <NavSidebarItem icon={User} label="Profile" active={tab === 'profile'} onClick={() => setTab('profile')} />
                </div>

                <div className="mt-auto border-t border-gray-100 dark:border-white/5 pt-4">
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-sm font-medium text-gray-600 dark:text-gray-400"
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        {isDark ? "Light Mode" : "Dark Mode"}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 h-screen md:overflow-y-auto">
                {/* Header (Mobile Only) */}
                <div className="sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md p-4 z-20 border-b border-gray-200 dark:border-white/5 flex justify-between items-center transition-colors md:hidden">
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-bold">
                            {tab === 'matches' && 'Your Matches'}
                            {tab === 'saved' && 'Saved Homes'}
                            {tab === 'visits' && 'Scheduled Visits'}
                            {tab === 'profile' && 'Profile'}
                            {tab === 'chat' && aiName}
                        </h1>
                        {tab === 'chat' && (
                            <span className="px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold tracking-wider uppercase border border-indigo-200 dark:border-indigo-500/20 inline-flex items-center justify-center leading-none">
                                Beta
                            </span>
                        )}
                    </div>
                </div>

                <div className="h-full">
                    {/* Chat Tab */}
                    {tab === 'chat' && (
                        <div className="flex flex-col h-screen md:h-screen relative">
                            <div className="flex-1 overflow-y-auto w-full p-4 pb-48 space-y-6 scroll-smooth no-scrollbar md:max-w-4xl md:mx-auto">
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
                                                    className={`relative px-5 py-3.5 text-[0.95rem] leading-relaxed shadow-sm rounded-[20px]
                                ${msg.type === 'user'
                                                            ? 'text-white rounded-br-[4px]'
                                                            : 'bg-white dark:bg-[#2A2A2A] text-gray-800 dark:text-gray-200 rounded-tl-[4px] border border-gray-100 dark:border-white/5'
                                                        }
                            `}
                                                    style={msg.type === 'user' ? { backgroundColor: 'var(--brand-primary)' } : {}}
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

                                {/* Options (Moved into flow) */}
                                <AnimatePresence>
                                    {showOptions && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="flex flex-wrap gap-2.5 justify-end py-4"
                                        >
                                            {CLIENT_QUESTIONS[step].options.map((opt, idx) => {
                                                const isSelected = selectedOptions.includes(opt);
                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleOptionToggle(opt)}
                                                        className={`group relative px-5 py-2.5 rounded-full border shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 text-sm font-medium
                                                        ${isSelected
                                                                ? 'text-white'
                                                                : 'bg-white dark:bg-[#1E1E1E] text-gray-800 dark:text-gray-200 border-gray-200 dark:border-white/10 dark:hover:text-white dark:hover:bg-[#252525]'
                                                            }`}
                                                        style={isSelected ? { backgroundColor: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' } : {}}
                                                    >
                                                        {opt}
                                                    </button>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div ref={chatEndRef} className="h-4" />
                            </div>

                            {/* Floating Input Area */}
                            <div className="fixed bottom-[90px] left-4 right-4 md:static md:bottom-auto md:left-auto md:right-auto md:w-full z-50">
                                {/* Pill Container */}
                                <div className="relative w-full bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-full px-2 shadow-2xl flex items-center">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Type or select options..."
                                        className="flex-1 h-14 bg-transparent border-none px-4 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-0 font-medium placeholder-gray-400"
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!inputText.trim()}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm transition-all duration-200 shrink-0 ml-2 ${inputText.trim()
                                            ? 'hover:opacity-90 active:scale-95'
                                            : 'bg-gray-300 dark:bg-[#2A2A2A] text-gray-400 cursor-not-allowed'
                                            }`}
                                        style={inputText.trim() ? { backgroundColor: 'var(--brand-primary)' } : {}}
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Matches & Saved Tabs */}
                    {(tab === 'matches' || tab === 'saved' || tab === 'visits' || tab === 'profile') && (
                        <div className="p-4 space-y-4 pb-24 md:p-8 md:max-w-7xl md:mx-auto">
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
                                        <React.Fragment>
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

                                            {/* Controls */}
                                            <div className="flex justify-between items-center px-2 mb-4">
                                                <div className="hidden md:block">
                                                    <h2 className="text-2xl font-bold">Your Matches</h2>
                                                    <p className="text-xs text-gray-500">Based on your preferences</p>
                                                </div>
                                                {/* View Toggle */}
                                                <div className="bg-white dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10 flex gap-1">
                                                    <button
                                                        onClick={() => setViewMode('list')}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${viewMode === 'list'
                                                            ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-md'
                                                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                                            }`}
                                                    >
                                                        <Home size={14} /> List
                                                    </button>
                                                    <button
                                                        onClick={() => setViewMode('map')}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${viewMode === 'map'
                                                            ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-md'
                                                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                                            }`}
                                                    >
                                                        <Map size={14} /> Map
                                                    </button>
                                                </div>

                                                {/* Compare Toggle */}
                                                {viewMode === 'list' && displayedMatches.length > 1 && (
                                                    <button
                                                        onClick={() => {
                                                            setIsComparing(!isComparing);
                                                            setSelectedForCompare([]);
                                                            setShowCompareModal(false);
                                                        }}
                                                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${isComparing
                                                            ? 'text-white'
                                                            : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10'
                                                            }`}
                                                        style={isComparing ? { backgroundColor: 'var(--brand-primary)' } : {}}
                                                    >
                                                        {isComparing ? <X size={14} /> : <TrendingUp size={14} />}
                                                        {isComparing ? 'Cancel' : 'Compare'}
                                                    </button>
                                                )}
                                            </div>

                                            {/* Compare Floating Action Button (Moved to global overlay) */}

                                            {/* Content */}
                                            {viewMode === 'map' ? (
                                                <div className="h-[60vh] md:h-[80vh] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-inner relative z-0">
                                                    <MapContainer
                                                        center={[37.3382, -121.8863]}
                                                        zoom={11}
                                                        style={{ height: '100%', width: '100%' }}
                                                        className="z-0"
                                                    >
                                                        <TileLayer
                                                            url={isDark
                                                                ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                                                                : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
                                                            }
                                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                                        />
                                                        {displayedMatches.map(p => (
                                                            p.coordinates && (
                                                                <Marker
                                                                    key={p.id}
                                                                    position={[p.coordinates.lat, p.coordinates.lng]}
                                                                    icon={L.divIcon({
                                                                        className: 'custom-map-marker',
                                                                        html: `<div style="
                                                                        width: 44px; 
                                                                        height: 44px; 
                                                                        background: ${isDark ? '#1a1a1a' : 'white'};
                                                                        border-radius: 50% 50% 50% 0;
                                                                        transform: rotate(-45deg);
                                                                        display: flex;
                                                                        align-items: center;
                                                                        justify-content: center;
                                                                        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                                                                        border: 3px solid ${isDark ? '#1a1a1a' : 'white'};
                                                                    ">
                                                                        <div style="
                                                                            width: 38px;
                                                                            height: 38px;
                                                                            border-radius: 50%;
                                                                            overflow: hidden;
                                                                            transform: rotate(45deg);
                                                                        ">
                                                                            <img src="${p.image}" style="width: 100%; height: 100%; object-fit: cover;" />
                                                                        </div>
                                                                    </div>`,
                                                                        iconSize: [44, 44],
                                                                        iconAnchor: [22, 53]
                                                                    })}
                                                                    eventHandlers={{
                                                                        click: () => setSelectedProperty(p),
                                                                    }}
                                                                />
                                                            )
                                                        ))}
                                                    </MapContainer>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                                                                    <div className="absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-full shadow-lg text-white" style={{ backgroundColor: 'var(--brand-primary)' }}>
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
                                                                    <span className="font-bold" style={{ color: 'var(--brand-primary)' }}>{p.price}</span>
                                                                </div>
                                                                <p className="text-gray-500 text-xs mb-3">
                                                                    {p.city} • {p.beds} Beds • {p.baths} Baths
                                                                </p>
                                                                <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 mb-4 flex items-center gap-2 border border-gray-100 dark:border-transparent">
                                                                    <TrendingUp size={14} className="shrink-0" style={{ color: 'var(--brand-primary)' }} />
                                                                    <p className="text-xs text-gray-600 dark:text-gray-300 italic truncate">“{p.matchReason}”</p>
                                                                </div>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (isComparing) return;

                                                                        const hasVisit = visits.some(v => v.property === p.address);
                                                                        if (hasVisit) {
                                                                            setTab('visits'); // Go to visits tab if already requested
                                                                        } else {
                                                                            setSelectedProperty(p);
                                                                            setShowScheduleModal(true);
                                                                        }
                                                                    }}
                                                                    disabled={isComparing}
                                                                    className={`w-full font-bold py-3 rounded-xl text-sm transition-colors shadow-sm ${isComparing
                                                                        ? 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed'
                                                                        : visits.some(v => v.property === p.address)
                                                                            ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20'
                                                                            : 'text-white hover:opacity-90'
                                                                        }`}
                                                                    style={!isComparing && !visits.some(v => v.property === p.address) ? { backgroundColor: 'var(--brand-primary)' } : {}}
                                                                >
                                                                    {isComparing
                                                                        ? (selectedForCompare.includes(p.id) ? 'Selected' : 'Tap to Compare')
                                                                        : visits.some(v => v.property === p.address) ? 'Request Sent' : 'Request Visit'}
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            )}
                                        </React.Fragment>
                                    );
                                })()
                            )}

                            {/* Visits Tab */}
                            {tab === 'visits' && (
                                <div className="space-y-3">
                                    {/* 3. Render dynamic visits */}
                                    {visits.map((v) => (
                                        <div key={v.id} className="bg-white dark:bg-[#121212] p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <div className="text-xs font-bold text-gray-500 uppercase mb-1">
                                                        {v.date} • {v.time}
                                                    </div>
                                                    <h3 className="text-gray-900 dark:text-white font-bold text-sm truncate max-w-[200px]">{v.property}</h3>
                                                </div>
                                                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${(v.status === 'Confirmed' || v.status === 'Completed')
                                                    ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20'
                                                    : (v.status === 'Declined' || v.status === 'Reschedule')
                                                        ? 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20'
                                                        : 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20'
                                                    }`}>
                                                    {v.status === 'Reschedule' ? 'Action Needed' : v.status}
                                                </div>
                                            </div>

                                            {(v.status === 'Declined' || v.status === 'Reschedule') && (
                                                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                                                    <p className="text-xs text-red-500 mb-2">Realtor requested a new time.</p>
                                                    {v.note && <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-3 bg-gray-50 dark:bg-white/5 p-2 rounded-lg border border-gray-200 dark:border-white/10">"{v.note}"</p>}
                                                    <button
                                                        onClick={() => {
                                                            setSelectedProperty({
                                                                address: v.property,
                                                                price: '$1.2M',
                                                                pros: ['Prime Location', 'Recently Renovated Kitchen', 'Expansive Backyard'],
                                                                cons: ['High Property Tax', 'Strict HOA Rules'],
                                                                features: ['Smart Home System', 'Hardwood Floors', '3 Car Garage'],
                                                                nearbyAmenities: [],
                                                                aiScore: 98,
                                                                investmentRating: 'A',
                                                                description: 'Revisiting this property. A stunning modern home in the heart of the city.'
                                                            });
                                                            setShowScheduleModal(true);
                                                        }}
                                                        className="w-full bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 py-2 rounded-lg text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                                                    >
                                                        Pick New Time
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <div className="mt-8 p-6 text-center text-gray-500 relative group min-h-[100px]">
                                        <Calendar size={32} className="mx-auto mb-3 opacity-50" />
                                        <p className="text-sm">No more upcoming visits.</p>

                                        {/* Hidden Trigger: REJECT (Bottom Right) */}
                                        <button
                                            onClick={() => {
                                                setVisits(prev => {
                                                    if (!prev.length) return prev;
                                                    // Target the NEWEST visit (index 0)
                                                    return prev.map((v, i) => i === 0 ? { ...v, status: 'Reschedule', note: 'Realtor suggests: Tuesday, 4:00 PM' } : v);
                                                });
                                            }}
                                            className="absolute bottom-2 right-2 w-8 h-8 bg-transparent hover:bg-red-500/10 rounded-full z-10 cursor-alias"
                                            title="Demo Trigger: Reject Visit"
                                        />

                                        {/* Hidden Trigger: ACCEPT (Bottom Left) */}
                                        <button
                                            onClick={() => {
                                                setVisits(prev => {
                                                    if (!prev.length) return prev;
                                                    // Target the NEWEST visit (index 0)
                                                    return prev.map((v, i) => i === 0 ? { ...v, status: 'Confirmed' } : v);
                                                });
                                            }}
                                            className="absolute bottom-2 left-2 w-8 h-8 bg-transparent hover:bg-green-500/10 rounded-full z-10 cursor-alias"
                                            title="Demo Trigger: Accept Visit"
                                        />
                                    </div>

                                    {/* Global Debug Triggers (Always Present in Visits Tab) */}
                                    <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 flex flex-col gap-2 opacity-50 hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                setVisits(prev => {
                                                    if (!prev.length) return prev;
                                                    return prev.map((v, i) => i === 0 ? { ...v, status: 'Declined', note: 'Realtor suggests: Tuesday, 4:00 PM' } : v);
                                                });
                                            }}
                                            className="w-10 h-10 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm shadow-lg"
                                            title="Debug: Reject Top Visit"
                                        >
                                            <X size={20} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setVisits(prev => {
                                                    if (!prev.length) return prev;
                                                    return prev.map((v, i) => i === 0 ? { ...v, status: 'Confirmed' } : v);
                                                });
                                            }}
                                            className="w-10 h-10 bg-green-500/20 hover:bg-green-500 text-green-500 hover:text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm shadow-lg"
                                            title="Debug: Accept Top Visit"
                                        >
                                            <CheckCircle size={20} />
                                        </button>
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

                                    <button
                                        onClick={() => navigate('/')}
                                        className="w-full text-red-500 text-sm font-bold py-4 bg-white dark:bg-[#121212] hover:bg-red-50 dark:hover:bg-white/5 rounded-xl transition-colors border border-gray-100 dark:border-white/5 shadow-sm"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* AI Insight Modal */}
                <AnimatePresence>
                    {selectedProperty && !showScheduleModal && (
                        <motion.div>
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

                                    {/* Tab Navigation */}
                                    <div className="flex gap-2 border-b border-gray-200 dark:border-white/10 -mx-6 px-6 mb-6">
                                        <button
                                            onClick={() => setModalTab('overview')}
                                            className={`px-4 py-3 text-sm font-bold transition-all relative ${modalTab === 'overview'
                                                ? 'text-gray-900 dark:text-white'
                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                                }`}
                                        >
                                            <Home size={16} className="inline mr-1.5" />
                                            Overview
                                            {modalTab === 'overview' && (
                                                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: 'var(--brand-primary)' }} />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setModalTab('tour')}
                                            className={`px-4 py-3 text-sm font-bold transition-all relative ${modalTab === 'tour'
                                                ? 'text-gray-900 dark:text-white'
                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                                }`}
                                        >
                                            <Eye size={16} className="inline mr-1.5" />
                                            Virtual Tour
                                            {modalTab === 'tour' && (
                                                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: 'var(--brand-primary)' }} />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setModalTab('calculator')}
                                            className={`px-4 py-3 text-sm font-bold transition-all relative ${modalTab === 'calculator'
                                                ? 'text-gray-900 dark:text-white'
                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                                }`}
                                        >
                                            <Calculator size={16} className="inline mr-1.5" />
                                            Calculator
                                            {modalTab === 'calculator' && (
                                                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: 'var(--brand-primary)' }} />
                                            )}
                                        </button>
                                    </div>

                                    {/* Virtual Tour Tab */}
                                    {modalTab === 'tour' && selectedProperty.virtualTour && (
                                        <VirtualTour tour={selectedProperty.virtualTour} />
                                    )}

                                    {/* Calculator Tab */}
                                    {modalTab === 'calculator' && (
                                        <MortgageCalculator property={selectedProperty} />
                                    )}

                                    {/* Overview Tab (existing content) */}
                                    {modalTab === 'overview' && (
                                        <React.Fragment>

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

                                            {/* Financial Breakdown (New) */}
                                            {selectedProperty.financials && (
                                                <div className="mt-6 mb-6">
                                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                                        <DollarSign size={16} className="text-green-500" /> Estimated Monthly Cost
                                                    </h3>
                                                    <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-5 border border-gray-100 dark:border-white/5">
                                                        <div className="flex justify-between items-end mb-4">
                                                            <div>
                                                                <span className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{selectedProperty.financials.monthlyPayment}</span>
                                                                <span className="text-sm text-gray-500 font-medium ml-1">/mo</span>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Down Payment</span>
                                                                <span className="font-bold text-gray-900 dark:text-white">{selectedProperty.financials.downPayment}</span>
                                                            </div>
                                                        </div>
                                                        {/* Simple Bar Visualization */}
                                                        <div className="flex h-2.5 rounded-full overflow-hidden mb-3">
                                                            <div className="w-[65%] bg-indigo-500" />
                                                            <div className="w-[25%] bg-purple-500" />
                                                            <div className="w-[10%] bg-pink-500" />
                                                        </div>
                                                        <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                                            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Principal & Int</div>
                                                            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Tax ({selectedProperty.financials.propertyTax})</div>
                                                            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-pink-500" /> Ins ({selectedProperty.financials.homeInsurance})</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Investment Scale (New) */}
                                            {selectedProperty.investment && (
                                                <div className="mt-6 mb-8">
                                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                                        <TrendingUp size={16} className="text-blue-500" /> 5-Year AI Projection
                                                    </h3>
                                                    <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-6 relative overflow-hidden shadow-lg">
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/30 blur-[50px] rounded-full" />
                                                        <div className="relative z-10 flex justify-between items-center mb-6">
                                                            <div>
                                                                <span className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Predicted Value (2030)</span>
                                                                <span className="text-2xl font-bold tracking-tight">{selectedProperty.investment.predictedValue5Years}</span>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="block text-green-400 text-sm font-bold">{selectedProperty.investment.appreciation}</span>
                                                                <span className="block text-gray-500 text-[10px] font-bold uppercase tracking-wider">Total Appreciation</span>
                                                            </div>
                                                        </div>
                                                        {/* Fake Line Graph */}
                                                        <div className="flex items-end gap-1.5 h-16 opacity-90">
                                                            {[30, 35, 42, 45, 48, 55, 60, 68, 75, 82, 90, 100].map((h, i) => (
                                                                <motion.div
                                                                    key={i}
                                                                    initial={{ height: 0 }}
                                                                    whileInView={{ height: `${h}%` }}
                                                                    transition={{ duration: 0.5, delay: i * 0.05 }}
                                                                    className="flex-1 bg-gradient-to-t from-indigo-500/50 to-indigo-400 rounded-t-[2px]"
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Fallback to old rating if no deep data */}
                                            {!selectedProperty.investment && (
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
                                            )}

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
                                            {/* Action Button */}
                                            <button
                                                onClick={() => setShowPropertyChat(true)}
                                                className="w-full mb-3 py-4 rounded-xl text-sm font-bold border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 flex items-center justify-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                                            >
                                                <Sparkles size={16} /> Ask AI about this home
                                            </button>

                                            {/* Action Button */}
                                            {(() => {
                                                const hasVisit = visits.some(v => v.property === selectedProperty.address);
                                                return (
                                                    <button
                                                        onClick={(e) => {
                                                            if (hasVisit && visitStatus === 'idle') {
                                                                closeModal();
                                                                setTab('visits');
                                                            } else {
                                                                handleRequestVisit();
                                                            }
                                                        }}
                                                        disabled={visitStatus === 'loading'}
                                                        className={`w-full py-4 rounded-xl text-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2
                                                    ${(hasVisit || visitStatus === 'success') && visitStatus !== 'loading'
                                                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                                                : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'
                                                            }
                                                `}
                                                    >
                                                        {visitStatus === 'loading'
                                                            ? <><Loader2 className="animate-spin" /> Booking...</>
                                                            : (hasVisit || visitStatus === 'success')
                                                                ? <><CheckCircle /> Request Sent!</>
                                                                : 'Schedule Private Tour'
                                                        }
                                                    </button>
                                                );
                                            })()}

                                        </React.Fragment>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                    {/* Property Chat Overlay */}
                    <AnimatePresence>
                        {showPropertyChat && (
                            <PropertyChatOverlay
                                property={selectedProperty}
                                onClose={() => setShowPropertyChat(false)}
                            />
                        )}
                    </AnimatePresence>
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

                {/* Comparison Modal (Old - Removed) */}

                {/* Schedule Visit Modal */}
                <AnimatePresence>
                    {showScheduleModal && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowScheduleModal(false)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            />
                            <motion.form
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                onSubmit={confirmVisit}
                                className="relative w-full max-w-sm bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-white/10"
                            >
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Schedule Visit</h3>
                                <p className="text-sm text-gray-500 mb-6">Pick a preferred time for {selectedProperty?.address}</p>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="date"
                                                required
                                                value={scheduleDate}
                                                onChange={(e) => setScheduleDate(e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 font-medium focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Time</label>
                                        <div className="relative">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="time"
                                                required
                                                value={scheduleTime}
                                                onChange={(e) => setScheduleTime(e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 font-medium focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowScheduleModal(false);
                                            setSelectedProperty(null);
                                        }}
                                        className="flex-1 py-3 text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
                                    >
                                        Confirm Request
                                    </button>
                                </div>
                            </motion.form>
                        </div>
                    )}
                </AnimatePresence>

                {/* Compare Modal */}
                <AnimatePresence>
                    {showCompareModal && (
                        <CompareModal
                            properties={matches.filter(m => selectedForCompare.includes(m.id))}
                            onClose={() => setShowCompareModal(false)}
                        />
                    )}
                </AnimatePresence>

                {/* Bottom navigation (Mobile Only) */}
                <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 p-2 pb-6 z-30 transition-colors md:hidden">
                    <div className="flex justify-around items-center">
                        <NavBtn icon={MessageCircle} label="Assistant" active={tab === 'chat'} onClick={() => setTab('chat')} />
                        <NavBtn icon={Home} label="Matches" active={tab === 'matches'} onClick={() => setTab('matches')} />
                        <NavBtn icon={Heart} label="Saved" active={tab === 'saved'} onClick={() => setTab('saved')} />
                        <NavBtn icon={Calendar} label="Visits" active={tab === 'visits'} onClick={() => setTab('visits')} />
                        <NavBtn icon={User} label="Profile" active={tab === 'profile'} onClick={() => setTab('profile')} />
                    </div>
                </div>
            </div>
        </div >
    );
}

// Subcomponents
function PropertyChatOverlay({ property, onClose }) {
    const [messages, setMessages] = useState([
        { type: 'bot', text: `Hi! I'm analyzed ${property.address}. Ask me about taxes, schools, neighborhood safety, or investment potential.` }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;
        const userText = input;
        setInput('');
        setMessages(prev => [...prev, { type: 'user', text: userText }]);
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            // Keyword Matching with Data Fallback
            const lowerInput = userText.toLowerCase();
            let matched = false;
            let reply = "I don't have that specific data right now, but I can ask your Realtor to find out!";

            // 1. Check specific QA Match
            if (property.qa) {
                const match = property.qa.find(q => q.keywords.some(k => lowerInput.includes(k)));
                if (match) {
                    reply = match.answer;
                    matched = true;
                }
            }

            // 2. Logic Fallbacks if no QA match
            if (!matched) {
                // Financials / Taxes
                if (lowerInput.includes('tax') || lowerInput.includes('cost') || lowerInput.includes('payment')) {
                    const tax = property.financials?.propertyTax || "standard for this area";
                    const hoa = property.financials?.hoa || "$0";
                    reply = `Based on the listing price, estimated property taxes are ${tax}. HOA fees are ${hoa}.`;
                }
                // Schools
                else if (lowerInput.includes('school') || lowerInput.includes('education') || lowerInput.includes('kid')) {
                    // Check features for school mentions
                    const schoolFeature = property.features?.find(f => f.toLowerCase().includes('school') || f.toLowerCase().includes('elementary') || f.toLowerCase().includes('high'));
                    reply = schoolFeature
                        ? `This home is zoned for excellent schools, including ${schoolFeature}.`
                        : "This property is located in a highly-rated school district according to local data.";
                }
                // Safety
                else if (lowerInput.includes('safe') || lowerInput.includes('crime') || lowerInput.includes('security')) {
                    reply = "This neighborhood has a Safety Score of A (Top 15% in the region). It is considered a very safe, family-friendly area.";
                }
                // Investment
                else if (lowerInput.includes('invest') || lowerInput.includes('growth') || lowerInput.includes('value')) {
                    const growth = property.investment?.growthRate || "steady";
                    const rating = property.investmentRating || "Strong";
                    reply = `Our AI rates this as a ${rating} investment opportunity with a projected growth rate of ${growth} annually.`;
                }
            }

            setMessages(prev => [...prev, { type: 'bot', text: reply }]);
        }, 800);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
            <div className="w-full max-w-md bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10 flex flex-col h-[600px] max-h-[90vh]">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-lg">
                            <Sparkles size={18} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">AI Assistant</h3>
                            <p className="text-xs text-green-500 font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-black/20">
                    {messages.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.type === 'user'
                                ? 'bg-indigo-600 text-white rounded-br-sm'
                                : 'bg-white dark:bg-[#2A2A2A] text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-white/5 rounded-tl-sm shadow-sm'
                                }`}>
                                {m.text}
                            </div>
                        </motion.div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-[#2A2A2A] rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-100 dark:border-white/5 shadow-sm">
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100" />
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200" />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-[#1A1A1A] border-t border-gray-100 dark:border-white/5">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about taxes, schools, etc..."
                            className="w-full bg-gray-100 dark:bg-white/5 border-none rounded-xl py-3.5 pl-4 pr-12 text-sm font-medium focus:ring-2 focus:ring-indigo-500/50 transition-all text-gray-900 dark:text-white"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function NavSidebarItem({ icon: Icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${active
                ? 'bg-gradient-to-r from-brand-primary/10 to-transparent dark:from-brand-primary/10 text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                }`}
            style={active ? { color: 'var(--brand-primary)' } : {}}
        >
            <Icon size={20} className={`transition-colors ${active ? '' : ''}`} />
            <span className="font-bold text-sm">{label}</span>
            {active && (
                <motion.div
                    layoutId="sidebar-active"
                    className="absolute right-0 w-1 h-8 rounded-l-full"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                />
            )}
        </button>
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

function CompareModal({ properties, onClose }) {
    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="bg-white dark:bg-[#121212] w-full max-w-4xl h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-[2rem] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-white/5 sticky top-0 z-10">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <TrendingUp size={20} className="text-indigo-500" />
                        AI Comparison
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-x-auto overflow-y-auto p-6 scrollbar-hide">
                    <div className="min-w-[600px] grid" style={{ gridTemplateColumns: `150px repeat(${properties.length}, 1fr)` }}>

                        {/* Property Headers */}
                        <div className="col-span-1"></div>
                        {properties.map(p => (
                            <div key={p.id} className="px-4 pb-6 flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden mb-3 shadow-md">
                                    <img src={p.image} className="w-full h-full object-cover" />
                                </div>
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-tight mb-1">{p.address.split(',')[0]}</h4>
                                <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xs">{p.price}</span>
                            </div>
                        ))}

                        {/* Comparison Rows */}
                        <CompareRow label="AI Match Score" values={properties.map(p => ({
                            content: `${p.aiScore}%`,
                            highlight: p.aiScore >= Math.max(...properties.map(x => x.aiScore))
                        }))} />

                        <CompareRow label="Beds / Baths" values={properties.map(p => ({ content: `${p.beds}bd / ${p.baths}ba` }))} />
                        <CompareRow label="SqFt" values={properties.map(p => ({ content: p.specs?.split('•')[2] || '2,400 sqft' }))} />

                        <CompareRow label="Investment Rating" values={properties.map(p => {
                            const rating = p.investment?.rating || 'B+';
                            const color = rating.startsWith('A') ? 'text-green-500' : rating.startsWith('B') ? 'text-blue-500' : 'text-orange-500';
                            return { content: rating, className: `font-black text-lg ${color}` };
                        })} />

                        <CompareRow label="Projected Appr." values={properties.map(p => ({
                            content: p.investment?.projectedValue ? `+${Math.floor(Math.random() * 15 + 10)}% (5yr)` : '+12% (5yr)',
                            className: 'text-green-600 dark:text-green-400 font-bold'
                        }))} />

                        <CompareRow label="School Rating" values={properties.map(p => ({
                            content: p.schools ? `${p.schools[0]?.rating}/10` : '8/10'
                        }))} />

                        <CompareRow label="Noise Level" values={properties.map(p => ({
                            content: Math.random() > 0.5 ? 'Low (Quiet St)' : 'Medium'
                        }))} />

                        {/* AI Summary Row */}
                        <div className="col-span-full mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Sparkles size={16} className="text-indigo-500" />
                                AI Verdict
                            </h4>
                            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${properties.length}, 1fr)`, marginLeft: '150px' }}>
                                {properties.map(p => (
                                    <div key={p.id} className="bg-indigo-50 dark:bg-white/5 p-3 rounded-xl text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed border border-indigo-100 dark:border-white/5">
                                        "{p.matchReason} However, consider that {p.address.split(' ')[1]} offers better long-term value due to the upcoming school district rezoning."
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function CompareRow({ label, values }) {
    return (
        <>
            <div className="py-4 text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center border-b border-gray-50 dark:border-white/5">
                {label}
            </div>
            {values.map((v, i) => (
                <div key={i} className={`py-4 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 text-center border-b border-gray-50 dark:border-white/5 ${v.highlight ? 'bg-green-50 dark:bg-green-900/10 rounded-lg' : ''}`}>
                    <span className={v.className}>{v.content}</span>
                </div>
            ))}
        </>
    );
}