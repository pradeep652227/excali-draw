import express from 'express';
import cookieParser from 'cookie-parser';

/* Internal Imports */
import config from './config';
import * as routes from './routes';
import * as middlewares from './middlewares';

const app = express();
const port = config.port;
app.use(express.json());
app.use(cookieParser());

/*Middlewares*/
app.use(middlewares.apiLogger);

/*Routes*/
app.use('/api/v1/user', routes.userRouter);
app.use('/api/v1/room', routes.roomRouter);
app.use('/api/v1/chat', routes.chatRouter);

/*Middlewares*/
app.use(middlewares.errorHandler);

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1); // Exit the process with failure
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1); // Exit the process with failure
});
app.listen(port, () => {
    console.log(`HTTP server listening on port ${port}`);
});