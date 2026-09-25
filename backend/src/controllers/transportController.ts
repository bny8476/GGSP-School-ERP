import { Request, Response } from 'express';
import TransportRoute from '../models/TransportRoute';
import Student from '../models/Student';

// @desc    Get all transport routes
// @route   GET /api/transport
export const getRoutes = async (req: Request, res: Response) => {
  try {
    const routes = await TransportRoute.find().sort({ routeName: 1 });
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Create a transport route
// @route   POST /api/transport
export const createRoute = async (req: Request, res: Response) => {
  try {
    const { routeName, vehicleNumber, driverName, driverPhone, stops } = req.body;
    const newRoute = await TransportRoute.create({ routeName, vehicleNumber, driverName, driverPhone, stops });
    res.status(201).json(newRoute);
  } catch (error) {
    res.status(400).json({ message: 'Invalid route data', error });
  }
};

// @desc    Update a transport route
// @route   PUT /api/transport/:id
export const updateRoute = async (req: Request, res: Response) => {
  try {
    const { routeName, vehicleNumber, driverName, driverPhone, stops } = req.body;
    const allowedUpdates: Record<string, any> = {};
    if (routeName !== undefined) allowedUpdates.routeName = routeName;
    if (vehicleNumber !== undefined) allowedUpdates.vehicleNumber = vehicleNumber;
    if (driverName !== undefined) allowedUpdates.driverName = driverName;
    if (driverPhone !== undefined) allowedUpdates.driverPhone = driverPhone;
    if (stops !== undefined) allowedUpdates.stops = stops;

    const route = await TransportRoute.findByIdAndUpdate(req.params.id, allowedUpdates, { new: true, runValidators: true });
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.json(route);
  } catch (error) {
    res.status(400).json({ message: 'Error updating route', error });
  }
};

// @desc    Delete a transport route
// @route   DELETE /api/transport/:id
export const deleteRoute = async (req: Request, res: Response) => {
  try {
    const route = await TransportRoute.findByIdAndDelete(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.json({ message: 'Route removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Get students for a specific route
// @route   GET /api/transport/:id/students
export const getRouteStudents = async (req: Request, res: Response) => {
  try {
    const students = await Student.find({ transportId: req.params.id }).select('firstName lastName transportStopId');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
