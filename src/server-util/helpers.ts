// helper functions

/**
 * Performs the Fisher-Yates shuffle on an array as it has O(n) time complexity and is unbiased.
 * @param {any[]} array - array to shuffle
 * @returns {any[]} - shuffled array
 */
export const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    return array;
}

