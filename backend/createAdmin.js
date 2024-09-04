require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust path to User model based on your project structure

const mongoURI = process.env.MONGO_URI;

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'tejasmore452@gmail.com' });
    if (existingAdmin) {
      console.log('Admin user already exists.');
      return;
    }

    // Create a new admin user
    const adminUser = new User({
      name: 'Admin',
      email: 'tejasmore452@gmail.com',
      password: 'Tejas@216', // Ensure this is hashed in your User model schema
      isAdmin: true,
    });

    // Save admin user to the database
    await adminUser.save();
    console.log('Admin user created successfully.');

    // Close the database connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating admin user:', error);
    mongoose.connection.close();
  }
};

createAdmin();
