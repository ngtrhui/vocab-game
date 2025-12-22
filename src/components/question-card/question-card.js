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

        // chờ 0.8s cho người chơi thấy màu
        setTimeout(() => {
            onAnswer(option);
            setSelected(null);
            setLocked(false);
        }, 800);
    }

    function getOptionClass(option) {
        if (!locked) return "border";

        if (option === word.correct) {
            return "bg-green-500 text-white";
        }

        if (option === selected && option !== word.correct) {
            return "bg-red-500 text-white";
        }

        return "border opacity-50";
    }

    return (
        <div className="p-6">
            {/* 🔢 Câu số */}
            <p className="text-sm text-black mb-2">
                Câu {current} / {total}
            </p>
            <div className="justify-items-center">
                <h2 className="text-2xl text-black font-bold mb-4">
                    {word.jp}
                </h2>

                <h2 className="text-2xl text-black font-bold mb-4">
                    {word.romaji}
                </h2>
            </div>
            <div className="grid grid-cols-2 text-black gap-3">
                {word.options.map((opt) => (
                    <button
                        key={opt}
                        onClick={() => handleClick(opt)}
                        disabled={locked}
                        className={`p-3 rounded cursor-pointer transition-transform duration-300 hover:scale-105 transition-all ${getOptionClass(opt)}`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}
