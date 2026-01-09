"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Boss from "@/components/boss/boss";
import HeroWizard from "@/components/hero/hero-wizard";

export default function BattleScene({ answerResult, onBossDead, level, bossPhase, timeLeft, attackTime, onBossAttackComplete }) {
    const maxHits = 20;
    const DAMAGE = 1;
    const START_X = 0;
    const MOVE_DISTANCE = 750; // 👈 chỉnh khoảng cách tại đây
    const ATTACK_X = START_X - MOVE_DISTANCE;
    const [canShowOptions, setCanShowOptions] = useState(false);

    const [bossX, setBossX] = useState(START_X);
    const [bossState, setBossState] = useState("idle");
    const [shouldAnimate, setShouldAnimate] = useState(true);

    const [bossHp, setBossHp] = useState(100);
    const [bossHit, setBossHit] = useState(false);
    const [heroState, setHeroState] = useState("idle");
    const [correctCount, setCorrectCount] = useState(0);
    const lastAnswerId = useRef(null);
    const hasNotifiedDead = useRef(false);

    const handleHeroAttack = () => {
        setHeroState(
            ["attack1", "attack2", "attack3"][
            Math.floor(Math.random() * 3)
            ]
        );

        setBossHit(true);

        setBossHp((hp) => {
            if (correctCount < maxHits - 1) {
                return Math.max(0, hp - DAMAGE);
            }
            return hp;
        });

        setTimeout(() => setBossHit(false), 200);
    };

    useEffect(() => {
        if (bossPhase !== "approaching") return;

        const progress = 1 - timeLeft / attackTime; // 0 → 1
        const nextX = START_X + (ATTACK_X - START_X) * progress;

        setBossX(nextX);
        setBossState("walking");
    }, [timeLeft, bossPhase, attackTime]);

    useEffect(() => {
        if (bossPhase === "attacking") {
            setCanShowOptions(false); // reset
        }
    }, [bossPhase]);

    useEffect(() => {
        if (bossPhase === "idle") {
            setShouldAnimate(false);   // ❗ không animate
            setBossX(START_X);
            setBossState("idle");
            return;
        }

        setShouldAnimate(true);

        if (bossPhase === "approaching") {
            setBossState("walking");
        }

        if (bossPhase === "retreating") {
            setBossX(START_X);
            setBossState("walking");
        }

        if (bossPhase === "attacking") {
            setBossState("attack");
        }
    }, [bossPhase]);

    useEffect(() => {
        setBossHp(100);
        setBossHit(false);
        hasNotifiedDead.current = false;
    }, [level]);

    useEffect(() => {
        if (correctCount === maxHits && bossHp > 0) {
            setBossHp(0);
        }
    }, [correctCount]);

    useEffect(() => {
        if (!answerResult) return;
        if (answerResult.id === lastAnswerId.current) return;
        lastAnswerId.current = answerResult.id;

        if (answerResult.correct) {
            setCorrectCount((c) => {
                const next = c + 1;
                handleHeroAttack();
                return next;
            });
        } else {
            setCorrectCount(0);
            setBossHp(100);
            hasNotifiedDead.current = false;
        }
    }, [answerResult]);

    return (
        <div className="absolute inset-0 overflow-hidden">

            <motion.div
                className="absolute bottom-10 left-20 z-20"
                animate={heroState !== "idle" ? { x: [0, 40, 0] } : {}}
            >
                <HeroWizard
                    state={heroState}
                    onAnimationEnd={() => setHeroState("idle")}
                />
            </motion.div>

            <motion.div className="absolute bottom: 0.25rem right-20 z-20"
                animate={{ x: bossX }}
                initial={false}
                transition={
                    shouldAnimate
                        ? { duration: 0.2, ease: "linear" }
                        : { duration: 0 }
                }
            >
                <Boss
                    level={level}
                    hp={bossHp}
                    hit={bossHit}
                    state={bossState}
                    onAttackComplete={() => {
                        onBossAttackComplete?.(); 
                    }}
                    onDyingComplete={() => {
                        if (
                            !hasNotifiedDead.current &&
                            correctCount === maxHits
                        ) {
                            hasNotifiedDead.current = true;
                            onBossDead?.();
                        }
                    }}
                />
            </motion.div>
        </div>
    );
}