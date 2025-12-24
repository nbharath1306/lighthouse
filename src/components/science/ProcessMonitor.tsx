"use client";

import React, { useMemo, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceArea
} from "recharts";
import { generateProcessData } from "@/lib/science/models";
import { useBioStore } from "@/lib/store";
import { HelpCircle } from "lucide-react";

export default function ProcessMonitor() {
    const { wakeTime, setWakeTime, addLog } = useBioStore();

    const data = useMemo(() => generateProcessData(wakeTime), [wakeTime]);

    // Find intersection (Crash Point)
    const crashPoint = useMemo(() => {
        return data.find(d => d.processS > d.processC && d.hour > wakeTime + 12);
    }, [data, wakeTime]);

    const hoursAwake = useMemo(() => {
        const currentHour = new Date().getHours();
        return Math.max(0, currentHour - wakeTime);
    }, [wakeTime]);

    // Log changes only when interaction stops (debounce simulation)
    useEffect(() => {
        const timer = setTimeout(() => {
            addLog(`BOOT_TIME_UPDATED::${wakeTime}:00`, 'info');
            addLog(`RECALCULATING_ADENOSINE_LOAD...`, 'warning');
        }, 500);
        return () => clearTimeout(timer);
    }, [wakeTime, addLog]);

    return (
        <div className="w-full h-full bg-[#0a0a0a] border border-white/10 relative overflow-hidden flex flex-col p-6 group box-border">
            {/* Header */}
            <div className="flex justify-between items-start mb-6 z-10">
                <div>
                    <h3 className="text-xs font-mono uppercase text-neon-green tracking-widest mb-1 flex items-center gap-2">
                        <span className="animate-pulse">●</span>
                        Bio-Simulation Active
                    </h3>
                    <h2 className="text-2xl font-display uppercase tracking-wider text-white">Process S / C Monitor</h2>
                </div>
                <div className="text-right">
                    <div className="text-xs text-white/40 font-mono uppercase">Predicted Crash</div>
                    <div className="text-xl font-mono text-neon-red">
                        {crashPoint ? crashPoint.timeLabel : "N/A"}
                    </div>
                </div>
            </div>

            {/* The Graph */}
            <div className="flex-1 w-full min-h-[300px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                        <XAxis
                            dataKey="timeLabel"
                            stroke="#444"
                            fontSize={10}
                            tickMargin={10}
                            interval={4}
                        />
                        <YAxis hide domain={[0, 1.2]} />

                        <Tooltip
                            contentStyle={{ backgroundColor: "#000", border: "1px solid #333" }}
                            itemStyle={{ fontSize: "12px", fontFamily: "monospace" }}
                            labelStyle={{ color: "#666", marginBottom: "5px" }}
                        />

                        <Line
                            type="monotone"
                            dataKey="processS"
                            stroke="#ff0040"
                            strokeWidth={2}
                            dot={false}
                            name="Process S (Sleep Pressure)"
                            animationDuration={300}
                        />

                        <Line
                            type="monotone"
                            dataKey="processC"
                            stroke="#00f0ff"
                            strokeWidth={2}
                            dot={false}
                            name="Process C (Energy Threshold)"
                            animationDuration={300}
                        />

                        {crashPoint && (
                            <ReferenceArea
                                x1={crashPoint.timeLabel}
                                x2={data[data.length - 1].timeLabel}
                                strokeOpacity={0}
                                fill="#ff0040"
                                fillOpacity={0.1}
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Controls Overlay */}
            <div className="mt-6 pt-6 border-t border-white/5 flex gap-8">
                <div className="space-y-4 flex-1">
                    <div className="flex justify-between items-end text-xs font-mono uppercase text-white/50">
                        <span className="text-white flex items-center gap-2">
                            SYSTEM BOOT TIME <span className="text-neon-green">(Time You Woke Up)</span>
                            <HelpCircle className="w-3 h-3 text-white/30 hover:text-white cursor-help" />
                        </span>
                        <span className="text-neon-green text-sm">{wakeTime}:00</span>
                    </div>

                    <input
                        type="range"
                        min="4"
                        max="12"
                        step="1"
                        value={wakeTime}
                        onChange={(e) => setWakeTime(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/10 accent-neon-green cursor-pointer appearance-none rounded-full"
                    />
                </div>

                <div className="flex-1 border-l border-white/10 pl-8 flex flex-col justify-center gap-2">
                    <div className="text-[10px] font-mono uppercase text-white/40">Current Load</div>
                    <div className="text-xl font-display text-white">
                        {hoursAwake} <span className="text-xs font-mono text-white/30">HOURS AWAKE</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-neon-red"
                            style={{ width: `${Math.min(100, (hoursAwake / 16) * 100)}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
