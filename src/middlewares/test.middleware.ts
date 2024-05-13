import { NextFunction, Request, Response } from 'express';
import { IMiddleware } from './middleware.interface';

//Not used, prepared for future
export class TestMiddleware implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		console.log('Hello From TestMiddleware!');
		next();
	}
}
