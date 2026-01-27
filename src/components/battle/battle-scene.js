"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import Boss from "@/components/boss/boss";
import HeroWizard from "@/components/hero/hero-wizard";

export default function BattleScene({
    answerResult,
    onBossDead,
    level,
    bossPhase,
    attackTime,
    isPaused,
    onBossAttackComplete,
    onHeroDyingComplete,
}) {
    const maxHits = 20;
    const DAMAGE = 1;
    const lastBossPhase = useRef(bossPhase);
    const START_X = 0;
    const MOVE_DISTANCE = 750;
    const ATTACK_X = START_X - MOVE_DISTANCE;
    const [canShowOptions, setCanShowOptions] = useState(false);
    const HERO_MAX_HP = 1;
    const [heroHp, setHeroHp] = useState(HERO_MAX_HP);
    const [bossState, setBossState] = useState("idle");
    const [bossHp, setBossHp] = useState(100);
    const [bossHit, setBossHit] = useState(false);
    const [heroState, setHeroState] = useState("idle");
    const [correctCount, setCorrectCount] = useState(0);
    const lastAnswerId = useRef(null);
    const hasNotifiedDead = useRef(false);
    const bossX = useMotionValue(START_X);
    const bossAnimationRef = useRef(null);

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
        if (bossPhase === "attacking") {
            setCanShowOptions(false);
        }
    }, [bossPhase]);

    useEffect(() => {
        setHeroHp(HERO_MAX_HP);
    }, [level]);

    useEffect(() => {
        if (bossPhase === "idle") {
            setHeroState("idle");
            setHeroHp(HERO_MAX_HP);
        }
    }, [bossPhase]);

    useEffect(() => {
        const phaseChanged = lastBossPhase.current !== bossPhase;
        lastBossPhase.current = bossPhase;

        if (bossPhase === "idle") {
            bossAnimationRef.current?.stop();
            bossX.set(START_X);
            setBossState("idle");
            return;
        }

        if (bossPhase === "approaching") {
            setBossState("walking");
            bossAnimationRef.current?.stop();

            // ✅ CHỈ reset vị trí khi phase mới bắt đầu
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
            setBossState("attack");
        }

        return () => bossAnimationRef.current?.stop();
    }, [bossPhase, isPaused, attackTime]);

    useEffect(() => {
        setHeroHp(HERO_MAX_HP);
    }, [level]);

    useEffect(() => {
        setBossHp(100);
        setBossHit(false);
        hasNotifiedDead.current = false;
        bossX.set(START_X);
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
                handleHeroAttack();
                return c + 1;
            });
        } else {
            setCorrectCount(0);
            setBossHp(100);
            hasNotifiedDead.current = false;
        }
    }, [answerResult]);

    useEffect(() => {
        if (correctCount === maxHits && bossHp > 0) {
            setBossHp(0);
        }
    }, [correctCount, bossHp]);

    return (
        <div className="absolute inset-0 overflow-hidden">
            <motion.div
                className="absolute bottom-10 left-20 z-20"
                animate={heroState !== "idle" ? { x: [0, 40, 0] } : {}}
            >
                <HeroWizard
                    state={heroState}
                    onAnimationEnd={() => {
                        if (heroState === "hurt") {
                            if (heroHp <= 0) {
                                setHeroState("dying");
                            } else {
                                setHeroState("idle");
                            }
                        }

                        if (heroState === "dying") {
                            onHeroDyingComplete?.();
                        }

                        if (heroState.startsWith("attack")) {
                            setHeroState("idle");
                        }
                    }}
                />
            </motion.div>

            <motion.div
                className="absolute bottom:0.25rem right-20 z-20"
                style={{ x: bossX }}
            >
                <Boss
                    level={level}
                    hp={bossHp}
                    hit={bossHit}
                    state={bossState}
                    onAttackComplete={() => {
                        if (heroState === "dying") return;
                        setHeroHp((hp) => {
                            const nextHp = hp - 1;
                            setHeroState("hurt");
                            return Math.max(0, nextHp);
                        });
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