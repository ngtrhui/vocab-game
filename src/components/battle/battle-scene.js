"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import Hero from "@/components/hero/hero";
import Boss from "@/components/boss/boss";
import HeroWizard from "@/components/hero/hero-wizard";


export default function BattleScene({ answerResult, total, background }) {
    const DAMAGE = Math.ceil(100 / total);

    const [bossHp, setBossHp] = useState(100);
    const [bossHit, setBossHit] = useState(false);
    const [heroAttack, setHeroAttack] = useState(false);
    const [hitStop, setHitStop] = useState(false);
    const [heroState, setHeroState] = useState("idle");

    // useEffect(() => {
    //     if (answerResult.id === 0) return;

    //     // ✅ TRẢ LỜI ĐÚNG
    //     if (answerResult.correct) {
    //         setHeroState("attack");     // 🧙‍♂️ Wizard tấn công
    //         setBossHit(true);
    //         setHitStop(true);

    //         setBossHp(hp => Math.max(0, hp - DAMAGE));

    //         // reset animation
    //         setTimeout(() => setHeroState("idle"), 300);
    //         setTimeout(() => setBossHit(false), 300);
    //         setTimeout(() => setHitStop(false), 100);
    //     }

    //     // ❌ TRẢ LỜI SAI
    //     if (answerResult.correct === false) {
    //         setHeroState("hurt");       // 🧙‍♂️ Wizard bị đánh
    //         setBossHp(100);

    //         setTimeout(() => {
    //             setHeroState("idle");
    //         }, 400);
    //     }
    // }, [answerResult.id]);

    const [isAttacking, setIsAttacking] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAttacking(prev => !prev); // đảo trạng thái
        }, 300); // đổi mỗi 300ms (bạn chỉnh cho mượt)

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (answerResult.id === 0) return;

        if (answerResult.correct) {
            setHeroState("attack");
            setBossHit(true);
            setHitStop(true);

            setBossHp(hp => Math.max(0, hp - DAMAGE));

            setTimeout(() => {
                setHeroState("idle");
                setBossHit(false);
            }, 350);

            setTimeout(() => setHitStop(false), 120);
        }

        if (answerResult.correct === false) {
            setHeroState("hurt");

            setTimeout(() => {
                setHeroState("idle");
            }, 400);

            setBossHp(100);
        }
    }, [answerResult.id]);



    return (
        <motion.div
            className="absolute inset-0 w-full h-full overflow-hidden"
            animate={
                bossHit
                    ? { x: [0, -10, 10, -6, 6, 0] }
                    : {}
            }
            transition={{ duration: 0.3 }}
        >
            {/* 🌄 BACKGROUND */}
            {background ? (
                <div
                    className="absolute inset-0 w-full h-full overflow-hidden"
                    style={{ backgroundImage: `url(${background})` }}
                />
            ) : (
                <div className="absolute inset-0 from-black/40 to-black/80" />
            )}

            {/* 💥 HIT EFFECT */}
            <AnimatePresence>
                {bossHit && (
                    <motion.div
                        key={answerResult.id}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute inset-0 flex items-center justify-center text-6xl z-30"
                    >
                        💥
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="absolute bottom-10 left-20 z-20"
            >
                <HeroWizard state="idle" />
            </motion.div>

            {/* 👹 BOSS */}
            <div className={`absolute bottom-10 right-20 z-20 ${hitStop ? "scale-105" : ""}`}>
                <Boss hp={bossHp} hit={bossHit} />
            </div>
        </motion.div>
    );
}
