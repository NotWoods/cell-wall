/**
 * Cell info includes the user-friendly name of a device,
 * the width and height of the display in density independent pixels,
 * and the x/y location relative to other phones.
 */
export interface CellInfo {
	serial: string;
	deviceName?: string;
	width?: number;
	height?: number;
	x?: number;
	y?: number;
	server?: string;
}

export const cellInfoSchema = {
	type: 'object',
	properties: {
		serial: { type: 'string' },
		deviceName: { type: 'string' },
		width: { type: 'number', exclusiveMinimum: 0 },
		height: { type: 'number', exclusiveMinimum: 0 },
		x: { type: 'number' },
		y: { type: 'number' },
		server: { type: 'string', format: 'uri' }
	}
} as const;
