import { Router } from 'express';
import { ExpressReturnType, IControllerRoute } from '../core/route.interface';
import { Response } from 'express';
import { ILogger } from '../core/logger/logger.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, message: T): ExpressReturnType {
		return res.status(200).send(message);
	}

	public json<T>(res: Response, code: number, message: T): ExpressReturnType {
		res.type('application/json');
		return res.status(code).json(message);
	}

	public ok<T>(res: Response, message: T): ExpressReturnType {
		return this.json<T>(res, 200, message);
	}

	//TODO FIX any
	public render(res: Response, view: string, params?: any): void {
		return res.render(view, params);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			this.logger.info(`[${route.method}] ${route.path}`);
			const middleware = route.middlewares?.map((m) => m.execute.bind(m)); //save context
			const handler = route.func.bind(this); //save context
			const pipeline = middleware ? [...middleware, handler] : handler;
			this.router[route.method](route.path, pipeline);
		}
	}
}
