"use client";

import { useRouter } from "next/navigation";
import { useState, use, useEffect } from "react";
import { getStageWords } from "@/services/vocabularyService";
import QuestionCard from "@/components/question-card/question-card";
import BattleScene from "@/components/battle/battle-scene";
import OptionsModal from "@/components/options-modal/options-modal";
import * as STRING from "@/constant/strings";
import { BACKGROUNDS } from "@/constant/backgrounds";

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
    const [modalType, setModalType] = useState(null);

    const [answerResult, setAnswerResult] = useState({
        correct: null,
        id: 0,
    });

    const backgrounds = BACKGROUNDS[level] ?? [];
    const bgIndex = (Number(stage) - 1) % backgrounds.length;
    const background = backgrounds[bgIndex];

    const onNextStage = () => {
        setModalType(null);

        const nextStage = Number(stage) + 1;
        router.replace(`/game/${level}/${nextStage}`);
    };


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
        setIndex(0);
        setScore(0);
        setCombo(0);
        setShowFail(false);
        setHasCompleted(false);
        setModalType(null);
        setAnswerResult({ correct: null, id: 0 });
    }, [level, stage]);

    const total = roundWords.length;
    const isFinished = index >= total;

    function handleAnswer(isCorrect) {
        if (modalType !== null || hasCompleted) return;

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

        if (nextIndex === total) {
            setHasCompleted(true);
            setTimeout(() => {
                setModalType("next");
            }, 800);
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
                        level={level}
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
                        title={`⏸ ${STRING.PAUSE}`}
                        description={STRING.WHAT_DO_YOU_WANT_TO_DO_NEXT}
                        onOverlayClick={onContinue}
                        options={[
                            {
                                label: STRING.CONTINUE,
                                className: "bg-green-600",
                                onClick: onContinue,
                            },
                            {
                                label: STRING.OUT,
                                className: "bg-red-500",
                                onClick: onExit,
                            },
                        ]}
                    />
                )}

                {modalType === "fail" && (
                    <OptionsModal
                        title={`${STRING.INCORRECT_ANSWER}`}
                        description={STRING.WHAT_DO_YOU_WANT_TO_DO_NEXT}
                        onOverlayClick={onRestart}
                        options={[
                            {
                                label: STRING.START_AGAIN,
                                className: "bg-yellow-500",
                                onClick: onRestart,
                            },
                            {
                                label: STRING.OUT,
                                className: "bg-red-500",
                                onClick: onExit,
                            },
                        ]}
                    />
                )}

                {modalType === "next" && (
                    <OptionsModal
                        title={`${STRING.COMPLETE}`}
                        description={STRING.WHAT_DO_YOU_WANT_TO_DO_NEXT}
                        onOverlayClick={onBackToLevel}
                        options={[
                            {
                                label: "STRING.CONTINUE",
                                className: "bg-green-600",
                                onClick: onNextStage,
                            },
                            {
                                label: "STRING.OUT",
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