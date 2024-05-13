import { API } from './aiagent.constants';

export class aiagentHelper {
	public static getAgentQueryUrl(id: string): string {
		return `${API.BASE_URL}${API.AGENT_QUERY}`.replace(':id', id);
	}

	public static getDatastoreCreateUrl(): string {
		return `${API.BASE_URL}${API.DATASTORE_CREATE}`;
	}

	public static getDatastoreGetUrl(id: string): string {
		return `${API.BASE_URL}${API.DATASTORE_GET}`.replace(':id', id);
	}

	public static getDatasourcesGetUrl(id: string): string {
		return `${API.BASE_URL}${API.DATASOURCE_GET}`.replace(':id', id);
	}

	public static getDatasourcesCreateUrl(): string {
		return `${API.BASE_URL}${API.DATASOURCE_POST}`;
	}
}
