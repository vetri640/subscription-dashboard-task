import Plan from '../models/Plan.js';

// @desc    Get all plans
// @route   GET /api/plans
// @access  Public
export const getPlans = async (req, res, next) => {
    try {
        const plans = await Plan.find({});
        res.json(plans);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single plan
// @route   GET /api/plans/:id
// @access  Public
export const getPlanById = async (req, res, next) => {
    try {
        const plan = await Plan.findById(req.params.id);
        if (plan) {
            res.json(plan);
        } else {
            res.status(404);
            throw new Error('Plan not found');
        }
    } catch (error) {
        next(error);
    }
};
