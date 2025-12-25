"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, Brain, Zap, Clock } from "lucide-react";
import Scene from "@/components/landing/Scene";
import MagneticButton from "@/components/ui/MagneticButton";

export default function LandingPage() {
    return (
        <div className="relative w-full bg-black text-white font-body overflow-x-hidden">
            {/* The 3D Universe Background */}
            <Scene />

            {/* Content Layer */}
            <div className="relative z-10">

                {/* HERO: The Interface */}
                <section className="h-screen w-full flex flex-col items-center justify-center relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="text-center z-10 mix-blend-difference"
                    >
                        <h1 className="text-[12vw] leading-[0.8] font-bold tracking-tighter uppercase font-heading text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
                            Light<br />house
                        </h1>
                        <p className="mt-8 text-xl md:text-2xl font-mono text-neon-blue tracking-[0.2em] uppercase">
                            Bio-Chemical Simulation Engine
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2, duration: 1 }}
                        className="absolute bottom-12 flex flex-col items-center gap-4"
                    >
                        <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">Initiate Sequence</span>
                        <ArrowDown className="w-5 h-5 text-neon-blue animate-bounce" />
                    </motion.div>
                </section>

                {/* SECTION 2: The Core */}
                <section className="min-h-screen w-full flex items-center justify-center py-24 px-6 bg-black/50 backdrop-blur-sm">
                    <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-24">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <h2 className="text-6xl md:text-8xl font-heading uppercase leading-none">
                                Neural<br />
                                <span className="text-neon-green">Chemistry</span>
                            </h2>
                            <p className="text-xl text-white/60 leading-relaxed font-light max-w-md">
                                Visualize the invisible war between adenosine and caffeine.
                                Predict your cognitive crash with mathematical precision before it happens.
                            </p>
                            <div className="flex gap-4">
                                <MagneticButton strength={20}>
                                    <div className="w-16 h-16 rounded-full border border-neon-green/30 flex items-center justify-center bg-neon-green/5">
                                        <Brain className="w-6 h-6 text-neon-green" />
                                    </div>
                                </MagneticButton>
                                <MagneticButton strength={20}>
                                    <div className="w-16 h-16 rounded-full border border-neon-blue/30 flex items-center justify-center bg-neon-blue/5">
                                        <Zap className="w-6 h-6 text-neon-blue" />
                                    </div>
                                </MagneticButton>
                            </div>
                        </motion.div>

                        {/* Placeholder for 3D Interaction Focus */}
                        <div className="hidden md:block">
                            {/* The 3D scene handles the visuals here */}
                        </div>
                    </div>
                </section>

                {/* SECTION 3: Circadian Rhythm */}
                <section className="min-h-screen w-full flex items-center justify-end py-24 px-6">
                    <div className="max-w-4xl w-full text-right">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-3 mb-6 border border-white/20 px-4 py-2 rounded-full bg-white/5 backdrop-blur">
                                <Clock className="w-4 h-4 text-neon-blue" />
                                <span className="text-xs font-mono uppercase tracking-widest text-neon-blue">Sync Complete</span>
                            </div>
                            <h2 className="text-6xl md:text-9xl font-heading uppercase leading-none mb-8 mix-blend-overlay">
                                Total<br />Sync
                            </h2>
                            <p className="text-2xl text-white/70 max-w-2xl ml-auto font-light">
                                Align your biological clock with the solar day.
                                Master your cortisol peaks and melatonin onset.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Footer / CTA */}
                <section className="h-[50vh] w-full flex flex-col items-center justify-center bg-gradient-to-t from-neon-blue/10 to-transparent">
                    <MagneticButton strength={50}>
                        <Link
                            href="/simulation"
                            className="group relative px-12 py-6 bg-white text-black rounded-full overflow-hidden flex items-center gap-4 transition-all hover:scale-105"
                        >
                            <span className="relative z-10 text-xl font-bold uppercase tracking-widest">Enter Simulation</span>
                            <div className="absolute inset-0 bg-neon-green transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                        </Link>
                    </MagneticButton>
                </section>
            </div>
        </div>
    );
}
