"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Brain, Activity, Clock } from "lucide-react";
import Hero3D from "@/components/layout/Hero3D";
import MagneticButton from "@/components/ui/MagneticButton";
import TextReveal from "@/components/ui/TextReveal";

// Animation Variants
const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1] as const
        }
    }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

export default function LandingPage() {
    const { scrollYProgress } = useScroll();
    const heroTextY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
    const engineTextY = useTransform(scrollYProgress, [0.1, 0.4], [0, -50]);

    return (
        <div className="relative w-full min-h-screen bg-black text-white font-body selection:bg-neon-blue selection:text-black">

            {/* Navigation */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-8 py-4 flex items-center gap-8 shadow-2xl">
                <div className="font-heading font-bold tracking-widest text-lg">LIGHTHOUSE</div>
                <div className="hidden md:flex gap-6 text-xs font-mono uppercase text-white/60">
                    <MagneticButton strength={10}><a href="#mission" className="hover:text-white transition-colors block px-2 py-1">Mission</a></MagneticButton>
                    <MagneticButton strength={10}><a href="#engine" className="hover:text-white transition-colors block px-2 py-1">The Engine</a></MagneticButton>
                    <MagneticButton strength={10}><a href="#research" className="hover:text-white transition-colors block px-2 py-1">Research</a></MagneticButton>
                </div>
                <MagneticButton strength={20}>
                    <Link
                        href="/simulation"
                        className="bg-white text-black text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full hover:bg-neon-green hover:scale-105 transition-all block"
                    >
                        Launch App
                    </Link>
                </MagneticButton>
            </nav>

            {/* Hero Section */}
            <section className="relative w-full h-screen flex flex-col justify-center items-center text-center overflow-hidden">
                <Hero3D />

                <motion.div
                    style={{ y: heroTextY }}
                    className="z-20 relative max-w-5xl px-6"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={fadeInUp} className="mb-4">
                        <motion.span
                            animate={{ opacity: [0.7, 1, 0.7], borderColor: ["rgba(255,255,255,0.2)", "rgba(0,240,255,0.5)", "rgba(255,255,255,0.2)"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="inline-block px-3 py-1 border border-white/20 rounded-full text-[10px] uppercase tracking-[0.3em] font-mono text-neon-blue bg-black/50 backdrop-blur"
                        >
                            System v3.0.1 Online
                        </motion.span>
                    </motion.div>

                    <div className="text-6xl md:text-9xl font-heading font-bold tracking-tighter uppercase mb-6 leading-[0.9] mix-blend-overlay">
                        <TextReveal text="Master Your" /> <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500">
                            <TextReveal text="Biology" delay={0.4} />
                        </span>
                    </div>

                    <motion.p
                        variants={fadeInUp}
                        className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed mb-10"
                    >
                        A high-fidelity simulation engine for your circadian rhythm.
                        Visualize, predict, and optimize your cognitive performance with military-grade precision.
                    </motion.p>

                    <motion.div variants={fadeInUp}>
                        <MagneticButton strength={30} className="inline-block">
                            <Link href="/simulation" className="group relative inline-flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/10 rounded-full overflow-hidden hover:bg-white/10 transition-all">
                                <span className="text-sm font-mono uppercase tracking-widest group-hover:tracking-[0.2em] transition-all">Enter Simulation</span>
                                <ArrowRight className="w-4 h-4 text-neon-green group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </MagneticButton>
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
                >
                    <span className="text-[10px] font-mono uppercase text-white/30 tracking-widest">Scroll to Explore</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
                </motion.div>
            </section>

            {/* Feature Grid / Bento Box */}
            <section id="engine" className="py-32 px-6 max-w-[1600px] mx-auto">
                <div className="mb-24 text-center">
                    <motion.div style={{ y: engineTextY }}>
                        <h2 className="text-4xl md:text-6xl font-heading uppercase tracking-tighter mb-4">The Engine</h2>
                        <div className="w-24 h-1 bg-neon-green mx-auto" />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
                    {/* Card 1: Neurochemistry */}
                    <motion.div
                        whileHover={{ scale: 1.01, y: -5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="md:col-span-2 relative group overflow-hidden border border-white/10 bg-white/5 rounded-3xl p-10 hover:border-neon-blue/30 transition-colors"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6 group-hover:bg-neon-blue/20 transition-colors">
                                    <Brain className="w-6 h-6 text-neon-blue group-hover:scale-110 transition-transform" />
                                </div>
                                <h3 className="text-3xl font-heading uppercase mb-2">Neurochemistry</h3>
                                <p className="text-white/50 max-w-md">Simulating adenosine accumulation and receptor antagonism in real-time. Understand the molecular cost of your wakefulness.</p>
                            </div>
                            <div className="w-full h-1/2 bg-black/50 border border-white/5 rounded-xl mt-8 flex items-center justify-center overflow-hidden">
                                {/* Abstract visual placeholder */}
                                <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest group-hover:text-neon-blue transition-colors">System Visualization Available in App</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 2: Circadian Rhythm */}
                    <motion.div
                        whileHover={{ scale: 1.01, y: -5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="md:col-span-1 relative group overflow-hidden border border-white/10 bg-white/5 rounded-3xl p-10 hover:border-neon-green/30 transition-colors"
                    >
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6 group-hover:bg-neon-green/20 transition-colors">
                                    <Clock className="w-6 h-6 text-neon-green group-hover:rotate-12 transition-transform" />
                                </div>
                                <h3 className="text-3xl font-heading uppercase mb-2">Process C</h3>
                                <p className="text-white/50">Align with your SCN. Track circadian nadirs and peaks.</p>
                            </div>
                            <div className="border-t border-white/10 pt-6 mt-6">
                                <div className="flex justify-between items-center text-xs font-mono uppercase text-white/40 mb-2">
                                    <span>Melatonin Onset</span>
                                    <span className="text-white">22:00</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-mono uppercase text-white/40">
                                    <span>Cortisol Peak</span>
                                    <span className="text-white">07:00</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Lower Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 h-auto md:h-[400px]">
                    {/* Card 3 */}
                    <motion.div
                        whileHover={{ scale: 1.01, y: -5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="relative group overflow-hidden border border-white/10 bg-white/5 rounded-3xl p-10 hover:border-neon-red/30 transition-colors"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <Activity className="w-6 h-6 text-neon-red group-hover:scale-110 transition-transform" />
                            <h3 className="text-2xl font-heading uppercase">Thermoregulation</h3>
                        </div>
                        <p className="text-white/50 mb-8">
                            Vasodilation logic implementation. Trigger "Step Down" events to facilitate sleep onset through core body temperature manipulation.
                        </p>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-neon-red/10 text-neon-red text-[10px] font-mono uppercase rounded border border-neon-red/20">Heat Dump</span>
                            <span className="px-3 py-1 bg-white/5 text-white/50 text-[10px] font-mono uppercase rounded border border-white/10">Vasoconstriction</span>
                        </div>
                    </motion.div>

                    {/* Card 4 call to action */}
                    <motion.div
                        whileHover={{ scale: 1.01, y: -5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="relative overflow-hidden border border-white/10 bg-black rounded-3xl p-10 flex flex-col justify-center items-center text-center hover:border-white/30 transition-colors"
                    >
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                        <h3 className="text-4xl font-heading uppercase mb-4 z-10">Start Your Engine</h3>
                        <MagneticButton strength={40} className="z-10">
                            <Link href="/simulation" className="bg-white text-black font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-neon-green transition-colors block">
                                Launch v3.0 // Beta
                            </Link>
                        </MagneticButton>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 text-center text-white/30 text-[10px] font-mono uppercase">
                <p>Lighthouse Labs © 2025 // Designed in California</p>
            </footer>
        </div>
    );
}
