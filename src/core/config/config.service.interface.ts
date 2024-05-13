export type ConfigObj = {
	host: string;
	port: number;
};

export interface IConfigService {
	getEnv: <T extends string | number>(key: string) => T;
	getConfig: () => ConfigObj;
	getServerPort: () => number;

	getAiagentAgent: () => string;
	getAiagentToken: () => string;
	getAiagentStoreId: () => string;
	getChatwootAccessToken: () => string;
}
