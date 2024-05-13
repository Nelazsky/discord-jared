export enum API {
	BASE_URL = 'https://aiagent-api.handyweb.org',

	AGENT_QUERY = '/agents/:id/query',

	DATASTORE_GET = '/datastores/:id',
	DATASTORE_CREATE = '/datastores',

	DATASOURCE_GET = '/datasources/:id',
	DATASOURCE_DELETE = '/datasources/:id',
	DATASOURCE_POST = '/datasources',
}

export enum PromptType {
	RAW = 'raw',
	CUSTOMER_SUPPORT = 'customer_support',
}
