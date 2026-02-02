"use client";

import { useState } from "react";
import * as STRING from "@/constant/strings";

export default function QuestionCard({ word, onAnswer, current, total }) {
    const [selected, setSelected] = useState(null);
    const [locked, setLocked] = useState(false);

    function handleClick(option) {
        if (locked) return;

        setSelected(option);
        setLocked(true);

        setTimeout(() => {
            const isCorrect = option === word.correct;
            onAnswer(isCorrect);
            setSelected(null);
            setLocked(false);
        }, 800);
    }

    function getOptionClass(option) {
        if (!locked) {
            return ` bg-primary border-2 border-thirty text-secondary hover:bg-thirty hover:text-forty hover:scale-105 hover:shadow-[0_0_16px_rgba(23,107,135,0.35)]`;
        }

        if (option === word.correct) {
            return ` bg-secondary text-forty scale-105 shadow-[0_0_24px_rgba(4,54,74,0.8)]`;
        }

        if (option === selected && option !== word.correct) {
            return ` bg-thirty text-forty shadow-[0_0_18px_rgba(23,107,135,0.7)] `;
        }

        return ` bg-primary/20 text-secondary/40 opacity-40`;
    }

    return (
        <div className="h-full flex flex-col items-center justify-center px-6 bg-primary/10 rounded-3xl py-10 shadow-inner">
            <div className="text-[#FFF0C4]/70 text-sm mb-4">
                {STRING.QUESTION} {current} / {total}
            </div>

            <div className="mb-6 text-center">
                <h2 className="text-4xl font-bold text-[#FFF0C4] mb-2">
                    {word.jp}
                </h2>
                <p className="text-lg text-[#FFF0C4]/60">
                    {word.romaji}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-5 w-full max-w-md">
                {word.options.map((opt) => (
                    <button
                        key={opt}
                        onClick={() => handleClick(opt)}
                        disabled={locked}
                        className={`  py-4 px-3 rounded-xl font-semibold text-lg shadow-md transition-all duration-300
                            ${locked ? "cursor-not-allowed" : "cursor-pointer active:scale-95 active:cursor-grabbing"}
                            ${getOptionClass(opt)}
                        `}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}
