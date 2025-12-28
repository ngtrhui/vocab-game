"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Hero from "@/components/hero/hero";
import Boss from "@/components/boss/boss";

export default function BattleScene({
    answerResult,
    current,
    total,
    combo
}) {
    const DAMAGE = Math.ceil(100 / total);

    const [bossHp, setBossHp] = useState(100);
    const [heroAttack, setHeroAttack] = useState(false);
    const [bossHit, setBossHit] = useState(false);
    const [damage, setDamage] = useState(null);

    const [lastDamage, setLastDamage] = useState(0);
    const [bossHeal, setBossHeal] = useState(false);


    const isDead = bossHp <= 0;
    
    const [hitStop, setHitStop] = useState(false);

    useEffect(() => {
        if (answerResult.correct === true) {
            setHitStop(true);
            setTimeout(() => setHitStop(false), 100);
        }
    }, [answerResult.id]);


    useEffect(() => {
        if (!answerResult || answerResult.id === 0) return;

        // ✅ ĐÚNG → BOSS MẤT MÁU
        if (answerResult.correct) {
            setHeroAttack(true);
            setBossHit(true);

            const finalDamage = combo >= 3 ? DAMAGE * 2 : DAMAGE;
            setDamage(finalDamage);

            setBossHp(hp => Math.max(0, hp - finalDamage));

            setTimeout(() => {
                setHeroAttack(false);
                setBossHit(false);
                setDamage(null);
            }, 400);
        }

        // ❌ SAI → BOSS HỒI FULL MÁU
        if (answerResult.correct === false) {
            setBossHeal(true);
            setBossHp(100); // 🔥 FULL HP

            setTimeout(() => {
                setBossHeal(false);
            }, 600);
        }
    }, [answerResult.id]);



    return (
        <motion.div
            className="absolute inset-0 overflow-hidden"
            animate={{
                x:
                    answerResult?.correct === false
                        ? [0, -12, 12, -8, 8, 0]
                        : 0
            }}
            transition={{ duration: 0.25 }}
        >
            {/* ================= BACKGROUND ================= */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('/bg.png')] bg-cover bg-center" />

                {/* Clouds */}
                <motion.div
                    className="absolute top-16 w-full h-32 bg-[url('/clouds.png')] bg-repeat-x opacity-70"
                    animate={{ x: ["0%", "-100%"] }}
                    transition={{
                        duration: 80,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>

            <div className="absolute bottom-6 left-10 z-20">
                <Hero isAttacking={heroAttack} />
            </div>

            <div className="absolute bottom-6 right-10 z-20">
                <Boss
                    hp={bossHp}
                    isHit={bossHit}
                    isDead={isDead}
                    isHeal={bossHeal}
                />

                {/* DAMAGE FLOAT */}
                {damage && (
                    <motion.div
                        className="absolute -top-12 left-1/2 -translate-x-1/2 text-red-500 font-bold text-2xl"
                        initial={{ y: 0, opacity: 1 }}
                        animate={{ y: -30, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        -{damage}
                    </motion.div>
                )}
            </div>

            {/* ================= BOSS DEAD ================= */}
            {isDead && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-yellow-400 z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    🎉 BOSS DEFEATED!
                </motion.div>
            )}
        </motion.div>
    );
}
