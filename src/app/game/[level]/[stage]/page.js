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

    const [answerResult, setAnswerResult] = useState({
        correct: null,
        id: 0,
    });

    // Load 20 từ của stage (giữ cố định)
    useEffect(() => {
        const words = getStageWords(level); // random 20 từ
        setRoundWords(words);

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
            setShowFail(true); // hiện FailModal
            return;
        }

        if (index + 1 === total) {
            setHasCompleted(true); // đánh dấu hoàn thành stage
        }

        setCombo((c) => c + 1);
        setScore((s) => s + 1);
        setIndex((i) => i + 1);
    }

    // Nếu hoàn thành stage
    if (isFinished || hasCompleted) {
        completeStage(level, stage);

        return (
            <div className="p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">{STRING.COMPLETE}</h2>
                <p className="mb-4">{STRING.POINT}: {score}/{total}</p>

                <button
                    onClick={() => router.replace(`/level/${level}`)} // replace để back tuần tự
                    className="px-6 py-3 bg-green-600 text-white rounded"
                >
                    {STRING.RETURN}
                </button>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col relative">
            {/* Nút Pause */}
            <button
                onClick={() => setIsPaused(true)}
                className="absolute top-4 right-4 z-50 bg-white/90 px-4 py-2 rounded-lg font-bold hover:scale-105 transition"
            >
                ⏸
            </button>

            {/* COMBO */}
            {combo >= 2 && !isPaused && !showFail && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-2xl font-bold text-orange-400 animate-pulse z-40">
                    🔥 {STRING.COMBO} x{combo}
                </div>
            )}

            {/* BATTLE */}
            <div className="h-1/2 relative bg-slate-900">
                <BattleScene answerResult={answerResult} total={total} />
            </div>

            {/* QUESTION */}
            <div className="h-1/2">
                <QuestionCard
                    word={roundWords[index]}
                    onAnswer={handleAnswer}
                    current={index + 1}
                    total={total}
                />
            </div>

            {/* OPTIONS MODAL (Pause) */}
            {isPaused && (
                <OptionsModal
                    onContinue={() => setIsPaused(false)}
                    onExit={() => router.replace(`/level/${level}`)}
                />
            )}

            {/* FAIL MODAL */}
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
    );
}
