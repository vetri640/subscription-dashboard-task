import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a plan name'],
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
        },
        features: {
            type: [String],
            required: true,
        },
        duration: {
            type: Number, // in days
            required: [true, 'Please add duration in days'],
        },
        stripePriceId: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Plan = mongoose.model('Plan', planSchema);
export default Plan;
