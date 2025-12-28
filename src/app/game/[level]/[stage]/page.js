"use client";

import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { getStageData } from "@/services/vocabularyService";

import QuestionCard from "@/components/question-card/question-card";
import BattleScene from "@/components/battle/battle-scene";
import OptionsModal from "@/components/options-modal/options-modal";
import FailModal from "@/components/fail-modal/fail-modal";

export default function GamePage({ params }) {
    const { level, stage } = use(params);
    const stageData = getStageData(level, stage);

    const router = useRouter();

    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);

    const [showFail, setShowFail] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const [answerResult, setAnswerResult] = useState({
        correct: null,
        id: 0
    });

    const total = stageData.words.length;
    const isFinished = index >= total;

    function handleAnswer(isCorrect) {
        setAnswerResult(prev => ({
            correct: isCorrect,
            id: prev.id + 1
        }));

        if (!isCorrect) {
            setCombo(0);
            setShowFail(true);
            return;
        }

        setCombo(prev => prev + 1);
        setScore(prev => prev + 1);
        setIndex(prev => prev + 1);
    }

    if (isFinished) {
        localStorage.setItem(`${level}-stage-${stage}`, "completed");

        return (
            <div className="p-6 text-center">
                <h2 className="text-2xl font-bold mb-2">
                    🎉 HOÀN THÀNH!
                </h2>

                <p className="mb-4">
                    Điểm: {score}/{total}
                </p>

                <button
                    className="px-6 py-3 bg-green-600 text-white rounded"
                    onClick={() => router.push(`/level/${level}`)}
                >
                    👉 Quay lại chọn bài
                </button>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col relative">

            {/* ⏸ PAUSE BUTTON */}
            <button
                onClick={() => setShowOptions(true)}
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center text-xl"
            >
                ⏸
            </button>

            {/* 🔥 COMBO */}
            {combo >= 2 && (
                <div className="
                    absolute top-4 left-1/2 -translate-x-1/2
                    text-2xl font-bold text-orange-400
                    animate-pulse z-50
                ">
                    🔥 COMBO x{combo}
                </div>
            )}

            {/* ⚔️ BATTLE */}
            <div className="h-1/2 bg-slate-900 relative">
                <BattleScene
                    answerResult={answerResult}
                    current={score}
                    total={total}
                    combo={combo}
                />
            </div>

            {/* ❓ QUESTION */}
            <div className="h-1/2 overflow-y-auto">
                <QuestionCard
                    word={stageData.words[index]}
                    onAnswer={handleAnswer}
                    current={index + 1}
                    total={total}
                />
            </div>

            {/* ❌ FAIL MODAL */}
            {showFail && (
                <FailModal
                    onRestart={() => {
                        setIndex(0);
                        setScore(0);
                        setCombo(0);
                        setShowFail(false);
                    }}
                    onExit={() => router.push(`/level/${level}`)}
                />
            )}

            {/* ⏸ OPTIONS MODAL */}
            {showOptions && (
                <OptionsModal
                    onContinue={() => setShowOptions(false)}
                    onExit={() => router.push(`/level/${level}`)}
                />
            )}
        </div>
    );
}
