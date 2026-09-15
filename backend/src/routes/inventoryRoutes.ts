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
router.post('/items', authorizeRoles('Super Admin', 'Admin', 'Accountant'), createInventoryItem);
router.patch('/items/:id/stock', authorizeRoles('Super Admin', 'Admin', 'Accountant'), updateStockQuantity);

// Purchase Orders
router.get('/orders', getPurchaseOrders);
router.post('/orders', authorizeRoles('Super Admin', 'Admin', 'Accountant'), createPurchaseOrder);
router.patch('/orders/:id/status', authorizeRoles('Super Admin', 'Admin'), updatePurchaseOrderStatus);

export default router;
