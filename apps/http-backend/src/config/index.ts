import path from 'path';
import dotenv from 'dotenv';

// dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

console.log(`🚀 ~ index.ts:19 ~ Config ~ constructor ~ process.env:`, process.env)
class Config {
    port: number;
    jwtSecret: string;
    expiresIn: string;
    jwtAlgorithm: string;
    jwtAudience: string;
    jwtIssuer: string;
    environment : string;
    constructor() {
        this.port = Number(process.env.PORT);
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