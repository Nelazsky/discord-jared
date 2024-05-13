// Файл с сервисом для работы с Redis
// В нем реализованы методы для сохранения, удаления и получения данных из Redis
// Также реализован метод для получения всех данных из Redis
// И методы для установки и получения значения inProcess в Redis по ключу
// Все методы асинхронные и возвращают промисы
// В качестве клиента Redis используется библиотека ioredis

import Redis from 'ioredis';
import { inject, injectable } from 'inversify';
import { IGlobalDataItem, IGlobalData } from '../app';
import { ConfigService } from '../core/config/config.service';
import { TYPES } from '../types';
@injectable()
export class RedisService {
	private redisClient: Redis;

	constructor(@inject(TYPES.ConfigService) private readonly configService: ConfigService) {}

	public async init(): Promise<void> {
		try {
			// Инициализация клиента Redis
			this.redisClient = new Redis({
				host: this.configService.getRedisHost(),
				port: this.configService.getRedisPort(),
				password: this.configService.getRedisPassword(),
			});
		} catch (error) {
			throw new Error(`RedisService init error: ${JSON.stringify(error)}`);
		}
	}

	// Метод для сохранения данных в Redis
	public async setValue(
		chatId: string,
		value: { conversationId: string; visitorId: string; inProcess: boolean },
	): Promise<void> {
		await this.redisClient.set(chatId, JSON.stringify(value));
	}

	// Метод для удаления данных из Redis по ключу
	public async deleteValue(chatId: string): Promise<void> {
		await this.redisClient.del(chatId);
	}

	// Метод для получения данных из Redis по ключу
	public async getValue(chatId: string): Promise<IGlobalDataItem | undefined> {
		const data = await this.redisClient.get(chatId);
		return data ? JSON.parse(data) : undefined;
	}

	// Метод для получения всех данных из Redis
	public async getAllData(): Promise<IGlobalData> {
		const keys = await this.redisClient.keys('*');
		const data: IGlobalData = {};

		if (keys.length > 0) {
			const values = await this.redisClient.mget(...keys);
			values.forEach((value: string | null, index: number) => {
				const chatId = keys[index];
				data[chatId] = value ? JSON.parse(value) : undefined;
			});
		}

		return data;
	}

	// Метод для установки значения inProcess в Redis по ключу
	public async setInProcess(chatId: string, inProcess: boolean): Promise<void> {
		const item = await this.getValue(chatId);

		if (item) {
			item.inProcess = inProcess;
			await this.setValue(chatId, item);
		}
	}

	// Метод для получения значения inProcess из Redis по ключу
	public async getInProcess(chatId: string): Promise<boolean | undefined> {
		const item = await this.getValue(chatId);
		return item ? item.inProcess : undefined;
	}
}
