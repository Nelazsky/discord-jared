/* eslint-disable no-useless-catch */
import { inject, injectable } from 'inversify';
import { AiagentService } from './aiagent/aiagent.service';
import { AxiosError } from 'axios';
import { PromptType } from './aiagent/aiagent.constants';
import { IAgentQueryBody } from './aiagent/aiagent.interfaces';
import { RedisService } from './redis.service';
import { LoggerService } from '../core/logger/logger.service';
import { TYPES } from '../types';
import { DiscordService } from './discord/discord.service';
import { Message } from 'discord.js';
import { ConfigService } from '../core/config/config.service';

@injectable()
export class AdapterSenderService {
	constructor(
		@inject(TYPES.AiagentService) private AiagentService: AiagentService,
		@inject(TYPES.ConfigService) private configService: ConfigService,
		@inject(TYPES.Logger) private loggerService: LoggerService,
		@inject(TYPES.RedisService) private redisService: RedisService,
	) {}

	public async prepareAndSendMessage(eventData: Message): Promise<any> {
		try {
			let aiAnswer = '';

			let body: IAgentQueryBody = {
				filters: {
					custom_ids: [],
					datasource_ids: [],
				},
				maxTokens: 2000,
				//modelName: 'gpt_4',
				promptType: PromptType.CUSTOMER_SUPPORT,
				query: eventData.content,
				streaming: false,
			};

			const contactId = eventData.author.id;
			const data = await this.redisService.getValue(contactId);
			console.log(data);
			if (data) {
				body = { ...body, conversationId: data.conversationId, visitorId: data.visitorId };
			}

			const agentId = this.configService.getAiagentAgent();

			try {
				const result = await this.AiagentService.agentQuery(body, agentId);
				aiAnswer = result.data.answer;
				this.redisService.setValue(contactId, {
					conversationId: result.data.conversationId,
					visitorId: result.data.visitorId,
					inProcess: false,
				});
			} catch (error) {
				if (error instanceof Error) {
					this.loggerService.error(error.message);
				} else if (error instanceof AxiosError) {
					this.loggerService.error(`Axios [${error.name}]: ${error.message}`);
				} else if (typeof error === 'string') {
					this.loggerService.error(error);
				} else {
					this.loggerService.error('Unknown Error');
				}

				aiAnswer = `Извините, я не могу помочь. Ну, я не справился с этим заданием на этот раз, но это всего лишь повод еще больше усердно работать и искать новые подходы к решению.`;
			}

			return aiAnswer;
		} catch (error) {
			throw error;
		}
	}
}
