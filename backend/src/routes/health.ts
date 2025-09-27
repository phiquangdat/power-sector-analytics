import { Router, Request, Response } from 'express';
import { isDatabaseConnected } from '../config/database';
import { HealthCheckResponse } from '../types';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the current health status of the API server and database connectivity
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy and database is connected
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheckResponse'
 *             example:
 *               status: "healthy"
 *               timestamp: "2024-01-01T00:00:00.000Z"
 *               uptime: 3600
 *               version: "1.0.0"
 *               database: "connected"
 *       503:
 *         description: Server is unhealthy or database is disconnected
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheckResponse'
 *             example:
 *               status: "unhealthy"
 *               timestamp: "2024-01-01T00:00:00.000Z"
 *               uptime: 3600
 *               version: "1.0.0"
 *               database: "disconnected"
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
