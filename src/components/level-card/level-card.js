import Link from "next/link";

export default function LevelCard({ level, locked, color }) {
    if (locked) {
        return (
            <div
                className={`border p-6 text-center rounded-xl ${color} opacity-40`}
            >
                {level.toUpperCase()} 🔒
            </div>
        );
    }

    return (
        <Link href={`/level/${level}`} className="block">
            <div
                className={`border p-6 text-center rounded-xl cursor-pointer text-white ${color}
                hover:scale-105 transition`}
            >
                {level.toUpperCase()}
            </div>
        </Link>
    );
}
