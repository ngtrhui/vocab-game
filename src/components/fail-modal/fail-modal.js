"use client";
import * as STRING from "@/constant/strings";

export default function FailModal({ onRestart, onExit }) {
    return (
        <div
            onClick={onRestart}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-6 rounded-xl text-center w-80 animate-scaleIn"
            >
                <h2 className="text-xl font-bold mb-4 text-red-600">
                    ❌ {STRING.INCORRECT_ANSWER}
                </h2>

                <p className="mb-6">
                    {STRING.WHAT_DO_YOU_WANT_TO_DO_NEXT}
                </p>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onRestart}
                        className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    >
                        🔁 {STRING.START_AGAIN}
                    </button>

                    <button
                        onClick={onExit}
                        className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    >
                        🚪 {STRING.OUT}
                    </button>
                </div>
            </div>
        </div>
    );
}
