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
        // CHƯA LOCK
        if (!locked) {
            return `
                bg-[#2A0E0A]
                border border-[#660B05]
                text-[#FFF0C4]
                hover:bg-[#3E0703]
                hover:scale-105
                hover:shadow-[0_0_12px_rgba(255,183,3,0.25)]
            `;
        }

        // ĐÚNG
        if (option === word.correct) {
            return `
                bg-[#FFB703]
                text-[#1A0E05]
                scale-105
                shadow-[0_0_22px_rgba(255,183,3,0.8)]
            `;
        }

        // SAI (đã chọn)
        if (option === selected && option !== word.correct) {
            return `
                bg-[#8C1007]
                text-[#FFF0C4]
                shadow-[0_0_15px_rgba(140,16,7,0.8)]
            `;
        }

        // CÁC OPTION CÒN LẠI
        return `
            bg-black/40
            text-[#FFF0C4]/40
            opacity-40
        `;
    }

    return (
        <div className="h-full flex flex-col items-center justify-center px-6">
            {/* Progress */}
            <div className="text-[#FFF0C4]/70 text-sm mb-4">
                {STRING.QUESTION} {current} / {total}
            </div>

            {/* Question */}
            <div className="mb-6 text-center">
                <h2 className="text-4xl font-bold text-[#FFF0C4] mb-2">
                    {word.jp}
                </h2>
                <p className="text-lg text-[#FFF0C4]/60">
                    {word.romaji}
                </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-5 w-full max-w-md">
                {word.options.map((opt) => (
                    <button
                        key={opt}
                        onClick={() => handleClick(opt)}
                        disabled={locked}
                        className={`
                            py-4 px-3 rounded-xl
                            font-semibold text-lg
                            shadow-md
                            transition-all duration-300
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
