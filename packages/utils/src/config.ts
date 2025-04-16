import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

class Config {
    jwtSecret: string;
    expiresIn: string;
    jwtAlgorithm: string;
    jwtAudience: string;
    jwtIssuer: string;
    environment: string;
    constructor() {
        this.jwtSecret = String(process.env.JWT_SECRET);
        this.expiresIn = String(process.env.JWT_EXPIRES_IN);
        this.jwtAlgorithm = String(process.env.JWT_ALGORITHM);
        this.jwtAudience = String(process.env.JWT_AUDIENCE);
        this.jwtIssuer = String(process.env.JWT_ISSUER);
        this.environment = String(process.env.ENVIRONMENT);
    }
}

const config = new Config();
export default config;