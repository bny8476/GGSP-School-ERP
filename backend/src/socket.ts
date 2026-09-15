import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

import jwt from 'jsonwebtoken';

let io: SocketIOServer;

export const initSocket = (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: [
        'http://localhost:5173', 
        'http://localhost:3000', 
        'https://schoolerp-livid.vercel.app',
        process.env.FRONTEND_URL || ''
      ].filter(Boolean),
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Socket.IO authentication middleware
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      (socket.handshake.headers?.authorization
        ? socket.handshake.headers.authorization.split(' ')[1]
        : null);

    if (token) {
      try {
        const secret = process.env.JWT_SECRET;
        if (secret) {
          const decoded = jwt.verify(token, secret);
          socket.data.user = decoded;
        }
      } catch (err) {
        console.warn(`Socket connection ${socket.id} auth failed: ${(err as Error).message}`);
      }
    }
    next();
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    // Parents can join a room using their child's ID or their own ID to receive targeted notifications
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
