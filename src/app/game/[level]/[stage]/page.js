"use client";

import { useRouter } from "next/navigation";
import { useState, use, useEffect } from "react";
import { getStageWords } from "@/services/vocabularyService";
import QuestionCard from "@/components/question-card/question-card";
import BattleScene from "@/components/battle/battle-scene";
import FailModal from "@/components/fail-modal/fail-modal";
import OptionsModal from "@/components/options-modal/options-modal";
import { completeStage } from "@/utils/progress";
import * as STRING from "@/constant/strings";
import { getRandomBackground } from "@/utils/getRandomBackground";

export default function GamePage({ params }) {
    const { level, stage } = use(params);
    const router = useRouter();

    // Trạng thái game
    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [roundWords, setRoundWords] = useState([]);
    const [showFail, setShowFail] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [hasCompleted, setHasCompleted] = useState(false);
    const [background, setBackground] = useState(null);
    const [answerResult, setAnswerResult] = useState({
        correct: null,
        id: 0,
    });
    useEffect(() => {
        const bg = getRandomBackground(level);
        console.log("BG:", bg); // 👈 phải ra đường dẫn
        setBackground(bg);
    }, [level, stage]);


    useEffect(() => {
        const words = getStageWords(level);
        setRoundWords(words);
        const bg = getRandomBackground(level); // ✅ CHỈ DÒNG NÀY
        setBackground(bg);
        setIndex(0);
        setScore(0);
        setCombo(0);
        setShowFail(false);
        setHasCompleted(false);
    }, [level, stage]);

    const total = roundWords.length;
    const isFinished = index >= total;

    function handleAnswer(isCorrect) {
        setAnswerResult((prev) => ({
            correct: isCorrect,
            id: prev.id + 1,
        }));

        if (!isCorrect) {
            setCombo(0);
            setShowFail(true);
            return;
        }

        if (index + 1 === total) {
            setHasCompleted(true);
        }

        setCombo((c) => c + 1);
        setScore((s) => s + 1);
        setIndex((i) => i + 1);
    }

    if (isFinished || hasCompleted) {
        completeStage(level, stage);

        return (
            <div className="p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">{STRING.COMPLETE}</h2>
                <p className="mb-4">{STRING.POINT}: {score}/{total}</p>

                <button
                    onClick={() => router.replace(`/level/${level}`)}
                    className="px-6 py-3 bg-green-600 text-white rounded"
                >
                    {STRING.RETURN}
                </button>
            </div>
        );
    }

    return (
        <div className="relative h-screen overflow-hidden">
            {/* BACKGROUND CHUNG */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${background})` }}
            />

            {/* Overlay cho dễ đọc */}
            <div className="absolute inset-0 bg-black/40 z-0" />

            {/* CONTENT CHIA 2 NỬA */}
            <div className="relative z-10 h-full flex flex-col">

                <button
                    onClick={() => setIsPaused(true)}
                    className="absolute top-4 right-4 z-50 bg-black px-4 py-2 rounded-lg font-bold hover:scale-105 transition"
                >
                    ⏸
                </button>

                {combo >= 2 && !isPaused && !showFail && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-2xl font-bold text-orange-400 animate-pulse z-40">
                        🔥 {STRING.COMBO} x{combo}
                    </div>
                )}

                {/* 🔼 NỬA TRÊN */}
                <div className="h-1/2 relative">
                    <BattleScene
                        answerResult={answerResult}
                        total={total}
                    />
                </div>

                {/* 🔽 NỬA DƯỚI */}
                <div className="h-1/2 relative">
                    <QuestionCard
                        word={roundWords[index]}
                        onAnswer={handleAnswer}
                        current={index + 1}
                        total={total}
                    />
                </div>

                {isPaused && (
                    <OptionsModal
                        onContinue={() => setIsPaused(false)}
                        onExit={() => router.replace(`/level/${level}`)}
                    />
                )}

                {showFail && (
                    <FailModal
                        onRestart={() => {
                            setIndex(0);
                            setScore(0);
                            setCombo(0);
                            setShowFail(false);
                        }}
                        onExit={() => router.replace(`/level/${level}`)}
                    />
                )}
            </div>
        </div>
    );


}
