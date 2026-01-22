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

    const [waitingBossAttack, setWaitingBossAttack] = useState(false);
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

    const TIME_LIMIT = 10;
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

    const handleFail = () => {
        setWaitingBossAttack(true);
        setBossPhase("attacking");
    };

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

        setTimeLeft(TIME_LIMIT);
        setBossPhase("idle");
        setWaitingBossAttack(false);
        setHasCompleted(false);
        setIsPaused(false);
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

        setTimeLeft(TIME_LIMIT);
        setBossPhase("idle");
        setIsPaused(false);
        setWaitingBossAttack(false);
    }, [level, stage]);

    const triggerFail = () => {
        setWaitingBossAttack(true);
        setBossPhase("attacking");
        setIsPaused(true);
    };

    useEffect(() => {
        setBossPhase("approaching");
        setIsPaused(false);
    }, [index]);

    useEffect(() => {
        if (
            modalType !== null ||
            hasCompleted ||
            isPaused ||
            bossPhase === "attacking"
        ) {
            return;
        }

        if (timeLeft <= 0) {
            triggerFail();
            return;
        }

        setBossPhase("approaching");

        const timer = setTimeout(() => {
            setTimeLeft((t) => t - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, modalType, hasCompleted, isPaused, bossPhase]);

    function handleAnswer(isCorrect) {
        if (modalType !== null || hasCompleted) return;

        setAnswerResult((prev) => ({
            correct: isCorrect,
            id: prev.id + 1,
        }));

        if (!isCorrect) {
            setCombo(0);
            triggerFail();
            return;
        }

        setBossPhase("retreating");

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
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${background})` }}
            />
            <div className="absolute inset-0 bg-black/60 z-0" />

            <div className="relative z-10 h-full flex flex-col">
                {/* Pause button */}
                <button
                    onClick={() => setModalType("pause")}
                    className="
                        absolute top-4 right-4 z-50
                        bg-[#2A0E0A]
                        text-[#FFF0C4]
                        px-4 py-2
                        rounded-xl font-bold
                        shadow-[0_0_12px_rgba(255,183,3,0.25)]
                        hover:bg-[#3E0703]
                    "
                >
                    ⏸
                </button>

                {/* Combo */}
                {combo >= 2 && !isPaused && !showFail && (
                    <div className="
                        absolute top-4 left-1/2 -translate-x-1/2
                        text-2xl font-bold
                        text-[#FFB703]
                        animate-pulse
                        z-40
                        drop-shadow-[0_0_10px_rgba(255,183,3,0.8)]
                    ">
                        🔥 {STRING.COMBO} x{combo}
                    </div>
                )}

                {/* Timer */}
                <div
                    className={`
                        absolute top-4 left-4 z-50
                        px-4 py-2 rounded-xl font-bold
                        ${timeLeft <= 2
                            ? "bg-[#8C1007] animate-pulse text-[#FFF0C4]"
                            : "bg-[#1A0E05] text-[#FFF0C4]/80"}
                    `}
                >
                    ⏱ {timeLeft}s
                </div>

                {/* Battle */}
                <div className="h-1/2 relative">
                    <BattleScene
                        level={level}
                        answerResult={answerResult}
                        isCompleted={hasCompleted}
                        bossPhase={bossPhase}
                        timeLeft={timeLeft}
                        attackTime={ATTACK_TIME}
                        onHeroDyingComplete={() => {
                            if (waitingBossAttack) {
                                setModalType("fail");
                                setWaitingBossAttack(false);
                            }
                        }}
                    />
                </div>

                {/* Question */}
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

                {/* MODALS */}
                {modalType === "pause" && (
                    <OptionsModal
                        title={`⏸ ${STRING.PAUSE}`}
                        description={STRING.WHAT_DO_YOU_WANT_TO_DO_NEXT}
                        onOverlayClick={onContinue}
                        options={[
                            {
                                label: STRING.CONTINUE,
                                className: "bg-[#FFB703] text-black",
                                onClick: onContinue,
                            },
                            {
                                label: STRING.OUT,
                                className: "bg-[#8C1007] text-[#FFF0C4]",
                                onClick: onExit,
                            },
                        ]}
                    />
                )}

                {modalType === "fail" && (
                    <OptionsModal
                        title={STRING.INCORRECT_ANSWER}
                        description={STRING.WHAT_DO_YOU_WANT_TO_DO_NEXT}
                        onOverlayClick={onRestart}
                        options={[
                            {
                                label: STRING.START_AGAIN,
                                className: "bg-[#3E0703] text-[#FFF0C4]",
                                onClick: onRestart,
                            },
                            {
                                label: STRING.OUT,
                                className: "bg-[#8C1007] text-[#FFF0C4]",
                                onClick: onExit,
                            },
                        ]}
                    />
                )}

                {modalType === "next" && (
                    <OptionsModal
                        title={STRING.COMPLETE}
                        description={STRING.WHAT_DO_YOU_WANT_TO_DO_NEXT}
                        onOverlayClick={onBackToLevel}
                        options={[
                            {
                                label: STRING.CONTINUE,
                                className: "bg-[#FFB703] text-black",
                                onClick: onNextStage,
                            },
                            {
                                label: STRING.OUT,
                                className: "bg-[#2A0E0A] text-[#FFF0C4]",
                                onClick: onExit,
                            },
                        ]}
                    />
                )}
            </div>
        </div>
    );
}
