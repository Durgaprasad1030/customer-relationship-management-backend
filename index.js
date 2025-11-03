// backend/index.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 1. Import the Enquiry model
const Enquiry = require('./models/Enquiry');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 2. Create a function to seed data ONLY IF the DB is empty
const seedDatabaseOnStartup = async () => {
  try {
    const count = await Enquiry.countDocuments();
    if (count === 0) {
      console.log('Database is empty. Seeding sample data...');
      
      const sampleEnquiries = [
        {
          name: 'Alice Smith',
          email: 'alice@example.com',
          courseInterest: 'Full-Stack Web Development',
          status: 'public',
        },
        {
          name: 'Bob Johnson',
          email: 'bob@example.com',
          courseInterest: 'Data Science',
          status: 'public',
        },
        {
          name: 'Charlie Brown',
          email: 'charlie@example.com',
          courseInterest: 'UX/UI Design',
          status: 'public',
        },
      ];
      
      await Enquiry.insertMany(sampleEnquiries);
      console.log('Sample data successfully seeded!');
    } else {
      console.log('Database already contains data. Skipping seed.');
    }
  } catch (err) {
    console.error('Error during database check/seed:', err);
  }
};

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected...');
    // 3. Call the function AFTER the connection is successful
    seedDatabaseOnStartup();
  })
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enquiries', require('./routes/enquiries'));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));