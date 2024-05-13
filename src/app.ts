import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { ExeptionFilter } from './core/errors/exeption.filter';
import { ILogger } from './core/logger/logger.interface';
import { TYPES } from './types';
import { json } from 'body-parser';
import { IConfigService } from './core/config/config.service.interface';
import Redis from 'ioredis';

import bodyParser from 'body-parser';
import session from 'express-session';
import path from 'path';
import 'reflect-metadata';
import { RedisService } from './services/redis.service';
import { DiscordService } from './services/discord/discord.service';

export interface IGlobalDataItem {
	conversationId: string;
	visitorId: string;
	inProcess: boolean;
}

export interface IGlobalData {
	[key: string]: IGlobalDataItem;
}

export const globalData: IGlobalData = {};

declare module 'express-session' {
	interface SessionData {
		somedata: any;
	}
}

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;
	store: any;

	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.DiscordService) private discordService: DiscordService,
		@inject(TYPES.Logger) private logger: ILogger,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: ExeptionFilter,
		@inject(TYPES.RedisService) private redisSerivce: RedisService,
	) {
		this.app = express();
		this.port = this.configService.getServerPort();
		this.store = new session.MemoryStore();
	}

	useSettings(): void {
		this.app.set('views', path.join(__dirname, 'views'));
		this.app.set('view engine', 'ejs');
	}

	useRoutes(): void {
		//TODO
	}

	useExeptionFilters(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	useMiddleware(): void {
		this.app.use(json());
		this.app.use(
			session({
				secret: this.configService.getEnv<string>('SESSION_SALT'),
				cookie: {
					httpOnly: true,
				},
				saveUninitialized: false,
				resave: false,
			}),
		);

		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.app.use(express.static(path.join(__dirname, 'public')));
	}

	public async init(): Promise<void> {
		await this.redisSerivce.init();
		this.useSettings();
		this.useMiddleware();
		this.useRoutes();
		this.discordService.handleMessageCreate();
		this.useExeptionFilters();
		this.server = this.app.listen(this.port);
		this.logger.info('Server started on http://localhost:' + this.port);
	}
}
