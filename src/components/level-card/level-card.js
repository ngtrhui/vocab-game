import Link from "next/link";

export default function LevelCard({ level, locked, color }) {
    return (
        <Link
            href={locked ? "#" : `/level/${level}`}
            className={`block ${locked ? "pointer-events-none" : ""}`}
            aria-disabled={locked}
        >
            <div
                className={`border p-6 text-center rounded-xl text-white transition
                ${color}
                ${locked ? "opacity-40 cursor-not-allowed" : "hover:scale-105"}`}
            >
                {level.toUpperCase()} {locked && "🔒"}
            </div>
        </Link>
    );
}
