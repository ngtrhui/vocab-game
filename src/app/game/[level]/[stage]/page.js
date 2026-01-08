"use client";

import { useRouter } from "next/navigation";
import { useState, use, useEffect } from "react";
import { getStageWords } from "@/services/vocabularyService";
import QuestionCard from "@/components/question-card/question-card";
import BattleScene from "@/components/battle/battle-scene";
import OptionsModal from "@/components/options-modal/options-modal";
import * as STRING from "@/constant/strings";
import { BACKGROUNDS } from "@/constant/backgrounds";
import { completeStage, getProgress } from "@/utils/progress";

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
    const MAX_STAGE_PER_LEVEL = 100;
    const LEVEL_ORDER = ["n5", "n4", "n3", "n2", "n1"];
    const total = roundWords.length;
    const isFinished = index >= total;
    const currentIndex = LEVEL_ORDER.indexOf(level);
    const TIME_LIMIT = 10; // giây
    const ATTACK_TIME = 10;
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [bossPhase, setBossPhase] = useState("idle");

    const [answerResult, setAnswerResult] = useState({
        correct: null,
        id: 0,
    });

    const backgrounds = BACKGROUNDS[level] || BACKGROUNDS["n5"] || [];
    const bgIndex = backgrounds.length
        ? (Number(stage) - 1) % backgrounds.length
        : 0;

    const background = backgrounds[bgIndex];

    const onNextStage = () => {
        setModalType(null);

        const currentStage = Number(stage);

        if (currentStage < MAX_STAGE_PER_LEVEL) {
            router.replace(`/game/${level}/${currentStage + 1}`);
            return;
        }

        if (currentIndex !== -1 && currentIndex < LEVEL_ORDER.length - 1) {
            const nextLevel = LEVEL_ORDER[currentIndex + 1];
            router.replace(`/game/${nextLevel}/1`);
            return;
        }

        router.replace(`/level`);
    };

    const onExit = () => {
        setModalType(null);
        router.replace(`/level/${level}`);
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

    const onBackToLevel = () => {
        setModalType(null);
        router.replace(`/level/${level}`);
    };

    useEffect(() => {
        setTimeLeft(TIME_LIMIT);
    }, [index]);

    useEffect(() => {
        const stageNum = Number(stage);

        if (stageNum < 1 || stageNum > MAX_STAGE_PER_LEVEL) {
            router.replace(`/game/${level}/1`);
            return;
        }

        const words = getStageWords(level, stageNum);
        setRoundWords(words);

        setIndex(0);
        setScore(0);
        setCombo(0);
        setHasCompleted(false);
        setModalType(null);
        setAnswerResult({ correct: null, id: 0 });
    }, [level, stage]);

    useEffect(() => {
        setTimeLeft(ATTACK_TIME);
        setBossPhase("idle");
    }, [index]);

    useEffect(() => {
        if (modalType !== null || hasCompleted) return;

        if (timeLeft <= 0) {
            setBossPhase("attacking");
            handleAnswer(false); // ⛔ timeout = sai
            return;
        }

        setBossPhase("approaching");

        const timer = setTimeout(() => {
            setTimeLeft((t) => t - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, modalType, hasCompleted]);

    function handleAnswer(isCorrect) {
        if (modalType !== null || hasCompleted) return;
        if (isCorrect) {
            setBossPhase("retreating");
        } else {
            setBossPhase("attacking");
        }

        setTimeLeft(TIME_LIMIT);
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
            completeStage(level, stage);
            setTimeout(() => {
                setModalType("next");
            }, 800);
        }
    }

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
                <div
                    className={`absolute top-4 left-4 z-50 px-4 py-2 rounded-xl font-bold
    ${timeLeft <= 2 ? "bg-red-600 animate-pulse" : "bg-black/70"}
  `}
                >
                    ⏱ {timeLeft}s
                </div>


                <div className="h-1/2 relative">
                    <BattleScene
                        level={level}
                        answerResult={answerResult}
                        isCompleted={hasCompleted}
                        bossPhase={bossPhase}
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
                                label: STRING.CONTINUE,
                                className: "bg-green-600",
                                onClick: onNextStage,
                            },
                            {
                                label: STRING.OUT,
                                className: "bg-gray-500",
                                onClick: onExit,
                            },
                        ]}
                    />
                )}
            </div>
        </div>
    );
}