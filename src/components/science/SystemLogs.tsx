"use client";

import React, { useEffect, useRef } from "react";
import { useBioStore } from "@/lib/store";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";

export default function SystemLogs() {
    const { logs } = useBioStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <div className="h-full w-full flex flex-col font-mono text-[10px] uppercase overflow-hidden">
            <h3 className="text-white/40 mb-2 flex justify-between">
                <span>System Logs</span>
                <span className="text-neon-green animate-pulse">● LIVE</span>
            </h3>

            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 scrollbar-hide mask-gradient-b">
                <AnimatePresence initial={false}>
                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className={clsx(
                                "flex gap-2",
                                log.type === "alert" && "text-neon-red",
                                log.type === "warning" && "text-orange-500",
                                log.type === "success" && "text-neon-green",
                                log.type === "info" && "text-neon-blue/70"
                            )}
                        >
                            <span className="opacity-50">[{log.timestamp}]</span>
                            <span>{log.message}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
