"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Activity,
    Moon,
    Sun,
    Battery,
    Zap,
    Play,
    RotateCcw
} from "lucide-react";

export default function DesignSystem() {
    const [activeTab, setActiveTab] = useState("typography");

    return (
        <div className="min-h-screen bg-void text-white p-8 font-sans overflow-x-hidden relative">
            <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />
            <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

            <header className="mb-16 relative z-10">
                <div className="flex items-center gap-4 mb-4">
                    <div className="h-3 w-3 bg-neon-cyan rounded-full animate-pulse shadow-[0_0_10px_#00f0ff]" />
                    <h1 className="text-4xl font-display uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
                        Design System_v1.0
                    </h1>
                </div>
                <p className="text-white/40 font-mono text-sm max-w-xl">
          // SYSTEM.CONFIG: VOID_AND_NEON
                    <br />
          // ESTABLISHING VISUAL PROTOCOLS FOR BIO-CIRCADIAN ENGINE
                </p>
            </header>

            <nav className="flex gap-8 border-b border-white/10 mb-12 relative z-10">
                {["typography", "colors", "components", "effects"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 px-2 text-sm uppercase tracking-widest transition-all relative ${activeTab === tab ? "text-neon-cyan" : "text-white/40 hover:text-white/70"
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 w-full h-[2px] bg-neon-cyan shadow-[0_0_15px_#00f0ff]"
                            />
                        )}
                    </button>
                ))}
            </nav>

            <main className="relative z-10">
                {activeTab === "typography" && (
                    <section className="space-y-12">
                        <div className="space-y-4">
                            <span className="text-neon-cyan/50 font-mono text-xs">// HEADINGS.FONT_DISPLAY</span>
                            <h1 className="text-6xl font-display uppercase tracking-wider">
                                Wake Up <span className="text-neon-cyan">Fresh</span>
                            </h1>
                            <h2 className="text-4xl font-display uppercase tracking-wider text-white/90">
                                Circadian Rhythms
                            </h2>
                            <h3 className="text-2xl font-display uppercase tracking-wider text-white/80">
                                System Status: Online
                            </h3>
                        </div>

                        <div className="space-y-4 max-w-2xl">
                            <span className="text-neon-purple/50 font-mono text-xs">// BODY.FONT_SANS</span>
                            <p className="text-white/70 leading-relaxed">
                                Sleep is not merely a pause in activity; it is a critical maintenance cycle for the biological machine.
                                Optimization requires precision, monitoring, and adherence to protocol.
                            </p>
                            <p className="text-neon-cyan text-sm font-mono">
                                Running diagnostic... [====================] 100%
                            </p>
                        </div>
                    </section>
                )}

                {activeTab === "colors" && (
                    <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <ColorCard name="VOID.MAIN" hex="#030512" bg="bg-void" text="text-white" />
                        <ColorCard name="NEON.CYAN" hex="#00f0ff" bg="bg-neon-cyan" text="text-black" />
                        <ColorCard name="NEON.PURPLE" hex="#7000ff" bg="bg-neon-purple" text="text-white" />
                        <ColorCard name="GLASS.PANEL" hex="RGBA(255,255,255,0.05)" bg="bg-glass" text="text-white" border />
                    </section>
                )}

                {activeTab === "components" && (
                    <section className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <span className="text-white/30 font-mono text-xs mb-4 block">// INTERACTIVE.CONTROLS</span>

                                <div className="flex gap-4">
                                    <button className="bg-neon-cyan text-black px-8 py-3 rounded-none uppercase font-bold tracking-widest hover:bg-white hover:shadow-[0_0_20px_white] transition-all duration-300">
                                        Initiate
                                    </button>
                                    <button className="border border-neon-cyan/30 text-neon-cyan px-8 py-3 rounded-none uppercase font-bold tracking-widest hover:bg-neon-cyan/10 transition-all duration-300 backdrop-blur-sm">
                                        Configure
                                    </button>
                                </div>

                                <div className="flex gap-4 mt-8">
                                    <div className="h-12 w-12 rounded-full bg-glass border border-white/10 flex items-center justify-center hover:border-neon-cyan/50 hover:text-neon-cyan transition-colors cursor-pointer group">
                                        <Play className="w-5 h-5 fill-current" />
                                    </div>
                                    <div className="h-12 w-12 rounded-full bg-glass border border-white/10 flex items-center justify-center hover:border-neon-purple/50 hover:text-neon-purple transition-colors cursor-pointer group">
                                        <RotateCcw className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <span className="text-white/30 font-mono text-xs mb-4 block">// DATA.DISPLAY</span>

                                <div className="bg-glass border border-white/5 p-6 backdrop-blur-md relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="text-xs font-mono text-white/50 uppercase">Sleep Debt</h4>
                                            <div className="text-3xl font-display text-white mt-1">1h 24m</div>
                                        </div>
                                        <Battery className="text-neon-purple" />
                                    </div>
                                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full w-[70%] bg-gradient-to-r from-neon-purple to-neon-cyan" />
                                    </div>
                                </div>

                                <div className="bg-glass border border-white/5 p-6 backdrop-blur-md">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-mono text-neon-cyan animate-pulse">● LIVE</span>
                                        <Zap className="h-4 w-4 text-white/30" />
                                    </div>
                                    <p className="text-sm text-white/80">
                                        Circadian nadir approaching. Prepare for rest cycle in 45 minutes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === "effects" && (
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="aspect-square bg-void border border-white/10 flex items-center justify-center relative group">
                            <div className="absolute inset-0 bg-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="h-32 w-32 rounded-full border border-neon-cyan shadow-[0_0_30px_#00f0ff50] flex items-center justify-center">
                                <span className="font-mono text-xs text-neon-cyan">NEON.GLOW</span>
                            </div>
                        </div>

                        <div className="aspect-square bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2894&auto=format&fit=crop')] bg-cover flex items-center justify-center">
                            <div className="w-4/5 h-4/5 bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                                <span className="font-mono text-xs text-white">GLASS.BLUR</span>
                            </div>
                        </div>

                        <div className="aspect-square bg-void border border-white/10 flex items-center justify-center overflow-hidden">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan blur-lg opacity-50 animate-spin-slow" />
                                <div className="relative bg-void px-6 py-2 border border-white/10 text-xs font-mono">
                                    ANIMATED.BORDER
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}

function ColorCard({ name, hex, bg, text, border = false }: { name: string, hex: string, bg: string, text: string, border?: boolean }) {
    return (
        <div className={`aspect-square rounded-sm p-4 flex flex-col justify-between ${bg} ${border ? 'border border-white/10' : ''}`}>
            <span className={`font-mono text-xs ${text} opacity-50`}>{name}</span>
            <div>
                <div className={`font-mono text-lg ${text}`}>{hex}</div>
            </div>
        </div>
    )
}
