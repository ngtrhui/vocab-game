"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Boss from "@/components/boss/boss";
import HeroWizard from "@/components/hero/hero-wizard";

import useBossController from "@/hooks/useBossController";
import useHeroController from "@/hooks/useHeroController";

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
    const HERO_MAX_HP = 1;

    const [heroHp, setHeroHp] = useState(HERO_MAX_HP);
    const [correctCount, setCorrectCount] = useState(0);
    const hasNotifiedDead = useRef(false);
    const lastAnswerId = useRef(null);

    const {
        bossX,
        bossState,
        bossHp,
        bossHit,
        setBossHit,
        setBossHp,
        bossStableXRef,
        resetBoss,
    } = useBossController({
        bossPhase,
        attackTime,
        isPaused,
        onBossAttackComplete,
    });

    const {
        heroX,
        heroState,
        setHeroState,
        heroJumpAttack,
    } = useHeroController();

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
        if (!answerResult) return;
        if (answerResult.id === lastAnswerId.current) return;
        lastAnswerId.current = answerResult.id;

        if (answerResult.correct) {
            setCorrectCount((c) => {
                heroJumpAttack(bossStableXRef.current, () => {
                    setBossHit(true);
                });
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
            {/* HERO */}
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
                            const nextHp = hp - DAMAGE;

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