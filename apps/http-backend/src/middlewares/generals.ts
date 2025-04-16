/*External Dependencies*/
import { Request, Response, NextFunction } from 'express';

/*Internal Dependencies*/
import { helpers, types, commonMiddlewares } from '@repo/utils';


const apiLogger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`((((()))))) Middleware START :: API With Method = ${req.method} and url = ${req.protocol}://${req.get('host')}${req.originalUrl} ))))))))`);
    console.log(`Request Headers: ${JSON.stringify(req.headers)}`);
    console.log(`Request Cookies : ${JSON.stringify(req.cookies)}`);
    console.log(`Request Body: ${JSON.stringify(req.body)}`);
    console.log(`Request Query: ${JSON.stringify(req.query)}`);
    console.log(`Request Params: ${JSON.stringify(req.params)}`);
    console.log('-----------------------------------------------------------------------');
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`((((()))))) Middleware END :: API With Method = ${req.method} and url = ${req.protocol}://${req.get('host')}${req.originalUrl} ))))))))`);
        console.log(`Duration: ${duration}ms`);
        console.log(`Status Code: ${res.statusCode}`);
        console.log(`Response Body: ${JSON.stringify(res.locals.responseBody)}`);
        console.log(`Response Headers: ${JSON.stringify(res.getHeaders())}`);
        console.log('**********************************************************')
    });
    next();
}

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('(((((((()))))))))))) Middleware :: Error occurred:', err);
    res.status(500).json(helpers.sendResponse(false, 'Internal Server Error'));
}

const authentication =  (req: types.AuthenticatedRequest, res: Response, next: NextFunction): any => {
    try {
        const token = req.cookies?.authentication;

        if (!token) {
            throw new helpers.CustomError(401, 'Authentication token not found');
        }
        const decodedInfo: { id: string } = commonMiddlewares.validateJwtToken(token) as any;
        if (!decodedInfo)
            throw new helpers.CustomError(401, 'Invalid authentication token');

        const userId = decodedInfo.id;
        if (!userId)
            throw new helpers.CustomError(401, 'Invalid authentication token');
        req.id = userId; // Attach the user ID to the request object
        return next();
    } catch (err: any) {
        if (!err.statusCode)
            console.error('Error in authentication middleware:', err);
        return res.status(500).json(helpers.sendResponse(false, err.statusCode != null ? err.message : 'Internal Server Error'));
    }
}
export { apiLogger, errorHandler, authentication }