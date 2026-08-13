export const calculateReadTime = (
    text,
    wordsPerMinute = 200
) => {
    if (typeof text !== "string" || !text.trim()) {
        return "1 min read";
    }

    const words = text
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .length;

    const minutes = Math.max(
        1,
        Math.ceil(words / wordsPerMinute)
    );

    return `${minutes} min read`;
};