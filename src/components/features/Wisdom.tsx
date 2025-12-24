"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUOTES = [
    "Sleep is the interest we pay on the capital needed to stay alive.",
    "The shorter your sleep, the shorter your life.",
    "Rest is a weapon. Sharpen it.",
    "You are a biological machine. Respect the mechanics.",
    "Recovery is the prerequisite for intensity.",
    "Win the night to conquer the day."
];

export default function Wisdom() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % QUOTES.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="text-center h-12 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="text-white/40 font-mono text-xs md:text-sm tracking-wider italic"
                >
                    &quot;{QUOTES[index]}&quot;
                </motion.p>
            </AnimatePresence>
        </div>
    );
}
