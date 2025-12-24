"use client";

import React, { useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    ReferenceLine
} from "recharts";
import { useBioStore } from "@/lib/store";
import { AlertTriangle, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Generate Hormonal Data (24h)
// Cortisol: Peaks 8AM (Morning Pulse), drops low at night.
// Melatonin: Low all day, rises 9PM (DLMO), peaks 3AM.
const generateHormoneData = (stressSpike: boolean) => {
    const data = [];
    for (let i = 0; i <= 24; i += 1) {
        // Base Cortisol (Car Curve)
        let cortisol = 5 + 15 * Math.exp(-Math.pow(i - 8, 2) / 8); // Morning peak
        if (i > 16 && stressSpike) {
            cortisol += 10 * Math.exp(-Math.pow(i - 20, 2) / 2); // Late night stress spike
        }

        // Melatonin (Inverted U, suppressed by Cortisol)
        let melatonin = 0;
        if (i > 18 || i < 8) { // Night time
            // Simple Gaussian for night
            let dist = i > 12 ? i - 26 : i + 2; // Wrap around 24h roughly
            if (i < 8) dist = i - 2; // Peak at 2AM

            melatonin = 50 * Math.exp(-Math.pow(dist, 2) / 10);
        }

        // Biological Rule: High Cortisol suppresses Melatonin synthesis
        if (cortisol > 8) {
            melatonin *= 0.2; // Massive suppression
        }

        data.push({
            hour: i,
            label: `${i}:00`,
            cortisol,
            melatonin
        });
    }
    return data;
};

export default function HormoneMonitor() {
    const { addLog } = useBioStore();
    const [stressEvent, setStressEvent] = React.useState(false);

    const data = useMemo(() => generateHormoneData(stressEvent), [stressEvent]);

    const toggleStress = () => {
        const newState = !stressEvent;
        setStressEvent(newState);
        if (newState) {
            addLog("CORTISOL_SPIKE::MELATONIN_SUPPRESSED", "alert");
        } else {
            addLog("CORTISOL_LEVELS_NORMALIZING", "success");
        }
    };

    return (
        <div className="w-full h-full bg-[#0a0a0a] border border-white/10 flex flex-col p-4 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4 z-10">
                <h3 className="text-white font-display uppercase tracking-widest text-sm flex items-center gap-2">
                    Endocrine System
                    {stressEvent && <AlertTriangle className="w-3 h-3 text-neon-red animate-pulse" />}
                </h3>
            </div>

            <div className="flex-1 w-full min-h-[150px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorMelatonin" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorCortisol" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                        <XAxis dataKey="hour" hide />
                        <YAxis hide />
                        <RechartsTooltip
                            contentStyle={{ backgroundColor: "#000", border: "1px solid #333" }}
                            labelStyle={{ color: "#666" }}
                            itemStyle={{ fontSize: "10px", fontFamily: "monospace" }}
                        />

                        <Area
                            type="monotone"
                            dataKey="melatonin"
                            stroke="#4f46e5"
                            fillOpacity={1}
                            fill="url(#colorMelatonin)"
                            name="Melatonin (pg/mL)"
                            animationDuration={500}
                        />
                        <Area
                            type="monotone"
                            dataKey="cortisol"
                            stroke="#f43f5e"
                            fillOpacity={1}
                            fill="url(#colorCortisol)"
                            name="Cortisol (µg/dL)"
                            animationDuration={500}
                        />

                        {/* The Forbidden Zone Marker (approx 8-10 PM) */}
                        <ReferenceLine x={20} stroke="white" strokeDasharray="3 3" label={{ value: "Forbidden Zone", position: 'insideTopLeft', fill: 'white', fontSize: 10 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 z-10">
                <button
                    onClick={toggleStress}
                    className={`w-full py-2 text-xs font-mono uppercase border transition-all flex items-center justify-center gap-2 ${stressEvent ? 'border-neon-red bg-neon-red/10 text-neon-red' : 'border-white/20 hover:bg-white/5 text-white/60'}`}
                >
                    {stressEvent ? "Acute Stress Active" : "Trigger Stress Event"}
                </button>
            </div>

            {/* Legend */}
            <div className="flex justify-between mt-2 text-[10px] font-mono uppercase text-white/30 z-10">
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-indigo-600 rounded-full" /> Melatonin</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-rose-500 rounded-full" /> Cortisol</span>
            </div>
        </div>
    )
}
