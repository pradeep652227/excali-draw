/*External Dependencies*/
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/*Internal Dependencies*/
import { helpers, types } from '@repo/utils';
import config from '../config';

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

const authentication = (req: types.AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.authentication;
        
        if (!token) {
            throw new helpers.CustomError(401, 'Authentication token not found');
        }
        // Verify the token
        jwt.verify(token, config.jwtSecret, (err: any, decoded: any) => {
            if (err) {

                console.log(`🚀 ~ generals.ts:48 ~ jwt.verify ~ err:`, err)

                throw new helpers.CustomError(401, 'Invalid authentication token');
            }
            // Attach user information to the request object
            req.user = decoded;
            return next();
        });
    } catch (err: any) {
        if (!err.statusCode)
            console.error('Error in authentication middleware:', err);
        return res.status(500).json(helpers.sendResponse(false, err.statusCode != null ? err.message : 'Internal Server Error'));


    }
}
export { apiLogger, errorHandler, authentication }