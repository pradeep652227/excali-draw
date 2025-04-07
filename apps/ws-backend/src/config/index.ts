import dotenv from 'dotenv';
dotenv.config();
class Config {
    port: number;
    constructor(){
        this.port = Number(process.env.PORT);
    }
}

const config = new Config();
export default config;