import n5 from "@/mock/n5.json";
// import n4 from "@/mock/n4.json";
// import n3 from "@/mock/n3.json";
// import n2 from "@/mock/n2.json";
// import n1 from "@/mock/n1.json";

const dataMap = {
    n5,
    // n4,
    // n3,
    // n2,
    // n1,
};

export function getLevelData(level) {
    if (typeof level !== "string") return null;

    const key = level.toLowerCase();
    return dataMap[key] || null;
}

export function getStageData(level, stage) {
    const data = getLevelData(level);
    return data.stages.find(s => s.stage === Number(stage));
}
