"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import Boss from "@/components/boss/boss";
import HeroWizard from "@/components/hero/hero-wizard";

export default function BattleScene({ answerResult, onBossDead, level, bossPhase, attackTime, isPaused, onBossAttackComplete, onHeroDyingComplete, }) {
    const maxHits = 20;
    const DAMAGE = 1;
    const lastBossPhase = useRef(bossPhase);
    const START_X = 850;
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
    const ATTACK_THRESHOLD = 9;
    const JUMP_ATTACK_TIME = 0.25;
    const HERO_START_X = 20;
    const heroX = useMotionValue(HERO_START_X);
    const heroAnimationRef = useRef(null);
    const bossStableXRef = useRef(START_X);

    const heroJumpAttack = () => {
        heroAnimationRef.current?.stop();

        const bossXValue = bossStableXRef.current;
        const heroTargetX = - (0 - bossXValue + 80)

        heroAnimationRef.current = animate(heroX, heroTargetX, {
            duration: 0.3,
            ease: "easeOut",
            onComplete: () => {
                setHeroState(
                    ["attack1", "attack2", "attack3"][
                    Math.floor(Math.random() * 3)
                    ]
                );

                setBossHit(true);

                setTimeout(() => {
                    setBossHit(false);

                    heroAnimationRef.current = animate(heroX, HERO_START_X, {
                        duration: 0.35,
                        ease: "easeInOut",
                        onComplete: () => {
                            setHeroState("idle");
                        },
                    });
                }, 250);
            },
        });
    };

    useEffect(() => {
        const unsubscribe = bossX.on("change", (latest) => {
            bossStableXRef.current = latest;
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!bossHit) {
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
        }
    }, [bossHit]);

    useEffect(() => {
        if (!bossHit) return;

        const timer = setTimeout(() => {
            onBossAttackComplete?.();
        }, 250);

        return () => clearTimeout(timer);
    }, [bossHit]);

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
            const isNearHero = Math.abs(currentX - ATTACK_X) <= ATTACK_THRESHOLD;

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
                heroJumpAttack();
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
                className="absolute bottom-10 left-0 z-20"
                style={{ x: heroX }}
            >
                <HeroWizard
                    state={heroState}
                    onAnimationEnd={() => {
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
                className="absolute bottom:0.25rem left-0 z-20"
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

                            if (nextHp <= 0) {
                                setHeroState("dying");
                            }

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