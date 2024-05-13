/* eslint-disable no-useless-catch */
import { inject, injectable } from 'inversify';
import fs from 'fs';
import {
	IAgentQueryBody,
	IAgentQueryResponse,
	IDatasourceCreateResponse,
	IDatasourceDeleteResponse,
	IDatasourceGetResponse,
	IDatastoreCreateBody,
	IDatastoreCreateResponse,
	IDatastoreGetResponse,
} from './aiagent.interfaces';
import axios, { AxiosResponse, RawAxiosRequestHeaders } from 'axios';
import { aiagentHelper } from './aiagent.helper';
import { IConfigService } from '../../core/config/config.service.interface';
import { TYPES } from '../../types';

@injectable()
export class AiagentService {
	private agentId: string;
	private datastoreId: string;
	private headers: RawAxiosRequestHeaders;

	public constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {
		this.agentId = this.configService.getAiagentAgent();
		this.datastoreId = this.configService.getAiagentStoreId();
		this.headers = {
			'Content-Type': 'application/json; charset=utf-8',
			Authorization: 'Bearer ' + this.configService.getAiagentToken(),
		};
	}

	public async agentQuery(body: IAgentQueryBody, agentId?: string): Promise<AxiosResponse<IAgentQueryResponse>> {
		try {
			const id = agentId ?? this.agentId;
			const response = await axios.post<IAgentQueryResponse>(aiagentHelper.getAgentQueryUrl(id), body, {
				headers: this.headers,
			});
			return response;
		} catch (error) {
			throw error;
		}
	}

	public async datastoreGet(datastoreId?: string): Promise<AxiosResponse<IDatastoreGetResponse>> {
		try {
			const id = datastoreId ?? this.datastoreId;
			const response = await axios.get<IDatastoreGetResponse>(aiagentHelper.getDatastoreGetUrl(id), {
				headers: this.headers,
			});
			return response;
		} catch (error) {
			throw error;
		}
	}

	public async datastoreCreate(body: IDatastoreCreateBody): Promise<AxiosResponse<IDatastoreCreateResponse>> {
		try {
			const response = await axios.post<IDatastoreCreateResponse>(aiagentHelper.getDatastoreCreateUrl(), body, {
				headers: this.headers,
			});
			return response;
		} catch (error) {
			throw error;
		}
	}

	public async dataSourceGet(id: string): Promise<AxiosResponse<IDatasourceGetResponse>> {
		try {
			const response = await axios.get<IDatasourceGetResponse>(aiagentHelper.getDatasourcesGetUrl(id), {
				headers: this.headers,
			});
			return response;
		} catch (error) {
			throw error;
		}
	}

	public async dataSourceDelete(id: string): Promise<AxiosResponse<IDatasourceDeleteResponse>> {
		try {
			const response = await axios.delete<IDatasourceDeleteResponse>(aiagentHelper.getDatasourcesGetUrl(id), {
				headers: this.headers,
			});
			return response;
		} catch (error) {
			throw error;
		}
	}

	public async dataSourceCreate(files: Express.Multer.File[]): Promise<Array<IDatasourceCreateResponse>> {
		const result: Array<IDatasourceCreateResponse> = [];

		for (let i = 0; i < files.length; i++) {
			const formData = new FormData();
			const file = files[i];

			const buffer = fs.readFileSync(file.path);

			formData.append(
				'file',
				new Blob([buffer], {
					type: file.mimetype,
				}),
				file.filename,
			);

			formData.append('type', 'file');
			formData.append('datastoreId', this.datastoreId);
			formData.append('fileName', file.filename);

			try {
				const res = await fetch(aiagentHelper.getDatasourcesCreateUrl(), {
					method: 'POST',
					body: formData,
					headers: {
						Authorization: 'Bearer ' + this.configService.getAiagentToken(),
					},
				});

				const fileItemInfo = (await res.json()) as IDatasourceCreateResponse;
				result.push(fileItemInfo);
			} catch (error) {
				throw error;
			}
		}

		return result;
	}
}
