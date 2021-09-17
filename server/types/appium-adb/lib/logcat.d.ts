import { EventEmitter } from 'events';

export interface Log {
	timestamp: number;
	level: string;
	message: string;
}

export class Logcat extends EventEmitter {
	startCapture(): Promise<void>;
	outputHandler(output: string, prefix?: string): void;
	stopCapture(): Promise<void>;
	getLogs(): Log[];
	getAllLogs(): Log[];
	clear(): Promise<void>;
}
