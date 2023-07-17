import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'http';
import { errorHandler } from './errors/errorHandler';
import { initializeDatabase } from '@Config/initializers';
//Swagger
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '@Config/swagger';

import routes from './routes';
import { initializeSocketIo } from '@Config/socket';

// Load environment variables
dotenv.config();

// Initialize Database
initializeDatabase();

export const app = express();

//Swagger initialization
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', routes);

// Error handling middleware
app.use(errorHandler);

const httpServer = new Server(app);

// Initialize Socket.io
initializeSocketIo(httpServer);

// Starting the server
const port = process.env.PORT || 5000;
httpServer.listen(port, () => {
    const address = httpServer.address();
    const host = typeof address === 'string' ? address : `http://localhost:${address?.port}`;
    console.log(`Server started on ${host}`);
    console.log(`Socket.IO server is running at ${host}/socket-server`);
});
