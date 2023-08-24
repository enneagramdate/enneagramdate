// Reference: https://enneagramtest.com/blog/enneagram-compatibility

const dictionary = new Map();

dictionary.set(1, new Set([2, 5, 7]));
dictionary.set(2, new Set([1, 8, 9]));
dictionary.set(3, new Set([6, 9]));
dictionary.set(4, new Set([5, 6, 9]));
dictionary.set(5, new Set([1, 4, 8]));
dictionary.set(6, new Set([3, 4, 7, 9]));
dictionary.set(7, new Set([1, 6, 8]));
dictionary.set(8, new Set([2, 5, 7]));
dictionary.set(9, new Set([2, 3, 4, 6]));

export default dictionary;
