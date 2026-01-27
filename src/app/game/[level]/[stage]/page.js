"use client";

import { useRouter } from "next/navigation";
import { useState, use, useEffect } from "react";
import { getStageWords } from "@/services/vocabularyService";
import QuestionCard from "@/components/question-card/question-card";
import BattleScene from "@/components/battle/battle-scene";
import * as STRING from "@/constant/strings";
import { BACKGROUNDS } from "@/constant/backgrounds";
import { completeStage} from "@/utils/progress";
import { playBGM, stopBGM, playSFX } from "@/utils/sound";
import GameHUD from "@/components/gameHUD/GameHUD";
import GameModals from "@/components/game-modals/game-modals";

export default function GamePage({ params }) {
    const { level, stage } = use(params);
    const router = useRouter();
    const [waitingBossAttack, setWaitingBossAttack] = useState(false);
    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [roundWords, setRoundWords] = useState([]);
    const [isPaused, setIsPaused] = useState(false);
    const [hasCompleted, setHasCompleted] = useState(false);
    const [modalType, setModalType] = useState(null);
    const MAX_STAGE_PER_LEVEL = 100;
    const LEVEL_ORDER = ["n5", "n4", "n3", "n2", "n1"];
    const total = roundWords.length;
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

    useEffect(() => {
        playBGM("/sounds/bgm/gameplay.mp3", 0.25);
        return () => stopBGM();
    }, []);

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
            setIndex(0);
            setScore(0);
            setCombo(0);
            setTimeLeft(TIME_LIMIT);
            setBossPhase("idle");
            setIsPaused(false);
            setHasCompleted(false);
            setModalType(null);
        },

        exit() {
            stopBGM();
            setIsPaused(false);
            setModalType(null);
            router.replace(`/level/${level}`);
        },
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
        playSFX("/sounds/sfx/wrong.mp3", 0.7);

        setWaitingBossAttack(true);
        setBossPhase("attacking");
        setIsPaused(true);
    };

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
            playSFX("/sounds/sfx/wrong.mp3", 0.7);

            setCombo(0);
            triggerFail();
            return;
        }

        playSFX("/sounds/sfx/correct.mp3", 0.6);

        setBossPhase("retreating");

        const nextIndex = index + 1;
        setCombo((c) => c + 1);
        setScore((s) => s + 1);
        setIndex(nextIndex);

        if (nextIndex === total) {
            setHasCompleted(true);
            completeStage(level, stage);

            setTimeout(() => {
                playSFX("/sounds/sfx/win.mp3", 0.8);
                setModalType("next");
            }, 300);
        }
    }

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
                        isCompleted={hasCompleted}
                        bossPhase={bossPhase}
                        timeLeft={timeLeft}
                        attackTime={ATTACK_TIME}
                        isPaused={isPaused}
                        onBossAttackComplete={() => {
                            setBossPhase("approaching");
                        }}
                        onHeroDyingComplete={() => {
                            if (waitingBossAttack) {
                                setModalType("fail");
                                setWaitingBossAttack(false);
                            }
                        }}
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
                    onNext={onNextStage}
                />

            </div>
        </div>
    )
}