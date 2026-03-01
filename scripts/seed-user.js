// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// require('dotenv').config();
// const User = require('../models/user.model');

// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense_db';

// (async function() {
//   try {
//     await mongoose.connect(MONGODB_URI);
//     console.log('Connected to MongoDB for seeding');

//     const existing = await User.findOne({ userName: 'admin' });
//     if (existing) {
//       console.log('Demo user already exists');
//       process.exit(0);
//     }

//     const hashed = await bcrypt.hash('admin123', 10);
//     const u = await User.create({
//       userName: 'admin',
//       emailAddress: 'admin@example.com',
//       password: hashed,
//       mobileNo: '0000000000',
//     });
//     console.log('Created demo user:', u.userName);
//     process.exit(0);
//   } catch (err) {
//     console.error('Seeding error', err);
//     process.exit(1);
//   }
// })();
