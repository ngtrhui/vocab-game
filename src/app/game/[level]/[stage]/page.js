"use client";

import { useRouter } from "next/navigation";
import { useState, use, useEffect } from "react";

import QuestionCard from "@/components/question-card/question-card";
import BattleScene from "@/components/battle/battle-scene";
import GameHUD from "@/components/gameHUD/GameHUD";
import GameModals from "@/components/game-modals/game-modals";

import { BACKGROUNDS } from "@/constant/backgrounds";
import { playBGM, stopBGM, playSFX } from "@/utils/sound";

import useStageLoader from "@/hooks/useStageLoader";
import useGameProgress from "@/hooks/useGameProgress";
import useBossPhaseController from "@/hooks/useBossPhaseController";

export default function GamePage({ params }) {
    const { level, stage } = use(params);
    const router = useRouter();

    const MAX_STAGE_PER_LEVEL = 100;
    const LEVEL_ORDER = ["n5", "n4", "n3", "n2", "n1"];
    const TIME_LIMIT = 10;
    const ATTACK_TIME = 10;

    const [modalType, setModalType] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const currentIndex = LEVEL_ORDER.indexOf(level);

    // 🎯 Load words
    const roundWords = useStageLoader(level, stage);
    const total = roundWords.length;

    // 🎯 Game progress
    const {
        index,
        score,
        combo,
        hasCompleted,
        handleCorrect,
        handleWrong,
        reset,
    } = useGameProgress(level, stage, total);

    // 🎯 Boss phase + timer
    const {
        timeLeft,
        setTimeLeft,
        bossPhase,
        setBossPhase,
        waitingBossAttack,
        setWaitingBossAttack,
        triggerFail,
    } = useBossPhaseController({
        TIME_LIMIT,
        modalType,
        hasCompleted,
        isPaused,
    });

    const [answerResult, setAnswerResult] = useState({
        correct: null,
        id: 0,
    });

    // 🎵 BGM
    useEffect(() => {
        playBGM("/sounds/bgm/gameplay.mp3", 0.25);
        return () => stopBGM();
    }, []);

    const onBossDead = () => {
        playSFX("/sounds/sfx/win.mp3", 0.8);
        setModalType("next");
    };

    // Reset khi đổi level/stage (logic cũ giữ nguyên)
    useEffect(() => {
        const stageNum = Number(stage);

        if (stageNum < 1 || stageNum > MAX_STAGE_PER_LEVEL) {
            router.replace(`/game/${level}/1`);
            return;
        }

        reset();
        setAnswerResult({ correct: null, id: 0 });
        setTimeLeft(TIME_LIMIT);
        setBossPhase("idle");
        setIsPaused(false);
        setWaitingBossAttack(false);
        setModalType(null);
    }, [level, stage]);

    // Reset timer khi câu hỏi đổi
    useEffect(() => {
        setTimeLeft(TIME_LIMIT);
    }, [index]);

    // 🎮 Actions
    const actions = {
        pause() {
            stopBGM();
            setIsPaused(true);
            setModalType("pause");
        },

        continue() {
            playBGM("/sounds/bgm/gameplay.mp3", 0.25);
            setIsPaused(false);
            setModalType(null);
        },

        restart() {
            playBGM("/sounds/bgm/gameplay.mp3", 0.25);
            reset();
            setTimeLeft(TIME_LIMIT);
            setBossPhase("idle");
            setIsPaused(false);
            setModalType(null);
        },

        exit() {
            stopBGM();
            router.replace(`/level/${level}`);
        },
    };

    // 👉 Xử lý trả lời
    function handleAnswer(isCorrect) {
        if (modalType !== null || hasCompleted) return;

        setAnswerResult((prev) => ({
            correct: isCorrect,
            id: prev.id + 1,
        }));

        if (!isCorrect) {
            playSFX("/sounds/sfx/wrong.mp3", 0.7);
            handleWrong();
            triggerFail();
            return;
        }

        playSFX("/sounds/sfx/correct.mp3", 0.6);
        handleCorrect();

        // if (index + 1 === total) {
        //     setTimeout(() => {
        //         playSFX("/sounds/sfx/win.mp3", 0.8);
        //         setModalType("next");
        //     }, 300);
        // }
    }

    // 👉 Sau khi boss đánh xong
    const onBossAttackComplete = () => {
        setBossPhase("approaching");
    };

    // 👉 Hero chết xong
    const onHeroDyingComplete = () => {
        if (waitingBossAttack) {
            setModalType("fail");
            setWaitingBossAttack(false);
        }
    };

    const backgrounds = BACKGROUNDS[level] || BACKGROUNDS["n5"] || [];
    const bgIndex = backgrounds.length
        ? (Number(stage) - 1) % backgrounds.length
        : 0;
    const background = backgrounds[bgIndex];

    return (
        <div className="relative h-screen overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${background})` }}
            />
            <div className="absolute inset-0 bg-black/60 z-0" />

            <div className="relative z-10 h-full flex flex-col">
                <GameHUD
                    timeLeft={timeLeft}
                    combo={combo}
                    onPause={actions.pause}
                />

                <div className="h-1/2 relative">
                    <BattleScene
                        level={level}
                        answerResult={answerResult}
                        bossPhase={bossPhase}
                        attackTime={ATTACK_TIME}
                        isPaused={isPaused}
                        onBossDead={onBossDead} 
                        onBossAttackComplete={onBossAttackComplete}
                        onHeroDyingComplete={onHeroDyingComplete}
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

                <GameModals
                    type={modalType}
                    onContinue={actions.continue}
                    onRestart={actions.restart}
                    onExit={actions.exit}
                />
            </div>
        </div>
    );
}
