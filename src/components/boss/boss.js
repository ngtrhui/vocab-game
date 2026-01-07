"use client";
import { useEffect, useState, useMemo } from "react";
import { BOSS_SPRITES } from "@/configs/bossSprites";

const FRAME_WIDTH = 128;
const FRAME_HEIGHT = 128;
const SCALE = 3;

export default function Boss({
    level,
    hit = false,
    hp = 100,
    onDyingComplete,
}) {
    const [state, setState] = useState("idle");
    const [frame, setFrame] = useState(0);
    const sprite = BOSS_SPRITES[level]?.[state];

    const frames = useMemo(() => {
        if (!sprite) return [];
        return Array.from({ length: sprite.frames }, (_, i) =>
            `/assets/characters/monster/${level}/${sprite.path}/${sprite.path}_${String(i).padStart(3, "0")}.png`
        );
    }, [sprite, level]);

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
                        onDyingComplete?.();
                        return sprite.frames - 1;
                    }

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
                width: FRAME_WIDTH * SCALE,
                height: FRAME_HEIGHT * SCALE,
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
            }}
        >

            <img
                src={frames[frame]}
                alt={`boss-${level}`}
                draggable={false}
                style={{
                    width: FRAME_WIDTH,
                    height: FRAME_HEIGHT,
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