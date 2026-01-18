import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VirtualTour({ tour }) {
    const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    if (!tour || tour.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                <p>No virtual tour available for this property</p>
            </div>
        );
    }

    const currentRoom = tour[currentRoomIndex];

    const nextRoom = () => {
        setCurrentRoomIndex((prev) => (prev + 1) % tour.length);
    };

    const prevRoom = () => {
        setCurrentRoomIndex((prev) => (prev - 1 + tour.length) % tour.length);
    };

    return (
        <>
            <div className="space-y-4">
                {/* Main Viewer - Mock 360 Container */}
                {/* Changed aspect ratio to 4/3 for mobile (taller) and video for desktop */}
                <div className="relative aspect-[4/3] md:aspect-video bg-black rounded-2xl overflow-hidden group cursor-grab active:cursor-grabbing touch-none">

                    {/* Simulated 360 Viewport */}
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentRoomIndex}
                            src={currentRoom.image}
                            alt={currentRoom.room}
                            className="w-full h-full object-cover"
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{
                                scale: 1.4,
                                opacity: 1,
                                x: 0,
                                y: 0
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            drag
                            dragConstraints={{ left: -200, right: 200, top: -100, bottom: 100 }}
                            dragElastic={0.1}
                            whileTap={{ cursor: "grabbing" }}
                        />
                    </AnimatePresence>

                    {/* 360 Overlay UI (Vignette) */}
                    <div className="absolute inset-0 pointer-events-none border-[0.5px] border-white/10 rounded-2xl ring-1 ring-black/20 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />

                    {/* Drag Hint - Made smaller and auto-hides */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-2 border border-white/10 whitespace-nowrap"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            Drag to explore
                        </motion.div>
                    </div>

                    {/* Fullscreen Button */}
                    <button
                        onClick={() => setIsFullscreen(true)}
                        className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all z-20"
                    >
                        <Maximize2 size={16} />
                    </button>

                    {/* Navigation Arrows - Moved to edges and styled cleaner */}
                    {tour.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevRoom(); }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full text-white/80 hover:text-white transition-all z-20 hover:scale-110 active:scale-95"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextRoom(); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full text-white/80 hover:text-white transition-all z-20 hover:scale-110 active:scale-95"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </>
                    )}

                    {/* Room Label - Cleaner Layout */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 sm:p-6 pointer-events-none">
                        <div className="flex items-end justify-between">
                            <div className="max-w-[70%]">
                                <h3 className="text-white font-bold text-lg sm:text-xl mb-0.5 flex flex-wrap items-center gap-2 leading-tight">
                                    {currentRoom.room}
                                    <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded text-white/90 font-medium tracking-wider">360°</span>
                                </h3>
                                <p className="text-white/70 text-xs sm:text-sm truncate">{currentRoom.description}</p>
                            </div>
                            <div className="text-white/40 text-[10px] sm:text-xs font-mono bg-black/30 px-2 py-1 rounded-lg backdrop-blur-sm">
                                {currentRoomIndex + 1} / {tour.length}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Compass / 360 Indicator */}
                <div className="flex items-center gap-2 justify-center text-xs text-gray-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" /> Live Preview
                </div>

                {/* Room Thumbnails */}
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
                    {tour.map((room, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentRoomIndex(index)}
                            className={`relative flex-shrink-0 w-32 h-20 rounded-xl overflow-hidden border-2 transition-all ${index === currentRoomIndex
                                ? 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900'
                                : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                                }`}
                        >
                            <img
                                src={room.image}
                                alt={room.room}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2">
                                <span className="text-white text-xs font-bold truncate">{room.room}</span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Info Card */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        💡 <strong>Tip:</strong> Click arrows or thumbnails to explore each room. Tap fullscreen for an immersive view.
                    </p>
                </div>
            </div>

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black z-[100] flex items-center justify-center"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all z-10"
                        >
                            <X size={24} />
                        </button>

                        {/* Image - Draggable in Fullscreen */}
                        <div className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing">
                            <motion.img
                                key={currentRoomIndex}
                                src={currentRoom.image}
                                alt={currentRoom.room}
                                className="w-full h-full object-cover"
                                initial={{ scale: 1.2, opacity: 0 }}
                                animate={{
                                    scale: 1.5,
                                    opacity: 1,
                                    x: 0,
                                    y: 0
                                }}
                                drag
                                dragConstraints={{ left: -500, right: 500, top: -300, bottom: 300 }}
                                dragElastic={0.1}
                            />
                        </div>

                        {/* Navigation */}
                        {tour.length > 1 && (
                            <>
                                <button
                                    onClick={prevRoom}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all"
                                >
                                    <ChevronLeft size={32} />
                                </button>
                                <button
                                    onClick={nextRoom}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-all"
                                >
                                    <ChevronRight size={32} />
                                </button>
                            </>
                        )}

                        {/* Label */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8">
                            <h3 className="text-white font-bold text-2xl mb-2">{currentRoom.room}</h3>
                            <p className="text-white/80">{currentRoom.description}</p>
                            <div className="mt-4 text-white/60 text-sm">
                                Room {currentRoomIndex + 1} of {tour.length}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
