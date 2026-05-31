import express from 'express';
import {
    createSubscriptionOrder,
    verifyPayment,
    getMySubscription,
    cancelSubscription
} from '../controllers/subscriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/order/:planId', protect, createSubscriptionOrder);
router.post('/verify', protect, verifyPayment);
router.get('/my-subscription', protect, getMySubscription);
router.put('/cancel', protect, cancelSubscription);

export default router;
