import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ConfigService } from './core/config/config.service';
import { IConfigService } from './core/config/config.service.interface';
import { ExeptionFilter } from './core/errors/exeption.filter';
import { IExeptionFilter } from './core/errors/exeption.filter.interface';
import { ILogger } from './core/logger/logger.interface';
import { LoggerService } from './core/logger/logger.service';
import { TYPES } from './types';
import { DiscordService } from './services/discord/discord.service';
import { AiagentService } from './services/aiagent/aiagent.service';
import { AdapterSenderService } from './services/adapter.sender.service';
import { RedisService } from './services/redis.service';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.Logger).to(LoggerService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
	bind<App>(TYPES.Application).to(App);
	bind<DiscordService>(TYPES.DiscordService).to(DiscordService).inSingletonScope();
	bind<AiagentService>(TYPES.AiagentService).to(AiagentService).inSingletonScope();
	bind<AdapterSenderService>(TYPES.AdapterSenderService).to(AdapterSenderService).inSingletonScope();
	bind<RedisService>(TYPES.RedisService).to(RedisService).inSingletonScope();
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
