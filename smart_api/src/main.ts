import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { NetworkRoute } from '@/presentation/routes/network.route';
import { RouteRoute } from '@/presentation/routes/route.route';
import { connectDatabase } from '@/application/shared/infrastructure/postgresql';
import { ENVIROMENT_VARIABLES } from '@/application/shared/infrastructure/EnviromentVariables';
import { swaggerSpec } from '@/presentation/swagger';

const app = express();
const PORT = parseInt(ENVIROMENT_VARIABLES.PORT);
const NODE_ENV = ENVIROMENT_VARIABLES.NODE_ENV;
const ALLOWED_ORIGINS = ENVIROMENT_VARIABLES.ALLOWED_ORIGINS;

// ─────────────────────────────────────
// Middleware
// ─────────────────────────────────────
app.use(express.json());

// CORS Configuration
app.use((req, res, next) => {
  const origins = ALLOWED_ORIGINS.split(',').map(o => o.trim());
  const origin = req.headers.origin || '';

  if (origins.includes(origin) || NODE_ENV === 'development') {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// ─────────────────────────────────────
// Routes
// ─────────────────────────────────────
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs.json', (_: express.Request, res: express.Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

NetworkRoute(app);
RouteRoute(app);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Smart Logistics API' });
});

// ─────────────────────────────────────
// Server Startup
// ─────────────────────────────────────
const startServer = async () => {
  try {
    console.log('─────────────────────────────────────');
    console.log('🚀 Smart Logistics API - Starting');
    console.log('─────────────────────────────────────');
    console.log(`Environment: ${NODE_ENV}`);
    console.log(`Port: ${PORT}`);
    console.log(`CORS Origins: ${ALLOWED_ORIGINS}`);
    console.log('─────────────────────────────────────');

    await connectDatabase();
    console.log('✅ Database connected');

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log('─────────────────────────────────────');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
