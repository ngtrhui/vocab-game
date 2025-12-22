"use client";

import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { getStageData } from "@/services/vocabularyService";
import QuestionCard from "@/components/question-card/question-card";

export default function GamePage({ params }) {
    const { level, stage } = use(params);
    const stageData = getStageData(level, stage);

    const router = useRouter();

    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showFail, setShowFail] = useState(false);

    const total = stageData.words.length;
    const isFinished = index >= total;

    // 🧠 Nhận kết quả từ QuestionCard
    function handleAnswer(isCorrect) {
        if (!isCorrect) {
            // ❌ Sai → hiện popup
            setShowFail(true);
            return;
        }

        // ✅ Đúng → tiếp tục
        setScore((prev) => prev + 1);
        setIndex((prev) => prev + 1);
    }

    // 🎉 Hoàn thành bài (chỉ có thể là PERFECT)
    if (isFinished) {
        // lưu progress mở stage tiếp theo
        localStorage.setItem(`${level}-stage-${stage}`, "completed");

        return (
            <div className="p-6 text-center">
                <h2 className="text-2xl font-bold mb-2">
                    🎉 HOÀN HẢO!
                </h2>

                <p className="mb-4">
                    Điểm: {score}/{total}
                </p>

                <button
                    className="px-6 py-3 bg-green-600 text-white rounded"
                    onClick={() => router.push(`/game/${level}`)}
                >
                    👉 Quay lại chọn bài
                </button>
            </div>
        );
    }

    return (
        <>
            {/* ❌ Popup khi trả lời sai */}
            {showFail && (
                <FailModal
                    onRestart={() => {
                        setIndex(0);
                        setScore(0);
                        setShowFail(false);
                    }}
                    onExit={() => {
                        router.push(`/level/${level}`);
                    }}
                />
            )}

            {/* 🎮 Câu hỏi */}
            <QuestionCard
                word={stageData.words[index]}
                onAnswer={handleAnswer}
                current={index + 1}
                total={total}
            />
        </>
    );
}

/* ===============================
   ❌ POPUP THẤT BẠI
================================ */
function FailModal({ onRestart, onExit }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded text-center w-80 animate-scaleIn">
                <h2 className="text-xl font-bold mb-4 text-red-600">
                    ❌ Trả lời sai!
                </h2>

                <p className="mb-6">
                    Bạn muốn làm gì tiếp?
                </p>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onRestart}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        🔁 Bắt đầu lại
                    </button>

                    <button
                        onClick={onExit}
                        className="px-4 py-2 bg-gray-500 text-white rounded"
                    >
                        🚪 Thoát
                    </button>
                </div>
            </div>
        </div>
    );
}
