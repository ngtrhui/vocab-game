"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Boss from "@/components/boss/boss";
import HeroWizard from "@/components/hero/hero-wizard";

export default function BattleScene({
    answerResult,
    onBossDead,
}) {
    const maxHits = 20;
    const DAMAGE = 1;
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

            <div className="absolute right-20 z-20">
                <Boss
                    hp={bossHp}
                    hit={bossHit}
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
            </div>
        </div>
    );
}