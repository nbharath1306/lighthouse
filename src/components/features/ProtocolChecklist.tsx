"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Shield, Coffee, Smartphone, Moon } from "lucide-react";

type ProtocolItem = {
    id: string;
    label: string;
    icon: React.ReactNode;
    time: string;
    description: string;
};

const PROTOCOLS: ProtocolItem[] = [
    { id: "caffeine", label: "Caffeine Cutoff", icon: <Coffee className="w-4 h-4" />, time: "10h Before", description: "Adenosine receptors must clear." },
    { id: "bluelight", label: "Blue Light Shield", icon: <Smartphone className="w-4 h-4" />, time: "2h Before", description: "Melatonin suppression prevention." },
    { id: "magnesium", label: "Magnesium Intake", icon: <Shield className="w-4 h-4" />, time: "30m Before", description: "Nervous system down-regulation." },
    { id: "darkness", label: "Total Darkness", icon: <Moon className="w-4 h-4" />, time: "0m Before", description: "Zero-photon environment." },
];

export default function ProtocolChecklist() {
    const [checked, setChecked] = useState<Record<string, boolean>>({});

    const toggle = (id: string) => {
        setChecked(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const progress = (Object.values(checked).filter(Boolean).length / PROTOCOLS.length) * 100;

    return (
        <div className="w-full max-w-md bg-void border border-white/10 p-6 relative">
            <div className="absolute top-0 right-0 p-2 opacity-20">
                <Shield className="w-24 h-24 text-neon-purple" />
            </div>

            <h3 className="text-xl font-display uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="text-neon-purple">Pre-Flight</span> Protocol
            </h3>

            <div className="space-y-4 relative z-10">
                {PROTOCOLS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => toggle(item.id)}
                        className={`w-full flex items-center gap-4 p-4 border transition-all duration-300 group text-left ${checked[item.id]
                                ? "bg-neon-purple/20 border-neon-purple text-white"
                                : "bg-white/5 border-white/10 hover:border-white/30 text-white/60 hover:text-white"
                            }`}
                    >
                        <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${checked[item.id] ? "bg-neon-purple border-neon-purple" : "border-white/30"
                            }`}>
                            {checked[item.id] && <Check className="w-4 h-4 text-white" />}
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <span className="font-display tracking-wider text-sm">{item.label}</span>
                                <span className="text-[10px] font-mono opacity-50 bg-black/30 px-2 py-0.5 rounded">{item.time}</span>
                            </div>
                            <div className="text-xs opacity-50 mt-1 font-mono">{item.description}</div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="mt-6 flex items-center gap-4">
                <div className="flex-1 h-1 bg-white/10 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-neon-purple shadow-[0_0_10px_#7000ff]"
                    />
                </div>
                <div className="text-xs font-mono text-neon-purple">{Math.round(progress)}% READY</div>
            </div>
        </div>
    );
}
