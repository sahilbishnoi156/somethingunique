export function getRandomElement<T>(array: T[]): T {
    if (!Array.isArray(array) || array.length === 0) {
        throw new Error('Input must be a non-empty array.');
    }
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}
