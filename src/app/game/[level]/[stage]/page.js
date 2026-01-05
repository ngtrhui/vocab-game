"use client";

import { useRouter } from "next/navigation";
import { useState, use, useEffect } from "react";
import { getStageWords } from "@/services/vocabularyService";
import QuestionCard from "@/components/question-card/question-card";
import BattleScene from "@/components/battle/battle-scene";
import OptionsModal from "@/components/options-modal/options-modal";
import * as STRING from "@/constant/strings";
import { getRandomBackground } from "@/utils/getRandomBackground";

export default function GamePage({ params }) {
    const { level, stage } = use(params);
    const router = useRouter();
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

    const [modalType, setModalType] = useState(null);

    const onNextStage = () => {
        setModalType(null);

        const nextStage = Number(stage) + 1;
        router.replace(`/game/${level}/${nextStage}`);
    };

    useEffect(() => {
        const bg = getRandomBackground(level);
        console.log("BG:", bg);
        setBackground(bg);
    }, [level, stage]);

    const onRestart = () => {
        setIndex(0);
        setScore(0);
        setCombo(0);
        setAnswerResult({ correct: null, id: 0 });
        setModalType(null);
    };

    const onContinue = () => {
        setModalType(null);
    };

    const onExit = () => {
        setModalType(null);
        router.replace(`/level/${level}`);
    };

    useEffect(() => {
        const words = getStageWords(level);
        setRoundWords(words);
        const bg = getRandomBackground(level);
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
        if (modalType !== null) return;
        if (hasCompleted) return;

        setAnswerResult((prev) => ({
            correct: isCorrect,
            id: prev.id + 1,
        }));

        if (!isCorrect) {
            setCombo(0);
            setModalType("fail");
            return;
        }

        const nextIndex = index + 1;

        setCombo((c) => c + 1);
        setScore((s) => s + 1);
        setIndex(nextIndex);

        // ✅ HOÀN THÀNH 20 CÂU
        if (nextIndex === total) {
            setHasCompleted(true);

            // ⏱ đợi animation boss chết rồi mới hiện modal
            setTimeout(() => {
                setModalType("next");
            }, 800); // chỉnh theo animation
        }
    }

    const onBackToLevel = () => {
        setModalType(null);
        router.replace(`/level/${level}`);
    };

    return (
        <div className="relative h-screen overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${background})` }}
            />
            <div className="absolute inset-0 bg-black/40 z-0" />
            <div className="relative z-10 h-full flex flex-col">

                <button
                    onClick={() => setModalType("pause")}
                    className="absolute top-4 right-4 z-50 bg-black px-4 py-2 rounded-lg font-bold"
                >
                    ⏸
                </button>

                {combo >= 2 && !isPaused && !showFail && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-2xl font-bold text-orange-400 animate-pulse z-40">
                        🔥 {STRING.COMBO} x{combo}
                    </div>
                )}

                <div className="h-1/2 relative">
                    <BattleScene
                        answerResult={answerResult}
                        isCompleted={hasCompleted}
                    />

                </div>

                {roundWords[index] && (
                    <div className="h-1/2 relative">
                        <QuestionCard
                            word={roundWords[index]}
                            onAnswer={handleAnswer}
                            current={index + 1}
                            total={total}
                        />
                    </div>
                )}

                {modalType === "pause" && (
                    <OptionsModal
                        title="⏸ Tạm dừng"
                        description="Bạn muốn làm gì?"
                        onOverlayClick={onContinue}
                        options={[
                            {
                                label: "Tiếp tục",
                                className: "bg-green-600",
                                onClick: onContinue,
                            },
                            {
                                label: "Thoát",
                                className: "bg-red-500",
                                onClick: onExit,
                            },
                        ]}
                    />
                )}

                {modalType === "fail" && (
                    <OptionsModal
                        title="❌ Sai rồi!"
                        description="Bạn muốn làm gì tiếp theo?"
                        onOverlayClick={onRestart}
                        options={[
                            {
                                label: "Chơi lại",
                                className: "bg-yellow-500",
                                onClick: onRestart,
                            },
                            {
                                label: "Thoát",
                                className: "bg-red-500",
                                onClick: onExit,
                            },
                        ]}
                    />
                )}

                {modalType === "next" && (
                    <OptionsModal
                        title="🎉 Xuất sắc!"
                        description="Bạn đã trả lời đúng 20 câu 🎯"
                        onOverlayClick={onBackToLevel}
                        options={[
                            {
                                label: "Màn tiếp theo",
                                className: "bg-green-600",
                                onClick: onNextStage,
                            },
                            {
                                label: "Quay về",
                                className: "bg-gray-500",
                                onClick: onBackToLevel,
                            },
                        ]}
                    />
                )}
            </div>
        </div>
    );
}