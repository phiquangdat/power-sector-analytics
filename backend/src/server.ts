import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import healthRoutes from './routes/health';
import apiRoutes from './routes/api';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { setupSwagger } from "./config/swagger";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/health', healthRoutes);
app.use('/api', apiRoutes);

// Swagger documentation
setupSwagger(app);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Sustainability Intelligence Dashboard API",
    version: process.env.npm_package_version || "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/health",
      co2: "/api/co2",
      mix: "/api/mix",
      netzero: "/api/netzero",
      dashboard: "/api/dashboard",
      co2Latest: "/api/co2/latest",
      mixLatest: "/api/mix/latest",
      apiDocs: "/api-docs",
      apiSpec: "/api-docs.json",
    },
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Sustainability Backend API running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
  console.log(`📈 Available endpoints:`);
  console.log(`   - Health: http://localhost:${PORT}/health`);
  console.log(`   - CO2 Data: http://localhost:${PORT}/api/co2`);
  console.log(`   - Mix Data: http://localhost:${PORT}/api/mix`);
  console.log(`   - Net Zero: http://localhost:${PORT}/api/netzero`);
  console.log(`   - Dashboard: http://localhost:${PORT}/api/dashboard`);
  console.log(`   - API Docs: http://localhost:${PORT}/api-docs`);
  console.log(`   - API Spec: http://localhost:${PORT}/api-docs.json`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
