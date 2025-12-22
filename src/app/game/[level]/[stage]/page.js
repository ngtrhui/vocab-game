"use client";


import { use, useState } from "react";
import { getStageData } from "@/services/vocabularyService";
import QuestionCard from "@/components/question-card/question-card";

export default function GamePage({ params }) {
    const { level, stage } = use(params);
    const stageData = getStageData(level, stage);

    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);

    const word = stageData.words[index];

    function handleAnswer(option) {
        if (option === word.correct) {
            setScore(score + 1);
        }
        setIndex(index + 1);
    }

    if (index >= stageData.words.length) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-bold">Hoàn thành 🎉</h2>
                <p>Điểm: {score}/{stageData.words.length}</p>
            </div>
        );
    }

    return (
        <QuestionCard
            word={word}
            onAnswer={handleAnswer}
            current={index + 1}
            total={stageData.words.length}
        />
    );
}
