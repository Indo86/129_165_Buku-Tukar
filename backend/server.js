import 'dotenv/config'
import express from "express";
import './models/index.js';           // ❗ register semua association
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { sequelize } from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import exchangeRoutes from './routes/exchangeRoutes.js';
import exchangeHitoryRoutes from './routes/exchangeHitoryRoutes.js'
import protectedRoutes from './routes/protectedRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5010;

app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/exchanges/history', exchangeHitoryRoutes);
app.use('/api', protectedRoutes);

// app.get('/', (_req, res) => res.send('Welcome API'));

(async () => {
  try {
    await db.sync();
    console.log("Database synced!");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("DB Sync Error:", error);
  }
})();