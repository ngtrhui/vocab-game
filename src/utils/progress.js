const DEFAULT_PROGRESS = {
    currentLevel: "n5",
    unlockedLevels: ["n5"],
    progress: {
        n5: { unlockedStage: 1, completedStages: [] },
        n4: { unlockedStage: 0, completedStages: [] },
        n3: { unlockedStage: 0, completedStages: [] },
        n2: { unlockedStage: 0, completedStages: [] },
        n1: { unlockedStage: 0, completedStages: [] }
    }
};

export function getProgress() {
    if (typeof window === "undefined") return DEFAULT_PROGRESS;

    const saved = localStorage.getItem("vocab-progress");
    return saved ? JSON.parse(saved) : DEFAULT_PROGRESS;
}

export function saveProgress(data) {
    localStorage.setItem("vocab-progress", JSON.stringify(data));
}

export function completeStage(level, stage) {
    const data = getProgress();

    const stageNum = Number(stage);
    const totalStages = 100;

    const levelData = data.progress[level];

    // 1️⃣ tránh ghi trùng
    if (!levelData.completedStages.includes(stageNum)) {
        levelData.completedStages.push(stageNum);
    }

    // 2️⃣ mở stage tiếp theo
    if (stageNum >= levelData.unlockedStage) {
        levelData.unlockedStage = stageNum + 1;
    }

    // 3️⃣ nếu hoàn thành TOÀN BỘ stage → mở level mới
    if (levelData.completedStages.length === totalStages) {
        const order = ["n5", "n4", "n3", "n2", "n1"];
        const currentIndex = order.indexOf(level);

        if (currentIndex !== -1 && currentIndex < order.length - 1) {
            const nextLevel = order[currentIndex + 1];

            if (!data.unlockedLevels.includes(nextLevel)) {
                data.unlockedLevels.push(nextLevel);
            }

            data.progress[nextLevel].unlockedStage = 1;
            data.currentLevel = nextLevel;
        }
    }

    saveProgress(data);
}


