import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { initSocket } from './services/socketService';
import { apiLimiter } from './middlewares/rateLimiter';

import authRoutes from './routes/auth';
import campaignRoutes from './routes/campaigns';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
initSocket(httpServer);

// Global Middlewares
app.use(cors());
app.use(express.json());

// Apply rate limiting to all requests
app.use(apiLimiter);

// Routes
app.use('/auth', authRoutes);
app.use('/campaigns', campaignRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'campaign-backend' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went broke!' });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
