import Link from "next/link";

export default function LevelCard({ level, locked, color, skeleton }) {
    return (
        <Link
            href={locked ? "#" : `/level/${level}`}
            aria-disabled={locked}
            className={`block ${locked ? "pointer-events-none" : ""}`}
        >
            <div
                className={`border p-6 text-center rounded-xl text-white transition
                ${color}
                ${locked ? "opacity-40 cursor-not-allowed" : "hover:scale-105"}`}
            >
                {skeleton ? (
                    "..."
                ) : (
                    <>
                        {locked && "🔒 "}
                        {level.toUpperCase()}
                    </>
                )}
            </div>
        </Link>
    );
}