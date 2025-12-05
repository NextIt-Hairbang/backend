import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@wigstore.com' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const adminUser = await User.create({
            name: 'Admin',
            email: 'admin@wigstore.com',
            password: 'Admin@123', // Change this to a secure password
            isAdmin: true
        });

        console.log('✓ Admin user created successfully');
        console.log(`Email: ${adminUser.email}`);
        console.log(`Name: ${adminUser.name}`);
        console.log(`Admin: ${adminUser.isAdmin}`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
