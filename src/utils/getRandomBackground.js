// utils/getRandomBackground.js
const BG_MAP = {
    n5: [
        "/assets/backgrounds/n5/bg1.png",
        "/assets/backgrounds/n5/bg2.png",
    ],
    n4: [
        "/assets/backgrounds/n4/bg1.png",
        "/assets/backgrounds/n4/bg2.png",
    ],
    n3: [
        "/assets/backgrounds/n3/bg1.png",
    ],
};

export function getRandomBackground(level) {
    const list = BG_MAP[level];
    if (!list || list.length === 0) return null;

    return list[Math.floor(Math.random() * list.length)];
}
