"use client";

import { useState } from "react";
import { Clock, Anchor, Sun, Moon } from "lucide-react";
import { calculateBedtimes, calculateWakeTimes, SleepCycle } from "@/lib/sleep-calculator";
import { clsx } from "clsx";

export default function HUD() {
    const [mode, setMode] = useState<"SAIL" | "ANCHOR">("SAIL");
    const [inputTime, setInputTime] = useState("");
    const [results, setResults] = useState<SleepCycle[]>([]);

    const handleCalculate = () => {
        if (!inputTime) return;

        // Parse input time (assume HH:MM 24h for simplicity or convert)
        // For this prototype, let's just use current date + input time
        const [hours, minutes] = inputTime.split(":").map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(0);

        if (mode === "SAIL") {
            // Input: Wake Time -> Output: Bedtimes (Previous day? or Same day?)
            // Usually "I want to wake up tomorrow at X".
            // Logic assumes date is roughly target.
            setResults(calculateBedtimes(date));
        } else {
            // Input: Bedtime -> Output: Wake times (Tomorrow)
            setResults(calculateWakeTimes(date));
        }
    };

    return (
        <div className="absolute inset-0 z-10 pointer-events-none p-8 flex flex-col justify-between text-white font-mono mix-blend-difference">
            {/* Header */}
            <header className="flex justify-between items-start pointer-events-auto">
                <div>
                    <h1 className="text-4xl font-bold tracking-tighter uppercase">Lighthouse</h1>
                    <div className="flex items-center gap-2 text-xs opacity-70 mt-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span>SYSTEM ONLINE</span>
                        <span>// CIRCADIAN.ENGINE.V1</span>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-xl">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-xs opacity-50">LOCAL TIME</p>
                </div>
            </header>

            {/* Main Controls - Center Bottom */}
            <div className="pointer-events-auto max-w-md w-full mx-auto backdrop-blur-md bg-black/20 border border-white/10 p-6 rounded-lg">
                {/* Toggle */}
                <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
                    <button
                        onClick={() => { setMode("SAIL"); setResults([]); }}
                        className={clsx("flex items-center gap-2 text-sm uppercase transition-colors hover:text-white", mode === "SAIL" ? "text-white font-bold" : "text-white/40")}
                    >
                        <Sun size={16} /> Set Sail (Wake)
                    </button>
                    <button
                        onClick={() => { setMode("ANCHOR"); setResults([]); }}
                        className={clsx("flex items-center gap-2 text-sm uppercase transition-colors hover:text-white", mode === "ANCHOR" ? "text-white font-bold" : "text-white/40")}
                    >
                        <Anchor size={16} /> Anchor (Sleep)
                    </button>
                </div>

                {/* Input */}
                <div className="flex gap-4 mb-6">
                    <input
                        type="time"
                        value={inputTime}
                        onChange={(e) => setInputTime(e.target.value)}
                        className="bg-transparent border border-white/30 p-2 text-2xl w-full focus:outline-none focus:border-white font-mono"
                    />
                    <button
                        onClick={handleCalculate}
                        className="bg-white text-black px-6 py-2 uppercase font-bold hover:bg-gray-200 transition-colors"
                    >
                        CALC
                    </button>
                </div>

                {/* Results */}
                {results.length > 0 && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4">
                        <p className="text-xs uppercase opacity-50 mb-2">
                            {mode === "SAIL" ? "Optimized Bedtimes (Tonight)" : "Wake Windows (Tomorrow)"}
                        </p>
                        {results.map((res, i) => (
                            <div key={i} className="flex justify-between items-center border-l-2 border-white/20 pl-3 py-1 hover:bg-white/5 transition-colors group cursor-pointer">
                                <div>
                                    <span className="text-xl block group-hover:text-cyan-300 transition-colors">{res.time}</span>
                                    <span className="text-xs opacity-50">{res.cycles} Cycles ({res.hours}h {res.minutes}m)</span>
                                </div>
                                <span className="text-xs border border-white/20 px-2 py-1 rounded text-white/60">{res.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Status */}
            <div className="flex justify-between items-end opacity-50 text-xs pointer-events-auto">
                <div className="flex gap-4">
                    <div>
                        <span className="block text-[10px] uppercase tracking-widest">Temperature</span>
                        <span>COOLING REQ.</span>
                    </div>
                    <div>
                        <span className="block text-[10px] uppercase tracking-widest">Phase</span>
                        <span>ADENOSINE BUILD</span>
                    </div>
                </div>
                <div>
                    <span className="hover:underline cursor-pointer">PROTOCOL MANUAL</span>
                </div>
            </div>
        </div>
    );
}
