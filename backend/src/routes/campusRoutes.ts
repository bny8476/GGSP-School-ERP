import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth';
import { getCampuses, getCampusById, createCampus, updateCampus } from '../controllers/campusController';

const router = Router();

router.use(protect);

router.get('/', getCampuses);
router.get('/:id', getCampusById);
router.post('/', adminOnly, createCampus);
router.put('/:id', adminOnly, updateCampus);

export default router;
