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
    const [isAttacking, setIsAttacking] = useState(false);
    const attackList = ["attack1", "attack2", "attack3"];

    const triggerAttack = () => {
        if (isAttacking) return;

        setIsAttacking(true);

        setTimeout(() => {
            setIsAttacking(false);
        }, 300); // thời gian hiệu ứng
    };

    useEffect(() => {
        if (answerResult === "correct") {
            handleHeroAttack();
        }
    }, [answerResult]);


    const handleHeroAttack = () => {
        const attack =
            attackList[Math.floor(Math.random() * attackList.length)];

        setHeroState(attack);
        setHeroAttack(true);
        setBossHit(true);
        setHitStop(true);

        setBossHp(hp => Math.max(0, hp - DAMAGE));

        setTimeout(() => {
            setHeroAttack(false);
            setBossHit(false);
            setHitStop(false);
        }, 200);
    };
    useEffect(() => {
        if (answerResult?.correct === true) {
            handleHeroAttack();
        }

        if (answerResult?.correct === false) {
            setBossHp(100);
        }
    }, [answerResult?.id]);



    useEffect(() => {
        const interval = setInterval(() => {
            setIsAttacking(prev => !prev); // đảo trạng thái
        }, 300); // đổi mỗi 300ms (bạn chỉnh cho mượt)

        return () => clearInterval(interval);
    }, []);

    // useEffect(() => {
    //     if (answerResult.id === 0) return;

    //     if (answerResult.correct) {
    //         setHeroState("attack");
    //         setBossHit(true);
    //         setHitStop(true);

    //         setBossHp(hp => Math.max(0, hp - DAMAGE));

    //         setTimeout(() => {
    //             setHeroState("idle");
    //             setBossHit(false);
    //         }, 350);

    //         setTimeout(() => setHitStop(false), 120);
    //     }

    //     if (answerResult.correct === false) {
    //         setHeroState("hurt");

    //         setTimeout(() => {
    //             setHeroState("idle");
    //         }, 400);

    //         setBossHp(100);
    //     }
    // }, [answerResult.id]);



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
                animate={heroState !== "idle" ? { x: [0, 40, 0] } : {}}
                transition={{ duration: 0.25, ease: "easeOut" }}
            >
                <HeroWizard
                    state={heroState}
                    onAnimationEnd={() => setHeroState("idle")}
                />
            </motion.div>



            {/* 👹 BOSS */}
            <div className="absolute  right-20 z-20">
                <Boss hit={bossHit} />
            </div>


        </motion.div>
    );
}
