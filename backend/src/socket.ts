import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import env from './config/env';
import logger from './utils/logger';

let io: SocketIOServer;

export interface AuthenticatedSocket extends Socket {
  data: {
    user?: {
      id: string;
      role: string;
      permissions?: string[];
      campusId?: string;
      schoolId?: string;
      parentId?: string;
    };
  };
}

export const initSocket = (httpServer: HttpServer): SocketIOServer => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://ggsp-school-erp.vercel.app',
    'https://schoolerp-livid.vercel.app',
    'https://school-erp-bny2.vercel.app',
    env.CLIENT_URL,
  ].filter(Boolean) as string[];

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const clean = origin.replace(/\/+$/, '').toLowerCase();
        const isMatched = allowedOrigins.some((o) => o && clean === o.replace(/\/+$/, '').toLowerCase());
        if (isMatched || clean.endsWith('.vercel.app')) {
          return callback(null, true);
        }
        return callback(null, true); // Dev resilient
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication Middleware
  io.use((socket: AuthenticatedSocket, next) => {
    const token =
      socket.handshake.auth?.token ||
      (socket.handshake.headers?.authorization
        ? socket.handshake.headers.authorization.split(' ')[1]
        : null) ||
      (socket.handshake.headers?.cookie
        ? socket.handshake.headers.cookie
            .split(';')
            .find((c) => c.trim().startsWith('token='))
            ?.split('=')[1]
        : null);

    if (!token) {
      // Allow unauthenticated connection but mark unauthenticated
      return next();
    }

    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as any;
      if (decoded && decoded.user) {
        socket.data.user = decoded.user;
      }
    } catch (err: any) {
      logger.warn({ socketId: socket.id, error: err.message }, 'Socket authentication failed');
    }
    next();
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    const user = socket.data.user;
    logger.info({ socketId: socket.id, userId: user?.id, role: user?.role }, 'Socket client connected');

    // Auto-join authoritative isolated rooms if authenticated
    if (user && user.id) {
      socket.join(`user:${user.id}`);
      if (user.role) socket.join(`role:${user.role}`);
      if (user.campusId) socket.join(`campus:${user.campusId}`);
      if (user.schoolId) socket.join(`school:${user.schoolId}`);
      if (user.parentId) socket.join(`parent:${user.parentId}`);
    }

    // Room subscription with authorization checks
    socket.on('join_room', (roomId: string) => {
      if (!roomId) return;
      if (!socket.data.user) {
        logger.warn({ socketId: socket.id, roomId }, 'Unauthenticated client blocked from joining room');
        return;
      }

      // Block joining other user's private rooms
      if (roomId.startsWith('user:') && roomId !== `user:${socket.data.user.id}`) {
        logger.warn({ socketId: socket.id, roomId, user: socket.data.user.id }, 'Blocked attempt to join another user private room');
        return;
      }

      socket.join(roomId);
      logger.debug({ socketId: socket.id, roomId }, 'Socket joined room');
    });

    socket.on('leave_room', (roomId: string) => {
      if (roomId) socket.leave(roomId);
    });

    socket.on('disconnect', () => {
      logger.debug({ socketId: socket.id }, 'Socket client disconnected');
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
};

// Safe scoped emission helpers
export const emitToUser = (userId: string, event: string, payload: any): void => {
  try {
    if (io) io.to(`user:${userId}`).emit(event, payload);
  } catch (err) {
    logger.warn({ userId, event }, 'Failed to emit to user socket room');
  }
};

export const emitToRoom = (room: string, event: string, payload: any): void => {
  try {
    if (io) io.to(room).emit(event, payload);
  } catch (err) {
    logger.warn({ room, event }, 'Failed to emit to socket room');
  }
};

export const emitToRole = (role: string, event: string, payload: any): void => {
  try {
    if (io) io.to(`role:${role}`).emit(event, payload);
  } catch (err) {
    logger.warn({ role, event }, 'Failed to emit to role socket room');
  }
};

export const emitToClass = (classId: string, event: string, payload: any): void => {
  try {
    if (io) io.to(`class:${classId}`).emit(event, payload);
  } catch (err) {
    logger.warn({ classId, event }, 'Failed to emit to class socket room');
  }
};

export const broadcastEvent = (event: string, payload: any): void => {
  try {
    if (io) io.emit(event, payload);
  } catch (err) {
    logger.warn({ event }, 'Failed to broadcast socket event');
  }
};
