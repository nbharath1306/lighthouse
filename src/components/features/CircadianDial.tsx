"use client";

import React from "react";
import { motion } from "framer-motion";

export default function CircadianDial() {
    return (
        <div className="relative w-full aspect-square max-w-[300px] mx-auto flex items-center justify-center">
            {/* Outer Ring */}
            <svg className="w-full h-full absolute inset-0 animate-spin-slow opacity-30" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className="text-white" />
            </svg>

            {/* Energy Zones - Simplified representation */}
            <svg className="w-full h-full absolute inset-0 rotate-[-90deg]" viewBox="0 0 100 100">
                {/* Deep Work Window (10 AM - 2 PM approx) */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#7000ff" strokeWidth="4" strokeDasharray="25 100" strokeDashoffset="-20" className="opacity-80" />

                {/* Peak Performance (4 PM - 7 PM) */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#00f0ff" strokeWidth="4" strokeDasharray="15 100" strokeDashoffset="-60" className="opacity-80" />
            </svg>

            {/* Inner Info */}
            <div className="text-center z-10 glass-panel rounded-full w-32 h-32 flex flex-col items-center justify-center border border-white/10">
                <span className="text-[10px] text-white/50 font-mono">CURRENT STATE</span>
                <span className="text-xl font-display text-neon-cyan mt-1">PEAK</span>
                <span className="text-[10px] text-neon-purple mt-1 animate-pulse">OPTIMIZED</span>
            </div>

            {/* Time Markers */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-[10px] font-mono text-white/30">12:00</div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 text-[10px] font-mono text-white/30">00:00</div>
            <div className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 text-[10px] font-mono text-white/30">18:00</div>
            <div className="absolute right-0 top-1/2 translate-x-2 -translate-y-1/2 text-[10px] font-mono text-white/30">06:00</div>
        </div>
    );
}
