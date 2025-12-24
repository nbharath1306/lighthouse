"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Wine, Coffee, Smartphone, AlertTriangle } from "lucide-react";
import { clsx } from "clsx";
import { useBioStore } from "@/lib/store";

type Cycle = {
    id: number;
    label: string;
    n3: number; // Deep sleep %
    rem: number; // REM sleep %
    quality: number; // 0-1
};

const BASE_CYCLES: Cycle[] = [
    { id: 1, label: "Cycle 1", n3: 80, rem: 10, quality: 1 },
    { id: 2, label: "Cycle 2", n3: 60, rem: 20, quality: 1 },
    { id: 3, label: "Cycle 3", n3: 40, rem: 40, quality: 1 },
    { id: 4, label: "Cycle 4", n3: 20, rem: 60, quality: 1 },
    { id: 5, label: "Cycle 5", n3: 10, rem: 80, quality: 1 },
];

export default function HypnogramBuilder() {
    const { addLog, setHrv } = useBioStore();
    const [activeCycles, setActiveCycles] = useState<number>(5);
    const [stressors, setStressors] = useState({
        alcohol: false,
        blueLight: false,
        lateCaffeine: false,
    });

    const toggleStressor = (key: keyof typeof stressors) => {
        const newState = !stressors[key];
        setStressors(prev => ({ ...prev, [key]: newState }));

        // Log Actions
        if (newState) {
            addLog(`${key.toUpperCase()}_DETECTED::INITIATING_PROTOCOL`, 'alert');
            if (key === 'alcohol') addLog('REM_SUPPRESSION_ACTIVE', 'warning');
            if (key === 'lateCaffeine') addLog('ADENOSINE_BLOCKAGE_DETECTED', 'warning');
        } else {
            addLog(`${key.toUpperCase()}_CLEARED`, 'success');
        }
    };

    // Calculate effect of stressors on architecture
    const currentCycles = BASE_CYCLES.slice(0, activeCycles).map(cycle => {
        let { n3, rem, quality } = cycle;

        if (stressors.alcohol) {
            if (cycle.id <= 2) {
                rem = 0;
                quality -= 0.3;
            }
        }

        if (stressors.blueLight) {
            if (cycle.id === 1) {
                n3 -= 30;
                quality -= 0.2;
            }
        }

        if (stressors.lateCaffeine) {
            n3 -= 10;
            rem -= 10;
            quality -= 0.4;
        }

        return { ...cycle, n3: Math.max(0, n3), rem: Math.max(0, rem), quality };
    });

    const totalQuality = currentCycles.reduce((acc, c) => acc + c.quality, 0) / activeCycles * 100;

    // Update Global HRV based on simulation
    useEffect(() => {
        // Base HRV 65. Quality 100 = 65. Quality 50 = 30.
        const simulatedHrv = Math.max(20, Math.round(totalQuality * 0.65));
        setHrv(simulatedHrv);
    }, [totalQuality, setHrv]);

    return (
        <div className="w-full h-full bg-[#0a0a0a] border border-white/10 p-6 flex flex-col relative overflow-hidden group box-border">
            {/* Title */}
            <div className="flex items-center gap-3 mb-6 z-10">
                <Brain className="w-5 h-5 text-neon-blue animate-pulse" />
                <h2 className="text-xl font-display uppercase tracking-wider text-white">Sleep Architect</h2>
            </div>

            {/* Visualizer (The Stack) */}
            <div className="flex-1 flex items-end justify-center gap-2 mb-8 relative z-10 min-h-[200px]">
                {/* Grid Lines */}
                <div className="absolute inset-0 border-b border-l border-white/10 opacity-50 pointer-events-none" />

                <AnimatePresence>
                    {currentCycles.map((cycle) => (
                        <motion.div
                            key={cycle.id}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "100%", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex-1 h-full flex flex-col justify-end gap-1 relative group/bar"
                        >
                            {/* REM Block */}
                            <div
                                style={{ height: `${cycle.rem}%` }}
                                className={clsx(
                                    "w-full bg-neon-blue/80 backdrop-blur-sm border-t border-white/20 transition-all duration-500",
                                    stressors.alcohol && cycle.id <= 2 && "opacity-20 animate-pulse bg-red-500" // Alcohol damage visualization
                                )}
                            >
                                <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-6 left-0 text-[10px] font-mono text-neon-blue flex flex-col">
                                    <span>REM</span>
                                    <span>{cycle.rem}%</span>
                                </div>
                            </div>

                            {/* Deep Sleep Block */}
                            <div
                                style={{ height: `${cycle.n3}%` }}
                                className="w-full bg-white/10 backdrop-blur-sm border-t border-white/20 transition-all duration-500"
                            >
                                <div className="opacity-0 group-hover/bar:opacity-100 absolute bottom-0 left-0 text-[10px] font-mono text-white/50">
                                    N3
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Modifiers (Stressors) */}
            <div className="grid grid-cols-3 gap-2 mb-6 z-10">
                <button
                    onClick={() => toggleStressor("alcohol")}
                    className={clsx(
                        "p-3 border text-xs font-mono uppercase flex flex-col items-center gap-2 transition-all",
                        stressors.alcohol ? "border-neon-red text-neon-red bg-neon-red/10" : "border-white/10 text-white/40 hover:bg-white/5"
                    )}
                >
                    <Wine className="w-4 h-4" />
                    <span>Alcohol</span>
                </button>
                <button
                    onClick={() => toggleStressor("blueLight")}
                    className={clsx(
                        "p-3 border text-xs font-mono uppercase flex flex-col items-center gap-2 transition-all",
                        stressors.blueLight ? "border-neon-blue text-neon-blue bg-neon-blue/10" : "border-white/10 text-white/40 hover:bg-white/5"
                    )}
                >
                    <Smartphone className="w-4 h-4" />
                    <span>Blue Lt</span>
                </button>
                <button
                    onClick={() => toggleStressor("lateCaffeine")}
                    className={clsx(
                        "p-3 border text-xs font-mono uppercase flex flex-col items-center gap-2 transition-all",
                        stressors.lateCaffeine ? "border-orange-500 text-orange-500 bg-orange-500/10" : "border-white/10 text-white/40 hover:bg-white/5"
                    )}
                >
                    <Coffee className="w-4 h-4" />
                    <span>Caffeine</span>
                </button>
            </div>

            {/* Stats */}
            <div className="flex justify-between items-center border-t border-white/5 pt-4 z-10">
                <div className="text-xs font-mono text-white/50">
                    DURATION: <span className="text-white">{activeCycles * 1.5}h</span>
                </div>
                <div className="text-xs font-mono text-white/50 flex items-center gap-2">
                    RECOVERY SCORE:
                    <span className={clsx(
                        totalQuality > 80 ? "text-neon-green" : totalQuality > 50 ? "text-orange-500" : "text-neon-red"
                    )}>
                        {Math.round(totalQuality)}%
                    </span>
                </div>
            </div>

            {/* Warnings */}
            <AnimatePresence>
                {totalQuality < 60 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-16 left-0 w-full bg-neon-red/10 border-y border-neon-red/20 p-2 text-[10px] font-mono text-neon-red flex items-center justify-center gap-2"
                    >
                        <AlertTriangle className="w-3 h-3" />
                        <span>CRITICAL ARCHITECTURE FAILURE DETECTED</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
