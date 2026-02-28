import express from 'express';
import { NetworkRoute } from './presentation/routes/network.route';
import { connectDatabase } from '@/application/shared/infrastructure/postgresql';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Routes
NetworkRoute(app)

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Smart Logistics API' });
});

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
