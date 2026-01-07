import n5 from "@/mock/n5.json";

function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

/**
 * Lấy dữ liệu cho 1 stage
 * @param {string} level - n5
 * @param {number} stage
 */
export function getStageWords(level) {
    const data = n5;
    return shuffle(data.words).slice(0, 20);
}

export function getLevelData(level) {
    return {
        level,
        totalStages: 100
    };
}
