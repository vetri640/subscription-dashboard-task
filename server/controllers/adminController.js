import Subscription from '../models/Subscription.js';
import User from '../models/User.js';

// @desc    Get all subscriptions for admin
// @route   GET /api/admin/subscriptions
// @access  Private/Admin
export const getAllSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find({})
            .populate('user', 'name email')
            .populate('plan', 'name price');
        
        res.json(subscriptions);
    } catch (error) {
        next(error);
    }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });
        
        // Simple mock revenue calculation for dashboard
        const subscriptions = await Subscription.find({ status: 'active' }).populate('plan');
        const mrr = subscriptions.reduce((acc, sub) => acc + (sub.plan?.price || 0), 0);

        res.json({
            totalUsers,
            activeSubscriptions,
            mrr
        });
    } catch (error) {
        next(error);
    }
};
