import { PromptType } from './aiagent.constants';

//Get Agent Response
export interface IGetAgentResponse {
	id: string;
	name: string;
	description: string;
	prompt: string;
	promptType: string;
	iconUrl: any;
	temperature: number;
	modelName: string;
	includeSources: boolean;
	restrictKnowledge: boolean;
	visibility: string;
	ownerId: any;
	organizationId: string;
	nbQueries: number;
	interfaceConfig: any;
	handle: any;
	createdAt: string;
	updatedAt: string;
	tools: ITool[];
}

export interface ITool {
	id: string;
	type: string;
	agentId: string;
	datastoreId: string;
	config: any;
	serviceProviderId: any;
	createdAt: string;
	updatedAt: string;
	datastore: IDatastore;
}

export interface IDatastore {
	id: string;
	name: string;
	description: any;
	type: string;
	visibility: string;
	pluginIconUrl: any;
	pluginName: string;
	pluginDescriptionForHumans: string;
	pluginDescriptionForModel: string;
	config: any;
	ownerId: any;
	organizationId: string;
	createdAt: string;
	updatedAt: string;
	_count: ICount;
}

export interface ICount {
	datasources: number;
}

// Agent Query
export interface IAgentQueryBody {
	conversationId?: string;
	filters: IFilters;
	maxTokens: number;
	modelName?: string;
	promptTemplate?: string;
	promptType: PromptType;
	query: string;
	streaming: boolean;
	temperature?: number;
	topP?: number;
	visitorId?: string;
}

export interface IFilters {
	custom_ids: any[];
	datasource_ids: any[];
}

export interface IAgentQueryResponse {
	answer: string;
	sources: ISource[];
	usage: IUsage;
	messageId: string;
	conversationId: string;
	visitorId: string;
}

export interface ISource {
	chunk_id: string;
	datasource_id: string;
	datasource_name: string;
	datasource_type: string;
	source_url: string;
	mime_type: string;
	score: number;
}

export interface IUsage {
	completionTokens: number;
	promptTokens: number;
	totalTokens: number;
	cost: number;
}

// Datastore Get
export interface IDatastoreGetResponse {
	id: string;
	name: string;
	description: null;
	type: string;
	visibility: string;
	pluginIconUrl: null;
	pluginName: string;
	pluginDescriptionForHumans: string;
	pluginDescriptionForModel: string;
	config: any; //TODO
	ownerId: null;
	organizationId: string;
	createdAt: Date;
	updatedAt: Date;
	datasources: IDatasource[];
	apiKeys: IAPIKey[];
	_count: {
		datasources: number;
	};
}

export interface IAPIKey {
	id: string;
	key: string;
	datastoreId: string;
	createdAt: Date;
}

export interface IDatasource {
	id: string;
	type: string;
	name: string;
	status: string;
	config: IDatasourceConfig;
	datastoreId: string;
	ownerId: null;
	organizationId: string;
	nbChunks: number;
	textSize: number;
	nbTokens: number;
	hash: string;
	nbSynch: number;
	lastSynch: Date;
	createdAt: Date;
	updatedAt: Date;
	groupId: null;
	serviceProviderId: null;
	children: any[];
	_count: IDatasourceCount;
}

export interface IDatasourceCount {
	children: number;
}

export interface IDatasourceConfig {
	tags: any[];
	answer?: string;
	question?: string;
	source_url: string;
	fileSize?: number;
	file_url?: string;
	mime_type?: string;
}

// Datastore Create
export interface IDatastoreCreateBody {
	description: 'string';
	name: 'string';
	type: 'string'; //qdrant
}

export interface IDatastoreCreateResponse {
	id: string;
	name: string;
	description: string;
	type: string;
	visibility: string;
	pluginIconUrl: null;
	pluginName: string;
	pluginDescriptionForHumans: string;
	pluginDescriptionForModel: string;
	config: {}; //TODO;
	ownerId: null;
	organizationId: string;
	createdAt: Date;
	updatedAt: Date;
}

//Datasource Get
export interface IDatasourceGetResponse {
	id: string;
	type: string;
	name: string;
	status: string;
	config: IConfig;
	datastoreId: string;
	ownerId: any;
	organizationId: string;
	nbChunks: number;
	textSize: number;
	nbTokens: number;
	hash: string;
	nbSynch: number;
	lastSynch: string;
	createdAt: string;
	updatedAt: string;
	groupId: any;
	serviceProviderId: any;
	datastore: IDatastore;
}

export interface IConfig {
	tags: any[];
	fileSize: number;
	file_url: string;
	mime_type: string;
	source_url: string;
}

export interface IDatastore {
	name: string;
}

export interface IDatasourceDeleteResponse {
	id: string;
	type: string;
	name: string;
	status: string;
	config: Omit<IConfig, 'file_url'>;
	datastoreId: string;
	ownerId: any;
	organizationId: string;
	nbChunks: number;
	textSize: number;
	nbTokens: number;
	hash: string;
	nbSynch: number;
	lastSynch: string;
	createdAt: string;
	updatedAt: string;
	groupId: any;
	serviceProviderId: any;
	organization: IOrganization;
	datastore: Omit<IDatastore, '_count'>;
	children: any[];
}

export interface IOrganization {
	id: string;
	name: string;
	iconUrl: any;
	createdAt: string;
	updatedAt: string;
}

export type IDatasourceCreateResponse = Omit<IDatasourceDeleteResponse, 'children' | 'datastore'>;
