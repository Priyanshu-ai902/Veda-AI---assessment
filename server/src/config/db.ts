import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/assignment-gen';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    
    // Log if connected to Atlas or Local
    if (uri.includes('mongodb+srv')) {
      console.log('[Database] Running on MongoDB Atlas (Production Mode)');
    } else {
      console.log('[Database] Running on Local MongoDB (Development Mode)');
    }

  } catch (error) {
    console.error(`[Database] Connection Error: ${(error as Error).message}`);
    process.exit(1);
  }
};
