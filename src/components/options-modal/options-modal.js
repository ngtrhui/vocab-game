"use client";
const BUTTON_VARIANTS = {
    primary: `
        bg-[#7A1E1E]
        hover:bg-[#9B3922]
        shadow-[0_0_12px_rgba(155,57,34,0.6)]
    `,

    danger: `
        bg-[#9B111E]
        hover:bg-[#C4161C]
        shadow-[0_0_14px_rgba(196,22,28,0.8)]
    `,

    secondary: `
        bg-[#3A1B2F]
        hover:bg-[#4C2540]
        shadow-[0_0_10px_rgba(76,37,64,0.5)]
    `,
};

export default function OptionsModal({ title, description, options = [], onOverlayClick, }) {
    return (
        <div
            onClick={onOverlayClick}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-[#481E14] p-6 rounded-xl border-2 border-[#9B3922] text-center w-80 animate-scaleIn"
            >
                <h2 className="text-xl text-[#F2613F] font-bold mb-4">
                    {title}
                </h2>

                {description && (
                    <p className="mb-6 text-gray-600">
                        {description}
                    </p>
                )}

                <div className="flex gap-4 justify-center flex-wrap">
                    {options.map((opt, index) => (
                        <button
                            key={index}
                            onClick={opt.onClick}
                            className={`
        px-4 py-2 rounded
        text-white font-semibold
        cursor-pointer transition-all duration-200
        hover:scale-105 hover:shadow-lg
        ${BUTTON_VARIANTS[opt.variant || "secondary"]}
    `}
                        >

                            {opt.icon && <span className="mr-1">{opt.icon}</span>}
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
