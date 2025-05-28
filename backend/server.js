import 'dotenv/config';
import express from "express";
import './models/index.js';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { sequelize } from './models/index.js'; 
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import exchangeRoutes from './routes/exchangeRoutes.js';
import exchangeHitoryRoutes from './routes/exchangeHitoryRoutes.js';
import protectedRoutes from './routes/protectedRoutes.js';

const app = express();
const port = process.env.PORT || 5010;

app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/exchanges/history', exchangeHitoryRoutes);
app.use('/api', protectedRoutes);

(async () => {
  try {
    await sequelize.authenticate(); // tambahan validasi koneksi
    console.log("Connected to DB");

    await sequelize.sync();
    console.log("Database synced!");

    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${port}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1); // biar container exit kalau gagal
  }
})();
