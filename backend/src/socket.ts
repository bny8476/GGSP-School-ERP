import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

import jwt from 'jsonwebtoken';

let io: SocketIOServer;

export const initSocket = (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const clean = origin.replace(/\/+$/, '').toLowerCase();
        const allowed = [
          'http://localhost:5173',
          'http://localhost:3000',
          'http://127.0.0.1:3000',
          'https://ggsp-school-erp.vercel.app',
          'https://schoolerp-livid.vercel.app',
          'https://school-erp-bny2.vercel.app',
          process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/+$/, '').toLowerCase() : '',
        ].filter(Boolean);
        if (allowed.includes(clean) || clean.endsWith('.vercel.app')) {
          return callback(null, true);
        }
        return callback(null, true); // Permissive in socket handshake for seamless connections
      },
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
    
    // Authenticated clients can join rooms for targeted notifications
    socket.on('join_room', (roomId) => {
      if (!socket.data.user) {
        console.warn(`Unauthenticated socket ${socket.id} attempted to join room ${roomId}`);
        return;
      }
      socket.join(roomId);
      console.log(`Socket ${socket.id} (user ${socket.data.user?.user?.id || 'unknown'}) joined room ${roomId}`);
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
