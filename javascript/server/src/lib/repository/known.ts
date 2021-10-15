import type { CellInfo } from '../cells';

interface KnownDevice {
	readonly model: string;
	readonly manufacturer: string;
	readonly deviceName?: string;
	readonly width: number;
	readonly height: number;
}

const knownDevices: readonly KnownDevice[] = [
	{
		model: 'A0001',
		manufacturer: 'OnePlus',
		deviceName: 'OnePlus One',
		width: 470,
		height: 835
	},
	{
		model: 'Amazon OtterX',
		manufacturer: 'android',
		deviceName: 'Amazon Kindle',
		width: 1024,
		height: 552
	},
	{
		model: 'XT1034',
		manufacturer: 'motorola',
		deviceName: 'Moto G XT1034',
		width: 598,
		height: 360
	},
	{
		model: 'A600',
		manufacturer: 'Polaroid',
		deviceName: 'Polaroid A600',
		width: 470,
		height: 835
	}
];

export function computeInfo(serial: string, model: string, manufacturer: string): CellInfo {
	const known = knownDevices.find(
		(device) => device.model === model && device.manufacturer === manufacturer
	);
	const autoDeviceName =
		model.startsWith(manufacturer) || manufacturer.toLowerCase() === 'android'
			? model
			: `${manufacturer} ${model}`;
	if (known) {
		return {
			serial,
			deviceName: known.deviceName || autoDeviceName,
			width: known.width,
			height: known.height
		};
	} else {
		return {
			serial,
			deviceName: autoDeviceName
		};
	}
}
