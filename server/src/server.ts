import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app';
import { connectDB } from './config/db';
import { initSocket } from './sockets/socketManager';
import { startGenerationWorker } from './workers/generationWorker';
import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists relative to server root
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
console.log(`[Server] Uploads directory initialized at: ${uploadsDir}`);

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Start Server
const startServer = async () => {
  await connectDB();
  
  // Start Redis Worker
  startGenerationWorker();
  console.log('[Server] Worker initialized');

  server.listen(PORT, () => {
    console.log(`[Server] Server running on port ${PORT}`);
  });
};

startServer();
