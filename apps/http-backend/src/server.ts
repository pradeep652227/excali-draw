import express from 'express';

import config from './config';
const app = express();
const port = config.port;

app.listen(port, () => {
    console.log(`HTTP server listening on port ${port}`);
});