

export const BRAND = {
    navy: "#0B2C3D",
    green: "#1E7F43",
    gold: "#F4D03F",
    gradient: "linear-gradient(120deg, #0B2C3D 0%, #13506B 55%, #1E7F43 100%)",
};

export const TYPE_META = {
    Winter: { emoji: "❄️", color: "#4DA3FF", soft: "#EAF4FF" },
    Spring: { emoji: "🌱", color: "#52C41A", soft: "#EFFAE8" },
    Summer: { emoji: "☀️", color: "#FA8C16", soft: "#FFF4E6" },
    Fall: { emoji: "🍂", color: "#B5651D", soft: "#FBF0E6" },
};

// [NUEVO] Meta por defecto si el backend devuelve un tipo desconocido (no rompe la card)
export const FALLBACK_TYPE_META = { emoji: "🎾", color: BRAND.navy, soft: "#E8EEF1" };

// [NUEVO] Estados de temporada (textos visibles en inglés). `color` = preset de Tag de antd
export const STATUS_META = {
    upcoming: { label: "Upcoming", color: "blue" },
    active: { label: "In progress", color: "green" },
    finished: { label: "Finished", color: "default" },
    unknown: { label: "No dates", color: "default" },
};