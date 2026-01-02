"use client";
import { useEffect, useState, useMemo } from "react";

const FRAME_SIZE = 900;
const SCALE = 0.4;
const FPS = 8;
const TOTAL_FRAMES = 18;

export default function Boss({ hit = false }) {
    const [frame, setFrame] = useState(0);

    // 🔥 preload toàn bộ ảnh
    const frames = useMemo(() => {
        return Array.from({ length: TOTAL_FRAMES }, (_, i) =>
            `/assets/characters/monster/n5/Idle/0_Skeleton_Warrior_Idle_${String(i).padStart(3, "0")}.png`
        );
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setFrame(f => (f + 1) % TOTAL_FRAMES);
        }, 1000 / FPS);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            style={{
                width: FRAME_SIZE * SCALE,
                height: FRAME_SIZE * SCALE,
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
            }}
        >
            <img
                src={frames[frame]}
                alt="boss"
                draggable={false}
                style={{
                    width: FRAME_SIZE,
                    height: FRAME_SIZE,
                    transform: `scale(${SCALE}) scaleX(-1)`,
                    transformOrigin: "bottom center",
                    imageRendering: "pixelated",
                    filter: hit ? "brightness(1.4)" : "none",
                    pointerEvents: "none",
                }}
            />
        </div>
    );
}

