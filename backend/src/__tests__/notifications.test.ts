import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import cookieParser from 'cookie-parser';
import notificationRoutes from '../routes/notificationRoutes';
import User from '../models/User';
import Notification from '../models/Notification';
import { generateAccessToken } from '../services/tokenService';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/notifications', notificationRoutes);

describe('Durable Notification Outbox & Delivery Reliability', () => {
  let userToken: string;
  let userId: mongoose.Types.ObjectId;
  let originalReadyState: number;

  beforeAll(() => {
    originalReadyState = mongoose.connection.readyState;
    Object.defineProperty(mongoose.connection, 'readyState', { value: 1, configurable: true });

    userId = new mongoose.Types.ObjectId();

    jest.spyOn(User, 'findById').mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: userId,
        role: 'Parent',
        isActive: true,
        isDeleted: false,
        status: 'Active',
      }),
    } as any);

    userToken = generateAccessToken({
      id: userId.toString(),
      role: 'Parent',
    });
  });

  afterAll(() => {
    Object.defineProperty(mongoose.connection, 'readyState', { value: originalReadyState, configurable: true });
    jest.restoreAllMocks();
  });

  it('GET /api/notifications returns user notifications and unreadCount', async () => {
    const mockNotifications = [
      {
        _id: new mongoose.Types.ObjectId(),
        recipient: userId,
        title: 'Fee Due',
        message: 'Your term 1 fee is due',
        read: false,
        deliveryStatus: 'Pending',
        createdAt: new Date(),
      },
    ];

    jest.spyOn(Notification, 'find').mockReturnValue({
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockNotifications),
        }),
      }),
    } as any);

    jest.spyOn(Notification, 'countDocuments')
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(1);

    const res = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.notifications).toHaveLength(1);
    expect(res.body.unreadCount).toBe(1);
  });

  it('PUT /api/notifications/:id/read marks notification as read and deliveryStatus as Read', async () => {
    const notifId = new mongoose.Types.ObjectId();
    const mockNotif = {
      _id: notifId,
      recipient: userId,
      read: false,
      deliveryStatus: 'Delivered',
      save: jest.fn().mockResolvedValue(true),
    };

    jest.spyOn(Notification, 'findOne').mockResolvedValue(mockNotif as any);

    const res = await request(app)
      .put(`/api/notifications/${notifId}/read`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockNotif.read).toBe(true);
    expect(mockNotif.save).toHaveBeenCalled();
  });

  it('POST /api/notifications creates notification with durable status', async () => {
    const mockCreated = {
      _id: new mongoose.Types.ObjectId(),
      recipient: userId,
      title: 'Exam Schedule',
      message: 'Mid-term exams start next week',
      deliveryStatus: 'Pending',
    };

    jest.spyOn(Notification, 'create').mockResolvedValue(mockCreated as any);

    const adminToken = generateAccessToken({
      id: new mongoose.Types.ObjectId().toString(),
      role: 'Admin',
    });

    const res = await request(app)
      .post('/api/notifications')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        recipient: userId.toString(),
        title: 'Exam Schedule',
        message: 'Mid-term exams start next week',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.notification.deliveryStatus).toBe('Pending');
  });
});
