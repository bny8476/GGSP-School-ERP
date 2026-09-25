import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth';

import {
  getInventoryItems,
  createInventoryItem,
  updateStockQuantity,
  getPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrderStatus,
} from '../controllers/inventoryController';

const router = Router();

router.use(authenticate);

// Inventory Items
router.get('/items', getInventoryItems);
router.post('/items', authorizeRoles('SuperAdmin', 'Admin', 'Accountant'), createInventoryItem);
router.patch('/items/:id/stock', authorizeRoles('SuperAdmin', 'Admin', 'Accountant'), updateStockQuantity);

// Purchase Orders
router.get('/orders', getPurchaseOrders);
router.post('/orders', authorizeRoles('SuperAdmin', 'Admin', 'Accountant'), createPurchaseOrder);
router.patch('/orders/:id/status', authorizeRoles('SuperAdmin', 'Admin'), updatePurchaseOrderStatus);

export default router;
