import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth';

import { getJobs, createJob, applyForJob, updateApplicantStatus } from '../controllers/recruitmentController';

const router = Router();

router.use(authenticate);

router.get('/jobs', getJobs);
router.post('/jobs', authorizeRoles('SuperAdmin', 'Admin', 'HR'), createJob);
router.post('/jobs/:id/apply', applyForJob);
router.patch('/jobs/:id/applicants/:applicantId', authorizeRoles('SuperAdmin', 'Admin', 'HR'), updateApplicantStatus);

export default router;
