import { helpers, commonMiddlewares } from '@repo/utils';
export const authMiddleware = async (token: string): Promise<any> => {
    try {
        const decodedInfo: { id: string } = await commonMiddlewares.validateJwtToken(token) as any;
        if (!decodedInfo)
            throw new helpers.CustomError(401, 'Invalid authentication token');
        const userId = decodedInfo.id;
        if (!userId)
            throw new helpers.CustomError(401, 'Invalid authentication token');

        return userId; // Attach the user ID to the request object
    } catch (error: any) {
        if (!error.statusCode)
            console.log('Error in WS: Auth Middleware')
        return null;
    }
};