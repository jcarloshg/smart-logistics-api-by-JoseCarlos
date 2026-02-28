import express from 'express';
import { NetworkRoute } from './presentation/routes/network.route';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Routes
NetworkRoute(app)

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Smart Logistics API' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
