// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { sequelize } from './models/index.js';       // otomatis load associations
import authRoutes          from './routes/authRoutes.js';
import userRoutes          from './routes/userRoutes.js';
import bookRoutes          from './routes/bookRoutes.js';
import exchangeRoutes      from './routes/exchangeRoutes.js';
import exchangeHistoryRoutes from './routes/exchangeHistoryRoutes.js';
import protectedRoutes     from './routes/protectedRoutes.js';

const app = express();
const PORT = process.env.PORT || 5010;

// middleware
app.use(cookieParser());
app.use(cors({
  origin:  process.env.CLIENT_URL || true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// healthcheck
app.get('/health', (_req, res) => res.status(200).send('OK'));

// mount routes
app.use('/api/auth',                authRoutes);
app.use('/api/users',               userRoutes);
app.use('/api/books',               bookRoutes);
app.use('/api/exchanges/history',   exchangeHistoryRoutes);
app.use('/api/exchanges',           exchangeRoutes);
app.use('/api/protected',           protectedRoutes);

// 404 handler
app.use((_, res) => {
  res.status(404).json({ status: 'Error', message: 'Route not found' });
});

// global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    status: 'Error',
    message: err.message || 'Internal server error'
  });
});

// bootstrap
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to DB');
    await sequelize.sync();
    console.log('✅ Database synced');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server listening on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();
