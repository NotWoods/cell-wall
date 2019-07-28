export const form = document.getElementById('options') as HTMLFormElement;

export const BASE_SIZE = 16;

/**
 * Convert number to CSS string
 * @param {number} value
 */
export function scale(value: number) {
    return `${value / BASE_SIZE}em`;
}

export class Board {
    element: HTMLElement;
    container: HTMLElement;
    containerDim!: { width: number; height: number };

    constructor() {
        this.element = document.getElementById('cellwall-board')!;
        this.container = this.element.parentElement!;
        this.updateContainerDimensions();
        this.setDimension('width', form.width.value);
        this.setDimension('height', form.height.value);
        this.updateScale();
    }

    updateContainerDimensions() {
        this.containerDim = {
            width: this.container.clientWidth,
            height: this.container.clientHeight,
        };
    }

    updateScale() {
        const width = parseFloat(this.element.style.width!) * BASE_SIZE;
        const height = parseFloat(this.element.style.height!) * BASE_SIZE;
        const xScale = this.containerDim.width / width;
        const yScale = this.containerDim.height / height;
        this.container.style.fontSize = `${Math.min(xScale, yScale) *
            BASE_SIZE}px`;
    }

    /**
     * @param {HTMLElement} element
     */
    add(element: HTMLElement) {
        this.element.appendChild(element);
    }

    /**
     * Change the width or height of the board
     * @param {'width' | 'height'} dim
     * @param {number} value
     */
    setDimension(dim: 'width' | 'height', value: number) {
        this.element.style[dim] = scale(value);
        form[dim].value = value;
    }
}
