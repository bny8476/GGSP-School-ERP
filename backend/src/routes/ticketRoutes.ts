import express from 'express';
import { getTickets, createTicket, addTicketResponse, updateTicketStatus } from '../controllers/ticketController';
import { protect, authorize } from '../middleware/auth';
import { logAuditEvent } from '../middleware/auditMiddleware';

const router = express.Router();

router.use(protect);

const staffAuth = authorize('SuperAdmin', 'Admin', 'Principal', 'Receptionist', 'Teacher');

router.route('/')
  .get(getTickets)
  .post(logAuditEvent('Support', 'CREATE_TICKET'), createTicket);

router.route('/:id/response')
  .post(logAuditEvent('Support', 'RESPOND_TICKET'), addTicketResponse);

router.route('/:id/status')
  .put(staffAuth, logAuditEvent('Support', 'UPDATE_TICKET_STATUS'), updateTicketStatus);

export default router;
