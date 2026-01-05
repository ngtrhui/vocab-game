"use client";
import { useEffect, useState, useMemo } from "react";

const FRAME_SIZE = 900;
const SCALE = 0.4;

const SPRITES = {
    idle: {
        path: "Idle",
        frames: 18,
        fps: 8,
        loop: true,
    },
    hurt: {
        path: "Hurt",
        frames: 8,
        fps: 12,
        loop: false,
    },
    dying: {
        path: "Dying",
        frames: 15,
        fps: 8,
        loop: false,
    },
};

export default function Boss({ hit = false, hp = 100 }) {
    const [state, setState] = useState("idle");
    const [frame, setFrame] = useState(0);

    const sprite = SPRITES[state];

    const frames = useMemo(() => {
        return Array.from({ length: sprite.frames }, (_, i) =>
            `/assets/characters/monster/n5/${sprite.path}/0_Skeleton_Warrior_${capitalize(
                sprite.path
            )}_${String(i).padStart(3, "0")}.png`
        );
    }, [sprite]);

    useEffect(() => {
        if (hit && hp > 0 && state !== "hurt") {
            setState("hurt");
            setFrame(0);
        }
    }, [hit, hp, state]);

    useEffect(() => {
        if (hp <= 0 && state !== "dying") {
            setState("dying");
            setFrame(0);
        }
    }, [hp, state]);

    useEffect(() => {
        if (!sprite) return;

        const interval = setInterval(() => {
            setFrame((f) => {
                const next = f + 1;

                if (next >= sprite.frames) {
                    if (sprite.loop) return 0;

                    if (state === "dying") {
                        return sprite.frames - 1;
                    }

                    // HURT xong → IDLE
                    setState("idle");
                    return 0;
                }

                return next;
            });
        }, 1000 / sprite.fps);

        return () => clearInterval(interval);
    }, [sprite, state]);

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
                    filter: state === "hurt" ? "brightness(1.4)" : "none",
                    pointerEvents: "none",
                }}
            />
        </div>
    );
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);