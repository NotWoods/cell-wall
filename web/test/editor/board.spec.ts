document.getElementById = jest.fn(() => {
    const parent = document.createElement('div');
    const element = document.createElement('section');
    parent.appendChild(element);
    return element;
});

import { scale } from '../../src/editor/board';

test('scale', () => {
    expect(scale(16)).toBe('1em');
    expect(scale(8)).toBe('0.5em');
});
