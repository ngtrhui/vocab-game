"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Boss from "@/components/boss/boss";
import HeroWizard from "@/components/hero/hero-wizard";

export default function BattleScene({ answerResult, total, background }) {
    const maxHits =20;
    const DAMAGE = Math.ceil(100 / maxHits);

    const [bossHp, setBossHp] = useState(100);
    const [bossHit, setBossHit] = useState(false);
    const [heroState, setHeroState] = useState("idle");
    const [showResultModal, setShowResultModal] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);

    const lastAnswerId = useRef(null);

    const handleHeroAttack = () => {
        setHeroState(["attack1", "attack2", "attack3"][Math.floor(Math.random() * 3)]);
        setBossHit(true);

        setBossHp((hp) => Math.max(0, hp - DAMAGE));

        setTimeout(() => setBossHit(false), 200);
    };

    useEffect(() => {
        if (!answerResult) return;
        if (answerResult.id === lastAnswerId.current) return;
        lastAnswerId.current = answerResult.id;

        if (answerResult.correct) {
            setCorrectCount((c) => {
                const next = c + 1;
                handleHeroAttack();
                if (next === total) {
                }

                return next;
            });
        } else {
            setCorrectCount(0);
            setBossHp(100);
        }
    }, [answerResult]);


    return (
        <div className="absolute inset-0 overflow-hidden">
            {background && (
                <div
                    className="absolute inset-0"
                    style={{ backgroundImage: `url(${background})` }}
                />
            )}

            <motion.div
                className="absolute bottom-10 left-20 z-20"
                animate={heroState !== "idle" ? { x: [0, 40, 0] } : {}}
            >
                <HeroWizard
                    state={heroState}
                    onAnimationEnd={() => setHeroState("idle")}
                />
            </motion.div>

            {/* BOSS */}
            <div className="absolute right-20 z-20">
                <Boss
                    hp={bossHp}
                    hit={bossHit}
                    onDyingComplete={() => {
                        setShowResultModal(true);
                    }}
                />
            </div>

            {/* MODAL */}
            <AnimatePresence>
                {showResultModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="bg-white rounded-xl p-6 text-center space-y-4"
                        >
                            <h2 className="text-xl font-bold">🎉 Chiến thắng!</h2>

                            <button className="btn" onClick={() => console.log("NEXT")}>
                                ▶ Màn tiếp theo
                            </button>

                            <button className="btn" onClick={() => console.log("EXIT")}>
                                ⏹ Thoát
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
