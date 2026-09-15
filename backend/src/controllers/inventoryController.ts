import { Request, Response, NextFunction } from 'express';
import InventoryItem from '../models/InventoryItem';
import PurchaseOrder from '../models/PurchaseOrder';
import { ApiError } from '../utils/ApiError';

// --- INVENTORY ---
export const getInventoryItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, status } = req.query;
    const filter: any = {};
    if (category) filter.category = String(category);
    if (status) filter.status = String(status);

    const items = await InventoryItem.find(filter).sort({ itemName: 1 });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
};

export const createInventoryItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await InventoryItem.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const updateStockQuantity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const item = await InventoryItem.findById(id);
    if (!item) throw new ApiError(404, 'Inventory item not found');

    item.quantity = quantity;
    await item.save();
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// --- PURCHASE ORDERS ---
export const getPurchaseOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orders = await PurchaseOrder.find()
      .populate('requestedBy', 'name role')
      .populate('approvedBy', 'name role')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

export const createPurchaseOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user?._id;
    const poNumber = `PO-${Date.now().toString().slice(-6)}`;
    const totalCost = (req.body.items || []).reduce(
      (sum: number, item: any) => sum + (item.quantity * item.estimatedPrice || 0),
      0
    );

    const po = await PurchaseOrder.create({
      ...req.body,
      poNumber,
      totalCost,
      requestedBy: userId,
    });

    res.status(201).json({ success: true, data: po });
  } catch (error) {
    next(error);
  }
};

export const updatePurchaseOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = (req as any).user?._id;

    const po = await PurchaseOrder.findById(id);
    if (!po) throw new ApiError(404, 'Purchase Order not found');

    po.status = status;
    if (status === 'Approved') po.approvedBy = userId;
    await po.save();

    res.json({ success: true, data: po });
  } catch (error) {
    next(error);
  }
};
