// const SPRITES = {
//     idle: {
//         src: "/assets/characters/hero/wizard/Idle.png",
//         frames: 6,
//         fps: 6,
//     },
//     idle2: {
//         src: "/assets/characters/hero/wizard/Idle_2.png",
//         frames: 6,
//         fps: 6,
//     },
//     attack: [
//         "/assets/characters/hero/wizard/Attack_1.png",
//         "/assets/characters/hero/wizard/Attack_2.png",
//         "/assets/characters/hero/wizard/Attack_3.png",
//     ],
//     hurt: [
//         "/assets/characters/hero/wizard/Hurt.png",
//     ],
//     dead: [
//         "/assets/characters/hero/wizard/Dead.png",
//     ],
// };

"use client";
import { useEffect, useState } from "react";

const FRAME_WIDTH = 128;
const FRAME_HEIGHT = 128;
const SCALE = 2;

const SPRITES = {
    idle: {
        src: "/assets/characters/hero/wizard/Idle.png",
        frames: 6,
        fps: 6,
    },
};

export default function HeroWizard({ state = "idle" }) {
    const sprite = SPRITES[state];
    const [frame, setFrame] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setFrame(f => (f + 1) % sprite.frames);
        }, 1000 / sprite.fps);

        return () => clearInterval(interval);
    }, [sprite]);

    return (
        <div
            style={{
                width: FRAME_WIDTH * SCALE,
                height: FRAME_HEIGHT * SCALE,
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end", // 🔥 giữ chân cố định
            }}
        >
            <div
                className="pixelated"
                style={{
                    width: FRAME_WIDTH,
                    height: FRAME_HEIGHT,
                    backgroundImage: `url(${sprite.src})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: `-${frame * FRAME_WIDTH}px 0px`,
                    transform: `scale(${SCALE})`,
                    transformOrigin: "bottom center",
                }}
            />
        </div>
    );
}






