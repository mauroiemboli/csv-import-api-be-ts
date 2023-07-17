import { Server as SocketIoServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import ProductService from '@Services/ProductService';

let io: SocketIoServer;
const userSockets = new Map<string, any>();

export const initializeSocketIo = (httpServer: HttpServer) => {
    io = new SocketIoServer(httpServer, { cors: { origin: '*' } });

    const namespace = io.of('/socket-server');

    namespace.on('connection', (socket) => {
        const clientAddress = socket.handshake.address;
        console.log(`a user connected from ${clientAddress}`);

        socket.on('disconnect', () => {
            console.log('user disconnected');
            userSockets.forEach((value, key) => {
                if (value === socket) {
                    userSockets.delete(key);
                }
            });
        });

        socket.on('getProgress', (userId) => {
            userSockets.set(userId, socket);
        });
    });

    return io;
};

export const getIo = () => io;
export const getUserSocket = (userId: string) => userSockets.get(userId);