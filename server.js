import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import connectDB from './config/dbConnection.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import imageAnalyzeRoutes from './routes/imageAnalyze.js';
import conversationRoutes from './routes/conversationRoutes.js';
import authValidation from './middleware/auth.js';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT; 
 
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'https://chatbot-frontend-beryl-delta.vercel.app'], 
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/chat',authValidation, chatRoutes);
app.use('/api/image',authValidation, imageAnalyzeRoutes);
app.use('/api/conversations', authValidation, conversationRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});