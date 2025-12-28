"use client";

import { useState } from "react";

export default function QuestionCard({
    word,
    onAnswer,
    current,
    total,
}) {
    const [selected, setSelected] = useState(null);
    const [locked, setLocked] = useState(false);

    function handleClick(option) {
        if (locked) return;

        setSelected(option);
        setLocked(true);

        // ⏱ cho người chơi thấy màu đúng / sai
        setTimeout(() => {
            const isCorrect = option === word.correct;
            onAnswer(isCorrect);
            setSelected(null);
            setLocked(false);
        }, 800);
    }

    function getOptionClass(option) {
        if (!locked) {
            return "bg-indigo-700 hover:scale-105";
        }

        if (option === word.correct) {
            return "bg-green-500 text-white scale-105";
        }

        if (option === selected && option !== word.correct) {
            return "bg-red-500 text-white";
        }

        return "bg-white/60 opacity-50";
    }

    return (
        <div className="h-full bg-[#2b124c] flex flex-col items-center justify-center px-6">

            {/* ================= PROGRESS ================= */}
            <div className="text-white text-sm mb-4 opacity-80">
                {current} / {total} từ
            </div>

            {/* ================= WORD ================= */}
            <div className="mb-6 text-center">
                <h2 className="text-4xl font-bold text-white mb-2">
                    {word.jp}
                </h2>
                <p className="text-lg text-white/70">
                    {word.romaji}
                </p>
            </div>

            {/* ================= OPTIONS ================= */}
            <div className="grid grid-cols-2 gap-5 w-full max-w-md">
                {word.options.map((opt) => (
                    <button
                        key={opt}
                        onClick={() => handleClick(opt)}
                        disabled={locked}
                        className={`py-4 px-3 rounded-xl font-semibold  text-lg shadow-md transition-all duration-300 active:scale-95 ${getOptionClass(opt)}`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}
