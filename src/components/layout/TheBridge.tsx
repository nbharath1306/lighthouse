"use client";

import React from "react";
import TheBeacon from "@/components/3d/TheBeacon";
import { motion } from "framer-motion";
import { Activity, Battery, Menu, Settings, User } from "lucide-react";

export default function TheBridge({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-void text-white">
            {/* 1. The Beacon (Background 3D) */}
            <TheBeacon />

            {/* 2. HUD Overlay */}
            <div className="relative z-10 flex flex-col h-screen">

                {/* Top Bar */}
                <header className="flex justify-between items-center p-6 border-b border-white/5 backdrop-blur-sm bg-black/20">
                    <div className="flex items-center gap-4">
                        <div className="h-2 w-2 bg-neon-cyan/50 animate-pulse rounded-full" />
                        <h1 className="font-display text-xl tracking-[0.2em] text-white/80">
                            LIGHTHOUSE <span className="text-neon-cyan text-xs align-top">SYS.V1</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-6 text-xs font-mono text-white/40">
                        <div className="flex items-center gap-2">
                            <Activity className="w-3 h-3 text-neon-purple" />
                            <span>BIO.SYNC: ONLINE</span>
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                            <Battery className="w-3 h-3 text-neon-cyan" />
                            <span>ENERGY: 85%</span>
                        </div>
                        <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                            <User className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 flex overflow-hidden">
                    {/* Sidebar / Navigation */}
                    <aside className="w-20 hidden md:flex flex-col items-center py-8 border-r border-white/5 backdrop-blur-sm bg-black/20 gap-8">
                        <NavIcon icon={<Menu />} active />
                        <NavIcon icon={<Activity />} />
                        <NavIcon icon={<Settings />} />
                    </aside>

                    {/* Content Viewport */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-12 scrollbar-hide">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="max-w-7xl mx-auto"
                        >
                            {children}
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
}

function NavIcon({ icon, active = false }: { icon: React.ReactNode, active?: boolean }) {
    return (
        <button className={`p-3 rounded-lg transition-all duration-300 relative group ${active ? 'text-neon-cyan' : 'text-white/30 hover:text-white'}`}>
            {icon}
            {active && (
                <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-neon-cyan/10 rounded-lg border border-neon-cyan/30 box-glow"
                />
            )}
        </button>
    )
}
