"use client";

import React from "react";
import { useBioStore } from "@/lib/store";
import { Thermometer, ShowerHead, Snowflake } from "lucide-react";
import { clsx } from "clsx";

export default function ThermalRig() {
    const { cbt, vasodilation, triggerVasodilation } = useBioStore();

    // 37.0 is awake/active. 36.2 is sleep onset target.
    const isOptimal = cbt <= 36.4;

    return (
        <div className="w-full h-full bg-[#0a0a0a] border border-white/10 p-4 relative overflow-hidden group flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start mb-4 z-10">
                <h3 className="text-white font-display uppercase tracking-widest text-sm flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-white/50" />
                    Thermoregulation
                </h3>
                <div className={clsx("text-xs font-mono uppercase", isOptimal ? "text-neon-green" : "text-orange-500")}>
                    {isOptimal ? "SLEEP GATE: OPEN" : "CBT TOO HIGH"}
                </div>
            </div>

            {/* Visualizer (Thermal Grading) */}
            <div className="flex-1 flex items-center justify-center relative">
                <div className="w-full h-12 bg-white/5 rounded-full relative overflow-hidden flex items-center px-2">
                    {/* The Gradient Bar */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-900 to-red-900 opacity-50" />

                    {/* The Target Zone */}
                    <div className="absolute left-[10%] w-[30%] h-full border-x border-white/20 bg-neon-blue/5">
                        <div className="absolute top-1 left-2 text-[8px] font-mono text-neon-blue uppercase">Target (36.2°C)</div>
                    </div>

                    {/* The Indicator */}
                    <div
                        className="absolute h-full w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-1000 ease-out"
                        style={{ left: `${((cbt - 35.5) / 2.5) * 100}%` }}
                    />
                </div>
                <div className="absolute bottom-2 font-display text-4xl text-white">
                    {cbt.toFixed(1)}°C
                </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4 mt-4 z-10">
                <button
                    onClick={triggerVasodilation}
                    disabled={vasodilation}
                    className={clsx(
                        "p-3 border text-xs font-mono uppercase flex flex-col items-center gap-2 transition-all group/btn",
                        vasodilation ? "border-neon-blue text-neon-blue bg-neon-blue/10" : "border-white/10 text-white/40 hover:bg-white/5"
                    )}
                >
                    <ShowerHead className="w-5 h-5 group-hover/btn:text-white" />
                    <span>Trigger Heat Dump</span>
                    <span className="text-[8px] opacity-50 lowercase">(Hot Shower)</span>
                </button>
                <div className="p-3 border border-white/5 text-xs font-mono uppercase flex flex-col items-center gap-2 opacity-50 cursor-not-allowed">
                    <Snowflake className="w-5 h-5" />
                    <span>Ambient Cooling</span>
                </div>
            </div>

            {/* Background Heat Map Effect */}
            <div className={clsx(
                "absolute inset-0 pointer-events-none transition-all duration-1000 opacity-20",
                vasodilation ? "bg-gradient-to-t from-blue-900 via-transparent to-transparent" : "bg-gradient-to-t from-red-900 via-transparent to-transparent"
            )} />
        </div>
    );
}
