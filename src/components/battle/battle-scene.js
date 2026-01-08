"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Boss from "@/components/boss/boss";
import HeroWizard from "@/components/hero/hero-wizard";

export default function BattleScene({ answerResult, onBossDead, level, bossPhase, }) {
    const maxHits = 20;
    const DAMAGE = 1;
    const START_X = 0;
    const ATTACK_X = -180;

    const [bossX, setBossX] = useState(START_X);
    const [bossState, setBossState] = useState("idle");

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
        switch (bossPhase) {
            case "approaching":
                setBossX(ATTACK_X);
                setBossState("walking");
                break;

            case "retreating":
                setBossX(START_X);
                setBossState("walking");
                break;

            case "attacking":
                setBossState("attack");
                break;

            default:
                setBossState("idle");
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
                transition={{ duration: 1.2, ease: "easeInOut" }}
            >
                <Boss
                    level={level}
                    hp={bossHp}
                    hit={bossHit}
                    state={bossState}
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