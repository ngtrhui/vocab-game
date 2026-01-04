"use client";

export default function OptionsModal({
    title,
    description,
    options = [],
    onOverlayClick,
}) {
    return (
        // OVERLAY
        <div
            onClick={onOverlayClick}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-6 rounded-xl text-center w-80 animate-scaleIn"
            >
                {/* TITLE */}
                <h2 className="text-xl text-gray-900 font-bold mb-4">
                    {title}
                </h2>

                {/* DESCRIPTION */}
                {description && (
                    <p className="mb-6 text-gray-600">
                        {description}
                    </p>
                )}

                {/* OPTIONS */}
                <div className="flex gap-4 justify-center flex-wrap">
                    {options.map((opt, index) => (
                        <button
                            key={index}
                            onClick={opt.onClick}
                            className={`
                                px-4 py-2 rounded text-white cursor-pointer
                                transition-all duration-200 hover:scale-105 hover:shadow-lg
                                ${opt.className}
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
