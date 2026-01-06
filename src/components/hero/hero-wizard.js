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
        loop: true,
    },
    attack1: {
        src: "/assets/characters/hero/wizard/Attack_1.png",
        frames: 6,
        fps: 12,
        loop: false,
    },
    attack2: {
        src: "/assets/characters/hero/wizard/Attack_2.png",
        frames: 6,
        fps: 12,
        loop: false,
    },
    attack3: {
        src: "/assets/characters/hero/wizard/Attack_3.png",
        frames: 6,
        fps: 12,
        loop: false,
    },
};

export default function HeroWizard({ state = "idle", onAnimationEnd }) {
    const sprite = SPRITES[state] || SPRITES.idle;
    const [frame, setFrame] = useState(0);

    const [finished, setFinished] = useState(false);

    useEffect(() => {
        setFrame(0);
        setFinished(false);

        const interval = setInterval(() => {
            setFrame(f => {
                if (!sprite.loop && f === sprite.frames - 1) {
                    clearInterval(interval);
                    setFinished(true);
                    return f;
                }
                return (f + 1) % sprite.frames;
            });
        }, 1000 / sprite.fps);

        return () => clearInterval(interval);
    }, [state]);
    
    useEffect(() => {
        if (finished) {
            onAnimationEnd?.();
        }
    }, [finished]);


    return (
        <div
            style={{
                width: FRAME_WIDTH * SCALE,
                height: FRAME_HEIGHT * SCALE,
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
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







