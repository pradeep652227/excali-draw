/*External Dependencies*/
import jwt, { JwtPayload } from 'jsonwebtoken';

/*Internal Dependencies*/
import { CustomError } from './helpers';
import config from './config';
export const validateJwtToken = (token: string) => {
    try {
        if (!token) {
            throw new CustomError(401, 'Authentication token not found');
        }
        // Verify the token
        const decoded = jwt.verify(token, config.jwtSecret);
        
        if (!decoded || !(decoded as JwtPayload).id)
            throw new CustomError(401, 'Invalid authentication token');
        
        return { id: (decoded as JwtPayload).id };
    } catch (error: any) {
        if (!error.statusCode)
            console.error('Error in validateJwtToken middleware:', error);
        return null;
    }
}