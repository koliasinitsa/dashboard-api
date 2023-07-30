import { Logger, ISettingsParam } from 'tslog';
import { ILogger } from './logger.interface';
import { injectable } from 'inversify';
// import "reflect-metadata";

@injectable()
export class LoggerService implements ILogger {
	public logger: Logger<any>;

	constructor() {
		this.logger = new Logger({
			displayInstanceName: false,
			displayLoggerName: false,
			displayFilePath: 'hidden',
			displayFunctionName: false,
		} as ISettingsParam<any>);
	}

	log(...args: unknown[]): void {
		this.logger.info(...args);
	}
	error(...args: unknown[]): void {
		this.logger.error(...args);
	}
	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
}
