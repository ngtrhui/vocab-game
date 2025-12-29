import n5 from "@/mock/n5.json";
// import n4 from "@/data/n4.json";
// sau này thêm n3, n2, n1

const LEVEL_DATA = {
    n5,
    // n4
};

function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

/**
 * Lấy dữ liệu cho 1 stage
 * @param {string} level - n5
 * @param {number} stage - 1 → 100
 */
export function getStageWords(level) {
    const data = n5; // demo
    return shuffle(data.words).slice(0, 20);
}

/**
 * Dùng cho trang chọn stage
 */
export function getLevelData(level) {
    return {
        level,
        totalStages: 100
    };
}
