"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "@/components/hero/hero";
import Boss from "@/components/boss/boss";

export default function BattleScene({ answerResult, total }) {
    const DAMAGE = Math.ceil(100 / total);

    const [bossHp, setBossHp] = useState(100);
    const [bossHit, setBossHit] = useState(false);
    const [heroAttack, setHeroAttack] = useState(false);
    const [hitStop, setHitStop] = useState(false);

    useEffect(() => {
        if (answerResult.id === 0) return;

        if (answerResult.correct) {
            setHeroAttack(true);
            setBossHit(true);
            setHitStop(true);

            setBossHp(hp => Math.max(0, hp - DAMAGE));

            setTimeout(() => setHeroAttack(false), 300);
            setTimeout(() => setBossHit(false), 300);
            setTimeout(() => setHitStop(false), 100);
        }

        if (answerResult.correct === false) {
            setBossHp(100);
        }
    }, [answerResult.id]);

    return (
        <motion.div
            className="absolute inset-0 overflow-hidden"
            animate={
                bossHit
                    ? { x: [0, -10, 10, -6, 6, 0] }
                    : {}
            }
            transition={{ duration: 0.3 }}
        >
            {/* BACKGROUND */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-black" />

            {/* HIT EFFECT */}
            <AnimatePresence>
                {bossHit && (
                    <motion.div
                        key={answerResult.id}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute inset-0 flex items-center justify-center text-6xl"
                    >
                        💥
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HERO */}
            <motion.div
                className="absolute bottom-10 left-20 z-20"
                animate={
                    heroAttack
                        ? { x: [0, 80, 0] }
                        : {}
                }
                transition={{ duration: 0.3 }}
            >
                <Hero isAttacking={heroAttack} />
            </motion.div>

            {/* BOSS */}
            <div className={`absolute bottom-10 right-20 z-20 ${hitStop ? "scale-105" : ""}`}>
                <Boss hp={bossHp} hit={bossHit} />
            </div>
        </motion.div>
    );
}
