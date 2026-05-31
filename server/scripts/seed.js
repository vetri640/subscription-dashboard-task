import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Plan from '../models/Plan.js';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const plans = [
    {
        name: 'Basic Plan',
        price: 199,
        features: ['1 User', 'Basic Support', '10GB Storage'],
        duration: 30, // 30 days
    },
    {
        name: 'Pro Plan',
        price: 499,
        features: ['5 Users', 'Priority Support', '100GB Storage', 'Analytics'],
        duration: 90, // 90 days
    },
    {
        name: 'Enterprise Plan',
        price: 999,
        features: ['Unlimited Users', '24/7 Dedicated Support', 'Unlimited Storage', 'Custom Integrations'],
        duration: 365, // 365 days
    },
];

const importData = async () => {
    try {
        await connectDB();

        await Plan.deleteMany();
        await User.deleteMany();
        await Subscription.deleteMany();

        await Plan.insertMany(plans);

        // Create an admin user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
        });

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    // destroyData();
} else {
    importData();
}
