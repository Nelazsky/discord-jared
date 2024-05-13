import { Logger } from 'tslog';

export interface ILogger {
	logger: unknown;
	info: (...args: unknown[]) => void;
	error: (...args: unknown[]) => void;
	warn: (...args: unknown[]) => void;
}
