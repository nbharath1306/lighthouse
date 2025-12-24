"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { calculateWakeUpTimes, calculateSleepTimes, type SleepWindow } from "@/lib/core/chronobiology";
import { Clock, Moon, Sun, ArrowRight, RotateCcw } from "lucide-react";

export default function JumpEngine() {
    const [mode, setMode] = useState<"sleep_now" | "wake_at">("sleep_now");
    const [results, setResults] = useState<SleepWindow[] | null>(null);
    const [targetTime, setTargetTime] = useState("06:30"); // Default wake time

    const handleCalculate = () => {
        if (mode === "sleep_now") {
            setResults(calculateWakeUpTimes(new Date()));
        } else {
            // Parse the target time
            const [hours, minutes] = targetTime.split(":").map(Number);
            const now = new Date();
            const wakeDate = new Date();
            wakeDate.setHours(hours, minutes, 0, 0);

            // If time is in the past, assume tomorrow
            if (wakeDate < now) {
                wakeDate.setDate(wakeDate.getDate() + 1);
            }

            setResults(calculateSleepTimes(wakeDate));
        }
    };

    const reset = () => {
        setResults(null);
    };

    return (
        <div className="w-full max-w-2xl mx-auto backdrop-blur-md bg-black/40 border border-white/10 p-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-20" />

            <div className="flex justify-between items-start mb-8">
                <h2 className="text-2xl font-display uppercase tracking-widest flex items-center gap-3">
                    <Clock className="text-neon-cyan" />
                    Jump Engine
                </h2>
                <div className="flex bg-white/5 rounded-none p-1 border border-white/5">
                    <button
                        onClick={() => { setMode("sleep_now"); setResults(null); }}
                        className={`px-4 py-2 text-xs font-mono transition-all ${mode === "sleep_now" ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50" : "text-white/40 hover:text-white"}`}
                    >
                        SLEEP NOW
                    </button>
                    <button
                        onClick={() => { setMode("wake_at"); setResults(null); }}
                        className={`px-4 py-2 text-xs font-mono transition-all ${mode === "wake_at" ? "bg-neon-purple/20 text-neon-purple border border-neon-purple/50" : "text-white/40 hover:text-white"}`}
                    >
                        WAKE AT...
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {!results ? (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        {mode === "wake_at" && (
                            <div className="flex justify-center">
                                <input
                                    type="time"
                                    value={targetTime}
                                    onChange={(e) => setTargetTime(e.target.value)}
                                    className="bg-transparent text-6xl font-display text-white border-b-2 border-white/20 focus:border-neon-purple outline-none text-center p-4 w-full max-w-[300px]"
                                />
                            </div>
                        )}

                        <div className="text-center">
                            <p className="text-white/50 mb-6 font-light">
                                {mode === "sleep_now"
                                    ? "Calculate optimal wake-up windows based on 90m cycles."
                                    : "Reverse engineer your sleep time for maximum recovery."}
                            </p>
                            <button
                                onClick={handleCalculate}
                                className="bg-white text-black font-display font-bold uppercase tracking-widest px-12 py-4 hover:bg-neon-cyan transition-colors duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]"
                            >
                                {mode === "sleep_now" ? "Set Sail" : "Calculate Launch"}
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {results.map((window, i) => (
                                <div
                                    key={i}
                                    className={`p-4 border backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer relative overflow-hidden ${window.quality === "Optimal" ? "border-neon-cyan bg-neon-cyan/5 box-glow" :
                                            window.quality === "Good" ? "border-white/20 hover:border-white/50" :
                                                "border-red-500/30 bg-red-500/5 opacity-80"
                                        }`}
                                >
                                    {window.quality === "Optimal" && (
                                        <div className="absolute top-0 right-0 bg-neon-cyan text-black text-[10px] font-bold px-2 py-0.5">BEST</div>
                                    )}
                                    <div className="text-white/40 text-xs font-mono mb-1">
                                        {window.cycleCount} CYCLES ({window.cycleCount * 1.5}h)
                                    </div>
                                    <div className={`text-2xl font-display ${window.quality === "Optimal" ? "text-neon-cyan" : "text-white"}`}>
                                        {window.label}
                                    </div>
                                    <div className={`text-xs mt-2 font-bold uppercase tracking-wider ${window.quality === "Optimal" ? "text-neon-cyan" :
                                            window.quality === "Good" ? "text-green-400" :
                                                "text-red-400"
                                        }`}>
                                        {window.quality}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center pt-8">
                            <button
                                onClick={reset}
                                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" /> RECALCULATE
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
