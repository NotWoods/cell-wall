const types = ['BLANK', 'TEXT', 'IMAGE', 'WEB', 'CLOCK'];
export const cellStateTypes = new Set(types);
export * from './blank.js';
export * from './clock.js';
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