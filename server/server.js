import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { projectRoutes } from './routes/projects.js';
import { userRoutes } from './routes/users.js';
import { investmentRoutes } from './routes/investments.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Configure rate limiting with proper IP handling
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: true // Enable if you're behind a reverse proxy
});

app.set('trust proxy', 1); // Trust first proxy
app.use(limiter);

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/investments', investmentRoutes);

// Error handling
app.use(errorHandler);

// MongoDB connection with retry logic
const connectDB = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/bitchanga', {
        serverSelectionTimeoutMS: 5000,
        retryWrites: true
      });
      console.log('Connected to MongoDB');
      return;
    } catch (err) {
      if (i === retries - 1) {
        console.error('MongoDB connection failed after retries:', err);
        process.exit(1);
      }
      console.log(`MongoDB connection attempt ${i + 1} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`Bitchanga server running on port ${PORT}`);
});