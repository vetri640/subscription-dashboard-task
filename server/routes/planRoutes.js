import express from 'express';
import { getPlans, getPlanById } from '../controllers/planController.js';

const router = express.Router();

router.route('/').get(getPlans);
router.route('/:id').get(getPlanById);

export default router;
