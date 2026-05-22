import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import assignmentRoutes from './routes/assignmentRoutes';
import path from 'path';

const app = express();

// Security & Middlewares
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Assets - Consistent mapping to server/uploads
const uploadsPath = path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));
console.log(`[Static] Serving uploads from: ${uploadsPath}`);

// Healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/assignments', assignmentRoutes);

// Centralized Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Error Middleware]', err.stack);
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: statusCode,
      timestamp: new Date().toISOString()
    }
  });
});

export default app;
