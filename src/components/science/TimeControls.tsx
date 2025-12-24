"use client";

import React, { useState, useEffect } from "react";
import { Play, FastForward, SkipForward, Pause } from "lucide-react";
import { useBioStore } from "@/lib/store";

// We need to export the multiplier so TimeManager can read it, 
// OR we move TimeManager logic INSIDE here. 
// Let's refactor TimeManager to be driven by this component or share state.
// For simplicity, I'll make this component ALSO control the tick, 
// replacing the invisible TimeManager.

export default function TimeControls() {
    const { updateChemistry, addLog } = useBioStore();
    const [speed, setSpeed] = useState(1); // 1x = Real Time
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        if (!isPlaying) return;

        let lastTick = Date.now();
        const interval = setInterval(() => {
            const now = Date.now();
            const deltaMs = now - lastTick;
            lastTick = now;

            // Apply speed multiplier
            const virtualDeltaMs = deltaMs * speed;
            const deltaHours = virtualDeltaMs / 3600000;

            updateChemistry(deltaHours);
        }, 1000); // 1Hz tick logic

        return () => clearInterval(interval);
    }, [speed, isPlaying, updateChemistry]);

    const handleSpeedChange = (newSpeed: number) => {
        setSpeed(newSpeed);
        let label = "REAL TIME";
        if (newSpeed === 60) label = "1 MIN / SEC";
        if (newSpeed === 3600) label = "1 HOUR / SEC";
        addLog(`TIME_WARP::ENGAGED::${label}`, 'info');
    };

    return (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-2 bg-black/80 border border-white/10 p-2 backdrop-blur">
            <div className="text-[10px] font-mono text-center text-white/50 uppercase mb-1">Time Dilation</div>
            <div className="flex gap-1">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 hover:bg-white/10 text-white rounded"
                    title={isPlaying ? "Pause" : "Resume"}
                >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <div className="w-[1px] bg-white/10 mx-1" />

                <button
                    onClick={() => handleSpeedChange(1)}
                    className={`p-2 rounded ${speed === 1 ? "bg-neon-green/20 text-neon-green" : "text-white/50 hover:text-white"}`}
                    title="Real Time"
                >
                    <Play className="w-4 h-4" />
                </button>
                <button
                    onClick={() => handleSpeedChange(60)}
                    className={`p-2 rounded ${speed === 60 ? "bg-neon-blue/20 text-neon-blue" : "text-white/50 hover:text-white"}`}
                    title="1 Minute per Second"
                >
                    <FastForward className="w-4 h-4" />
                </button>
                <button
                    onClick={() => handleSpeedChange(3600)}
                    className={`p-2 rounded ${speed === 3600 ? "bg-neon-red/20 text-neon-red" : "text-white/50 hover:text-white"}`}
                    title="1 Hour per Second"
                >
                    <SkipForward className="w-4 h-4" />
                </button>
            </div>
            {speed > 1 && (
                <div className="text-center text-[10px] text-neon-blue font-mono animate-pulse">
                    ACCELERATED: {speed}X
                </div>
            )}
        </div>
    );
}
