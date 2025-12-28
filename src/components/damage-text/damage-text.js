"use client";

export default function DamageText({ value }) {
    if (!value) return null;

    return (
        <div className="absolute right-1/2 bottom-40 text-red-500 font-bold text-xl animate-damage">
            -{value}
        </div>
    );
}
