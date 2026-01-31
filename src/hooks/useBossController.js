"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, animate } from "framer-motion";

export default function useBossController({
    bossPhase,
    attackTime,
    isPaused,
    onBossAttackComplete,
}) {
    const START_X = 950;
    const MOVE_DISTANCE = 750;
    const ATTACK_X = START_X - MOVE_DISTANCE;
    const ATTACK_THRESHOLD = 9;
    const JUMP_ATTACK_TIME = 0.25;

    const bossX = useMotionValue(START_X);
    const bossAnimationRef = useRef(null);
    const lastBossPhase = useRef(bossPhase);
    const bossStableXRef = useRef(START_X);

    const [bossState, setBossState] = useState("idle");
    const [bossHit, setBossHit] = useState(false);
    const [bossHp, setBossHp] = useState(100);

    useEffect(() => {
        const unsubscribe = bossX.on("change", (latest) => {
            bossStableXRef.current = latest;
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!bossHit) return;

        bossAnimationRef.current?.stop();

        bossAnimationRef.current = animate(bossX, START_X, {
            duration: 0.3,
            ease: "easeOut",
            onComplete: () => {
                if (bossPhase === "approaching" && !isPaused) {
                    const totalDistance = Math.abs(ATTACK_X - START_X);
                    const remainingTime = attackTime;

                    bossAnimationRef.current = animate(bossX, ATTACK_X, {
                        duration: remainingTime,
                        ease: "linear",
                    });
                }
            },
        });

        const timer = setTimeout(() => {
            onBossAttackComplete?.();
        }, 250);

        return () => clearTimeout(timer);
    }, [bossHit]);

    useEffect(() => {
        if (!bossHit) return;

        const timer = setTimeout(() => {
            setBossHit(false);
        }, 250);

        return () => clearTimeout(timer);
    }, [bossHit]);


    useEffect(() => {
        if (bossHit) return;

        const phaseChanged = lastBossPhase.current !== bossPhase;
        lastBossPhase.current = bossPhase;

        if (bossPhase === "idle") {
            bossAnimationRef.current?.stop();
            setBossState("idle");
            return;
        }

        if (bossPhase === "approaching") {
            setBossState("walking");
            bossAnimationRef.current?.stop();

            if (phaseChanged) {
                bossX.set(START_X);
            }

            if (isPaused) return;

            const currentX = bossX.get();
            const totalDistance = Math.abs(ATTACK_X - START_X);
            const remainingDistance = Math.abs(ATTACK_X - currentX);

            const remainingTime =
                (remainingDistance / totalDistance) * attackTime;

            bossAnimationRef.current = animate(bossX, ATTACK_X, {
                duration: remainingTime,
                ease: "linear",
            });
        }

        if (bossPhase === "retreating") {
            setBossState("walking");
            bossAnimationRef.current?.stop();

            if (isPaused) return;

            bossAnimationRef.current = animate(bossX, START_X, {
                duration: 0.6,
                ease: "easeOut",
                onComplete: onBossAttackComplete,
            });
        }

        if (bossPhase === "attacking") {
            bossAnimationRef.current?.stop();

            const currentX = bossX.get();
            const isNearHero =
                Math.abs(currentX - ATTACK_X) <= ATTACK_THRESHOLD;

            if (!isNearHero) {
                bossAnimationRef.current = animate(bossX, ATTACK_X, {
                    duration: JUMP_ATTACK_TIME,
                    ease: "easeIn",
                    onComplete: () => {
                        setBossState("attack");
                    },
                });
                return;
            }

            setBossState("attack");
        }

        return () => bossAnimationRef.current?.stop();
    }, [bossPhase, isPaused, attackTime]);

    const resetBoss = () => {
        setBossHp(100);
        setBossHit(false);
        bossX.set(START_X);
    };

    return {
        bossX,
        bossState,
        bossHp,
        bossHit,
        setBossHit,
        setBossHp,
        bossStableXRef,
        resetBoss,
    };
}
