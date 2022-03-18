export const cellStateTypes = new Set([
    'BLANK',
    'TEXT',
    'IMAGE',
    'WEB'
]);
export * from './blank.js';
export * from './image.js';
export * from './text.js';
export * from './web.js';
export function filterState(type, state) {
    if (state.type === type) {
        return state;
    }
    else {
        return undefined;
    }
}
//# sourceMappingURL=index.js.map