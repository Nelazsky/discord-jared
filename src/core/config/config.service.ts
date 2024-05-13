import { ConfigObj, IConfigService } from './config.service.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ILogger } from '../logger/logger.interface';
import fs from 'fs';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;

	constructor(@inject(TYPES.Logger) private logger: ILogger) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error('[ConfigService] Не удалось прочитать файл .env или он отсутствует');
		} else {
			this.logger.info('[ConfigService] Конфигурация .env загружена');
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	public getEnv<T extends string | number>(key: string): T {
		return this.config[key] as T;
	}

	public getConfig(): ConfigObj {
		const config: any = JSON.parse(fs.readFileSync('config.json').toString());
		const env = this.getEnv<string>('APP_ENV');
		if (env in config) {
			return config[env] as ConfigObj;
		} else {
			throw new Error('[ConfigService::getConfig] Конфигурация "' + env + '" не объявлена');
		}
	}

	public getServerPort(): number {
		return this.getConfig().port;
	}

	public getAiagentAgent(): string {
		return this.getEnv<string>('AIAGENT_AGENT_ID');
	}

	public getDiscordBotToken(): string {
		return this.getEnv<string>('DISCORD_TOKEN');
	}

	public getAiagentToken(): string {
		return this.getEnv<string>('AIAGENT_TOKEN');
	}

	public getAStoreId(): string {
		return this.getEnv<string>('AIAGENT_DATASTORE');
	}

	public getChatwootAccessToken(): string {
		return this.getEnv<string>('CHATWOOT_ACCESS_TOKEN');
	}

	public getRedisHost(): string {
		return this.getEnv<string>('REDIS_HOST');
	}

	public getRedisPassword(): string {
		return this.getEnv<string>('REDIS_PASSWORD');
	}

	public getRedisPort(): number {
		return this.getEnv<number>('REDIS_PORT');
	}
}
