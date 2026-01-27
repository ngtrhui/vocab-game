export default function GameHUD({ timeLeft, combo, onPause }) {
    return (
        <>
            <button
                onClick={onPause}
                className="absolute top-4 right-4 z-50 bg-[#2A0E0A] text-[#FFF0C4] px-4 py-2 rounded-xl font-bold"
            >
                ⏸
            </button>

            <div className="absolute top-4 left-4 z-50 px-4 py-2 rounded-xl font-bold bg-[#1A0E05] text-[#FFF0C4]/80">
                ⏱ {timeLeft}s
            </div>

            {combo >= 2 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-2xl font-bold text-[#FFB703] animate-pulse z-40">
                    🔥 COMBO x{combo}
                </div>
            )}
        </>
    );
}
