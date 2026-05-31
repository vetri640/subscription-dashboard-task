import express from 'express';
import { getAllSubscriptions, getDashboardStats } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/subscriptions', protect, admin, getAllSubscriptions);
router.get('/stats', protect, admin, getDashboardStats);

export default router;
