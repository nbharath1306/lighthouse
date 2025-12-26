"use client";

import { useRef, useEffect } from "react";

export function SoundManager() {
    const audioRef = useRef<HTMLAudioElement>(null);

    // Auto-play attempt on mount
    useEffect(() => {
        const play = () => {
            if (audioRef.current) {
                audioRef.current.volume = 0.2;
                audioRef.current.play().catch(() => { });
            }
        };
        document.addEventListener('click', play, { once: true });
        return () => document.removeEventListener('click', play);
    }, []);

    return (
        <audio ref={audioRef} loop>
            {/* Source disabled to prevent 403 error */}
            {/* <source src="..." type="audio/mpeg" /> */}
        </audio>
    );
}
