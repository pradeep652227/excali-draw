import path from 'path';
import dotenv from 'dotenv';

// dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

class Config {
    port: number;
    corsOrigin: string | undefined;
    constructor() {
        this.port = Number(process.env.PORT);
        this.corsOrigin = process.env.CORS_ORIGIN;
    }
}

const config = new Config();
export default config;