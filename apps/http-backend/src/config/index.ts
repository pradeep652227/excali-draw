import path from 'path';
import dotenv from 'dotenv';

// dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

class Config {
    port: number;
    constructor() {
        this.port = Number(process.env.PORT);
    }
}

const config = new Config();
export default config;