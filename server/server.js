require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const menuRoutes = require('./routes/menuRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ success: true, message: 'CaterBliss API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/menu', menuRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorMiddleware);

const ensureAdminUser = async () => {
  try {
    const email = 'admin@catering.com';
    const existing = await User.findOne({ email });

    if (existing) {
      existing.fullName = existing.fullName || 'CaterBliss Admin';
      existing.primaryEventLocation = existing.primaryEventLocation || 'Hyderabad';
      existing.preferredCity = existing.preferredCity || 'Hyderabad';
      existing.address = existing.address || 'CaterBliss Head Office';
      existing.functionAddress = existing.functionAddress || 'CaterBliss Head Office';
      existing.role = 'admin';
      existing.isVerified = true;
      existing.password = 'Admin@123';
      await existing.save();
      return;
    }

    await User.create({
      fullName: 'CaterBliss Admin',
      email,
      phone: '9999999999',
      mobile: '9999999999',
      password: 'Admin@123',
      address: 'CaterBliss Head Office',
      functionAddress: 'CaterBliss Head Office',
      primaryEventLocation: 'Hyderabad',
      preferredCity: 'Hyderabad',
      role: 'admin',
      isVerified: true
    });
  } catch (error) {
    console.error(`Admin user setup skipped: ${error.message}`);
  }
};

if (require.main === module) {
  connectDB().then(async () => {
    await ensureAdminUser();
    const server = app.listen(PORT, () => {
      console.log(`CaterBliss API running on http://localhost:${PORT}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the old server process or set PORT to another value in .env.`);
        process.exit(1);
      }

      throw error;
    });
  }).catch((error) => {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = app;
