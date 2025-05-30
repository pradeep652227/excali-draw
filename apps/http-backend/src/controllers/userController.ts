/* External Dependencies*/
import jwt from "jsonwebtoken";
import crypto from "crypto";

/* Internal Dependencies*/
import { User } from "@repo/database"
import { helpers, commonConfig, ZodSchemas } from "@repo/utils"
import { Request, Response } from "express";

const signup = async (req: Request, res: Response): Promise<any> => {
    try {
        const { success, data, error } = ZodSchemas.CreateUserSchema.safeParse(req.body) as any;
        if (!success) {
            let errorMessage = error.errors
                .map((err: any) => err.message)
                .join(" | ");
            throw new helpers.CustomError(400, errorMessage || 'Required fields are missing!!');
        }

        const { username, email, password } = req.body;
        const user = await User.create({ username, email, password });
        console.log('((((((((((())))))) USER CREATED VALUE :- ', user);
        return res.status(201).json(helpers.sendResponse(true, 'User created successfully', { user }));
    } catch (error: any) {
        if (!error.statusCode)
            console.error('Error creating user:', error);
        return res.status(500).json(helpers.sendResponse(false, error?.statusCode != null ? error.message : 'Internal Server Error'));
    }
}

const signin = async (req: Request, res: Response): Promise<any> => {
    try {
        const { success, data, error } = ZodSchemas.SigninSchema.safeParse(req.body);
        if (!success) {
            let errorMessages = error.errors
                .map((err: any) => err.message)
                .join(" | ");
            throw new helpers.CustomError(400, errorMessages || "Required fields are missing!!");
        }
        const { email, password } = req.body;
        if (!email || !password)
            throw new helpers.CustomError(400, "Missing required fields: email, password");

        const user = await User.findByEmail(email);
        if (!user || !(await user.comparePassword(password)))
            throw new helpers.CustomError(401, "Invalid credentials");

        //now sign the jwt token and store it in a cookie
        const token = jwt.sign(
            { id: user.id },
            commonConfig.jwtSecret,
            {
                expiresIn: parseInt(commonConfig.expiresIn) || '1h', // Ensure expiresIn is a valid string or number
                algorithm: commonConfig.jwtAlgorithm || 'HS256',
                audience: commonConfig.jwtAudience || 'http://localhost:3000',
                issuer: commonConfig.jwtIssuer || 'http://localhost:3000',
                subject: 'Authentication',
                jwtid: crypto.randomUUID(), // ✅ generate a unique JWT ID
            } as jwt.SignOptions // Explicitly cast to SignOptions
        );

        res.cookie('authentication', token, {
            httpOnly: true,
            secure: commonConfig.environment === 'production', // Set to true in production
            sameSite: 'strict', // Adjust as needed
            maxAge: parseInt(commonConfig.expiresIn) * 1000, // 1 hour
        });



        return res.status(200).json(helpers.sendResponse(true, 'User signed in successfully', { user }));
    } catch (error: any) {
        if (!error.statusCode)
            console.error('Error signing in user:', error);
        return res.status(500).json(helpers.sendResponse(false, error?.statusCode != null ? error.message : 'Internal Server Error'));
    }
}

export { signup, signin }