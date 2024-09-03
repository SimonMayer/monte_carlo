export const inputsCastAsInteger = [
    {input: 99, expected: 99},
    {input: '767', expected: 767},
    {input: -8, expected: -8},
    {input: 7.2, expected: 7},
    {input: 'five', expected: 0},
];

export const inputsCastAsPositiveInteger = [
    {input: 99, expected: 99},
    {input: '767', expected: 767},
    {input: 0, expected: 1},
    {input: -8, expected: 1},
    {input: 7.2, expected: 7},
    {input: 'five', expected: 1},
];

export const inputsCastAsArrayItemsCastAsIntegerDefaultsToEmptyIfInvalid = [
    {input: null, expected: []},
    {input: undefined, expected: []},
    {input: 'someOldNonsense', expected: []},
    {input: [], expected: []},
    {input: [1, 7, 3, -4, 0, 0, 3], expected: [1, 7, 3, -4, 0, 0, 3]},
    {input: [1, 7.2, '9', -4], expected: [1, 7, 9, -4]},
];

export const arrayOfIntegerArraysEachSortedAscendingly = [
    {input: [[0, 1]], expected: [[0, 1]]},
    {input: [[1, 0]], expected: [[0, 1]]},
    {input: [[2, 1, 9], [2, 4, 1], [0, 9, 0, -1]], expected: [[1, 2, 9], [1, 2, 4], [-1, 0, 0, 9]]},
];
