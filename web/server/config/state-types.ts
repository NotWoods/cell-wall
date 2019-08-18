export interface ConfigState {
    defaultUrl: string;
    width: number;
    height: number;
    devices: { [udid: string]: DeviceState };
}

export interface DeviceState {
    /** User-readable string representing the phone model. */
    name?: string;
    /** Page open on the cell. */
    url?: string;
    position?: [number, number];
    display?: {
        /**
         * The logical density of the display. This is a scaling factor for the `dp`,
         * where one `dp` is one `px` on a 160dpi screen. Thus on a 160dpi screen,
         * this density value will be 1; on a 120dpi screen it would be .75; etc.
         */
        density: number;
        heightPixels: number;
        widthPixels: number;
    };
}
