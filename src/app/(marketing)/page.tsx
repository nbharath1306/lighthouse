"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { LighthouseCanvas } from "@/components/landing/LighthouseCanvas";
import MagneticButton from "@/components/ui/MagneticButton";

function RunningCode() {
    const [code, setCode] = useState("");
    useEffect(() => {
        const snippet = `
            // NEURO-SYNC PROTOCOL v9.0
            function optimize_cortex(adenosine_level) {
                if (adenosine > THRESHOLD) {
                    initiate_flush();
                    return SYSTEM_RESET;
                }
                while (true) {
                    synapse.fire();
                    optimization.run();
                }
            }
        `;
        let i = 0;
        const interval = setInterval(() => {
            setCode(snippet.slice(0, i));
            i++;
            if (i > snippet.length) i = 0;
        }, 50);
        return () => clearInterval(interval);
    }, []);
    return <pre className="text-[10px] font-mono text-lab-green opacity-50 whitespace-pre-wrap">{code}</pre>;
}

export default function LandingPage() {
    const [dataStream, setDataStream] = useState<Array<{ id: string, val: string }>>([]);

    useEffect(() => {
        setDataStream(Array.from({ length: 20 }).map((_, i) => ({
            id: `COORD_X_${i + 300}4`,
            val: Math.random().toFixed(8)
        })));
    }, []);

    return (
        <div className="relative w-full bg-brand-black text-clinical-white font-mono selection:bg-hazard-orange selection:text-black overflow-x-hidden">
            {/* The 3D Layer - Mixed Mode */}
            <LighthouseCanvas />

            {/* GRID OVERLAY - The "Architectural" feel */}
            <div className="fixed inset-0 z-50 pointer-events-none flex justify-between px-6 opacity-20">
                <div className="w-px h-full bg-clinical-white/20"></div>
                <div className="w-px h-full bg-clinical-white/20"></div>
                <div className="w-px h-full bg-clinical-white/20"></div>
                <div className="w-px h-full bg-clinical-white/20"></div>
            </div>

            {/* HEADER / HUD */}
            <header className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-start mix-blend-difference">
                <div className="flex flex-col">
                    <span className="text-xs tracking-widest uppercase mb-1">Status: Operational</span>
                    <span className="text-[10px] text-lab-green animate-pulse">● LIVE DATA STREAM</span>
                    <div className="mt-4 w-32">
                        <RunningCode />
                    </div>
                </div>
                <div className="text-right">
                    <h1 className="text-xl font-bold tracking-tighter uppercase">Lighthouse Labs</h1>
                    <p className="text-[10px] tracking-widest text-hazard-orange">RESTRICTED ACCESS</p>
                </div>
            </header>

            {/* SECTION 1: THE SPECIMEN */}
            <section className="h-screen w-full flex flex-col justify-end pb-24 px-6 relative z-10">
                <div className="max-w-[90vw]">
                    <motion.h1
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1.5, ease: [0.85, 0, 0.15, 1] }}
                        className="text-[14vw] leading-[0.8] font-bold tracking-tighter uppercase mix-blend-difference text-white"
                    >
                        Biological<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-clinical-white to-transparent" style={{ WebkitTextStroke: "1px white" }}>Singularity</span>
                    </motion.h1>
                </div>

                <div className="absolute top-1/2 right-12 -translate-y-1/2 w-64 text-right hidden md:block">
                    <p className="text-xs leading-relaxed opacity-70">
                        [FIG. 1] NEURAL LATTICE SIMULATION.<br />
                        OBSERVE THE FLUCTUATION IN CORTICAL FIRING RATES.<br />
                        THIS IS YOUR BRAIN ON MATH.
                    </p>
                </div>
            </section>

            {/* SECTION 2: DATA DUMP */}
            <section className="min-h-screen w-full border-t border-clinical-white/20 relative z-10 bg-brand-black/80 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                    <div className="p-12 border-r border-clinical-white/20 flex flex-col justify-between">
                        <div>
                            <span className="text-xs text-hazard-orange mb-4 block">[02] RAW METRICS</span>
                            <h2 className="text-6xl font-bold uppercase mb-8">No Placebo.<br />Just Data.</h2>
                            <p className="text-xl leading-relaxed max-w-md opacity-80 text-justify">
                                We don't sell sleep. We sell architectural blueprints for your endocrine system.
                                By modeling adenosine decay rates against your unique genetic baseline, we engineer the perfect wakefulness window.
                            </p>
                        </div>
                        <MagneticButton strength={30}>
                            <Link href="/simulation" className="mt-12 inline-block px-12 py-4 border border-clinical-white hover:bg-clinical-white hover:text-black transition-colors uppercase tracking-widest text-sm font-bold">
                                Initializing Protocol -&gt;
                            </Link>
                        </MagneticButton>
                    </div>
                    <div className="p-12 relative overflow-hidden">
                        {/* Placeholder for Data Viz */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                        <div className="flex flex-col gap-2 font-mono text-xs opacity-50">
                            {dataStream.map((item, i) => (
                                <div key={i} className="flex justify-between border-b border-white/10 py-2">
                                    <span>{item.id}</span>
                                    <span>{item.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: MANIFESTO */}
            <section className="h-screen w-full flex items-center justify-center border-t border-clinical-white/20 bg-hazard-orange text-black z-10 relative">
                <div className="max-w-4xl text-center">
                    <h2 className="text-[8vw] font-bold leading-none tracking-tighter mb-8">WAKE UP</h2>
                    <p className="text-2xl font-mono uppercase tracking-widest">
                        The simulation awaits.
                    </p>
                    <div className="mt-12">
                        <Link href="/simulation" className="text-xl underline decoration-2 underline-offset-4 hover:no-underline">
                            ENTER THE LAB
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
