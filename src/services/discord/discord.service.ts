import { inject, injectable } from 'inversify';
import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import { TYPES } from '../../types';
import { Logger } from 'tslog';
import { AdapterSenderService } from '../adapter.sender.service';
import { ConfigService } from '../../core/config/config.service';

// https://discord.com/oauth2/authorize?client_id=1237066977693139086&permissions=8&scope=bot
@injectable()
export class DiscordService {
	private client: Client;

	constructor(
		@inject(TYPES.Logger) private logger: Logger,
		@inject(TYPES.ConfigService) private configService: ConfigService,
		@inject(TYPES.AdapterSenderService) private adapterSernderService: AdapterSenderService,
	) {
		this.client = new Client({
			intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
		});

		this.client.on('ready', () => {
			this.logger.info('Bot is ready');
			this.client.user?.setActivity('бога');
		});

		this.client.login(this.configService.getDiscordBotToken());
	}

	async handleMessageCreate(): Promise<void> {
		this.client.on('messageCreate', async (message) => {
			// Проверяем, не является ли сообщение от бота
			if (message.author.bot) return;

			//console.log(message);

			// Проверяем, содержит ли сообщение упоминание бота
			if (this.client.user && message.mentions.has(this.client.user.id)) {
				// Отправляем ответное сообщение
				// const
				const answer = await this.adapterSernderService.prepareAndSendMessage(message);
				message.reply(answer);
			}
		});
	}
}
