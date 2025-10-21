import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';   // ✅ import cors
import { startEmailSync } from './services/imapService';
import emailRoutes from './routes/emailRoutes';
import accountRoutes from './routes/accountRoutes';
import repliesRouter from './routes/replies';
import { initEmailIndex } from './services/emailStorage';

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', // your frontend URL
  credentials: true,
}));

const PORT = process.env.PORT || 5000;

// Health check
app.get('/', (req, res) => {
  res.send('📨 Onebox Email Backend is running...');
});

app.use('/accounts', accountRoutes);

// Email routes
app.use('/emails', emailRoutes);

app.use('/suggest', repliesRouter);

app.listen(PORT, async () => {
  console.log(`🚀 Server started on port ${PORT}`);

  try {
    await initEmailIndex();
    const accounts = [
      { email: process.env.EMAIL_1!, password: process.env.EMAIL_1_PASSWORD! },
      { email: process.env.EMAIL_2!, password: process.env.EMAIL_2_PASSWORD! },
    ];

    await startEmailSync(accounts);
  } catch (err) {
    console.error('❌ Error initializing server:', err);
  }
});