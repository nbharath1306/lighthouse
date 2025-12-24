"use client";

import React from "react";
import TheCanvas from "@/components/layout/TheCanvas";
import ProcessMonitor from "@/components/science/ProcessMonitor";
import HypnogramBuilder from "@/components/science/HypnogramBuilder";
import SystemLogs from "@/components/science/SystemLogs";
import SynapseSimulator from "@/components/science/SynapseSimulator";
import HormoneMonitor from "@/components/science/HormoneMonitor";
import ThermalRig from "@/components/science/ThermalRig";
import { Activity, Brain, Radio } from "lucide-react";
import { useBioStore } from "@/lib/store";
import TimeControls from "@/components/science/TimeControls";

export default function Home() {
  const { hrv, cognitiveLoad } = useBioStore();

  return (
    <div className="relative w-full min-h-screen text-white overflow-hidden font-body selection:bg-neon-green selection:text-black">
      <TheCanvas />
      <TimeControls />

      {/* HUD Header */}
      <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Activity className="w-5 h-5 text-neon-green animate-pulse" />
          <h1 className="text-xl font-heading tracking-[0.2em] uppercase">
            Lighthouse <span className="text-white/30 text-xs ml-2">v3.0.1 // SCIENTIFIC_MODE</span>
          </h1>
        </div>
        <div className="hidden md:flex gap-8 text-xs font-mono text-white/50">
          <div className="flex items-center gap-2">
            <Radio className="w-3 h-3" />
            SCN SYNC: ONLINE
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-3 h-3 text-neon-blue" />
            COGNITIVE LOAD: {cognitiveLoad}%
          </div>
        </div>
      </header>

      {/* Main Cockpit Grid */}
      <main className="pt-24 px-6 md:px-12 pb-12 w-full h-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Metrics */}
        <div className="lg:col-span-3 space-y-6 hidden lg:block">
          {/* Synapse Simulator (New) */}
          <div className="h-64 border border-white/10 relative">
            <SynapseSimulator />
          </div>

          {/* HRV Monitor (Compact) */}
          <div className="h-24 border border-white/10 bg-black/40 p-4 relative overflow-hidden flex flex-col justify-center">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-[10px] font-mono text-white/40 uppercase mb-1">HRV (Recovery)</h3>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-display text-white">{hrv}</div>
                  <span className="text-[10px] text-white/30 uppercase">ms</span>
                </div>
              </div>
              <div className="h-8 w-16 flex items-end gap-[1px]">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="bg-neon-green/50 w-full" style={{ height: `${Math.random() * 100}%` }} />
                ))}
              </div>
            </div>
          </div>

          {/* Live Logs */}
          <div className="h-48 border border-white/10 bg-black/40 p-4">
            <SystemLogs />
          </div>
        </div>

        {/* Center Column: The Primary Monitor */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="h-[50vh]">
            <ProcessMonitor />
          </div>
          <div className="h-[20vh]">
            <HormoneMonitor />
          </div>
        </div>

        {/* Right Column: Sleep Architecture & Biology */}
        <div className="lg:col-span-3 h-full flex flex-col gap-6">
          <div className="flex-1">
            <HypnogramBuilder />
          </div>
          <div className="h-64">
            <ThermalRig />
          </div>
        </div>

      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 w-full border-t border-white/5 bg-black/80 backdrop-blur text-[10px] font-mono uppercase text-white/30 p-2 flex justify-between px-6">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Simulation Running @ 60fps
        </span>
        <span>Borbély Model v1.0</span>
      </footer>
    </div>
  );
}
