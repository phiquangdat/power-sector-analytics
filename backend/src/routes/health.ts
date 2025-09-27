import { Router, Request, Response } from 'express';
import { isDatabaseConnected } from '../config/database';
import { HealthCheckResponse } from '../types';

const router = Router();

/**
 * Health check endpoint
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const dbConnected = await isDatabaseConnected();
    const uptime = process.uptime();
    
    const response: HealthCheckResponse = {
      status: dbConnected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(uptime),
      version: process.env.npm_package_version || '1.0.0',
      database: dbConnected ? 'connected' : 'disconnected'
    };

    const statusCode = dbConnected ? 200 : 503;
    res.status(statusCode).json(response);
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      version: process.env.npm_package_version || '1.0.0',
      database: 'disconnected'
    });
  }
});

export default router;
