import { Router, Request, Response } from 'express';
import { DataService } from '../services/dataService';
import { ApiResponse, ErrorResponse } from '../types';

const router = Router();

/**
 * @swagger
 * /api/co2:
 *   get:
 *     summary: Get CO2 intensity data
 *     description: Retrieves historical CO2 intensity measurements in grams per kilowatt-hour
 *     tags: [CO2 Data]
 *     parameters:
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: Successfully retrieved CO2 intensity data
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Co2Row'
 *             example:
 *               success: true
 *               data:
 *                 - timestamp: "2024-01-01T00:00:00.000Z"
 *                   co2_intensity_g_per_kwh: 245.67
 *                 - timestamp: "2024-01-01T00:15:00.000Z"
 *                   co2_intensity_g_per_kwh: 238.45
 *               timestamp: "2024-01-01T00:00:00.000Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/co2', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 96;
    const data = await DataService.fetchCo2Data(limit);
    
    const response: ApiResponse<typeof data> = {
      success: true,
      data,
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error in CO2 endpoint:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      path: req.path
    };
    res.status(500).json(errorResponse);
  }
});

/**
 * @swagger
 * /api/mix:
 *   get:
 *     summary: Get generation mix data
 *     description: Retrieves historical energy generation mix data including renewable share percentages
 *     tags: [Generation Mix]
 *     parameters:
 *       - $ref: '#/components/parameters/LimitParam'
 *     responses:
 *       200:
 *         description: Successfully retrieved generation mix data
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MixRow'
 *             example:
 *               success: true
 *               data:
 *                 - timestamp: "2024-01-01T00:00:00.000Z"
 *                   hydro_mw: 1250.5
 *                   wind_mw: 890.3
 *                   solar_mw: 456.7
 *                   nuclear_mw: 2100.0
 *                   fossil_mw: 1200.8
 *                   renewable_share_pct: 45.2
 *               timestamp: "2024-01-01T00:00:00.000Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/mix', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 96;
    const data = await DataService.fetchMixData(limit);
    
    const response: ApiResponse<typeof data> = {
      success: true,
      data,
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error in mix endpoint:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      path: req.path
    };
    res.status(500).json(errorResponse);
  }
});

/**
 * @swagger
 * /api/netzero:
 *   get:
 *     summary: Get net-zero alignment data
 *     description: Retrieves net-zero alignment data showing progress towards emission reduction targets
 *     tags: [Net-Zero]
 *     parameters:
 *       - $ref: '#/components/parameters/NetZeroLimitParam'
 *     responses:
 *       200:
 *         description: Successfully retrieved net-zero alignment data
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/NetZeroRow'
 *             example:
 *               success: true
 *               data:
 *                 - year: 2024
 *                   actual_emissions_mt: 125.5
 *                   target_emissions_mt: 100.0
 *                   alignment_pct: 79.7
 *                 - year: 2025
 *                   actual_emissions_mt: 95.2
 *                   target_emissions_mt: 80.0
 *                   alignment_pct: 84.0
 *               timestamp: "2024-01-01T00:00:00.000Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/netzero', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const data = await DataService.fetchNetZeroData(limit);
    
    const response: ApiResponse<typeof data> = {
      success: true,
      data,
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error in netzero endpoint:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      path: req.path
    };
    res.status(500).json(errorResponse);
  }
});

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get all dashboard data
 *     description: Retrieves all dashboard data (CO2, generation mix, and net-zero) in a single request for optimal performance
 *     tags: [Dashboard]
 *     parameters:
 *       - $ref: '#/components/parameters/Co2LimitParam'
 *       - $ref: '#/components/parameters/MixLimitParam'
 *       - $ref: '#/components/parameters/NetZeroLimitParam'
 *     responses:
 *       200:
 *         description: Successfully retrieved all dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/DashboardData'
 *             example:
 *               success: true
 *               data:
 *                 co2:
 *                   - timestamp: "2024-01-01T00:00:00.000Z"
 *                     co2_intensity_g_per_kwh: 245.67
 *                 mix:
 *                   - timestamp: "2024-01-01T00:00:00.000Z"
 *                     hydro_mw: 1250.5
 *                     wind_mw: 890.3
 *                     solar_mw: 456.7
 *                     nuclear_mw: 2100.0
 *                     fossil_mw: 1200.8
 *                     renewable_share_pct: 45.2
 *                 netZero:
 *                   - year: 2024
 *                     actual_emissions_mt: 125.5
 *                     target_emissions_mt: 100.0
 *                     alignment_pct: 79.7
 *               timestamp: "2024-01-01T00:00:00.000Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const co2Limit = parseInt(req.query.co2Limit as string) || 96;
    const mixLimit = parseInt(req.query.mixLimit as string) || 96;
    const netZeroLimit = parseInt(req.query.netZeroLimit as string) || 100;
    
    const data = await DataService.fetchAllData(co2Limit, mixLimit, netZeroLimit);
    
    const response: ApiResponse<typeof data> = {
      success: true,
      data,
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error in dashboard endpoint:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      path: req.path
    };
    res.status(500).json(errorResponse);
  }
});

/**
 * @swagger
 * /api/co2/latest:
 *   get:
 *     summary: Get latest CO2 intensity value
 *     description: Retrieves the most recent CO2 intensity measurement
 *     tags: [CO2 Data]
 *     responses:
 *       200:
 *         description: Successfully retrieved latest CO2 intensity data
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Co2Row'
 *             example:
 *               success: true
 *               data:
 *                 timestamp: "2024-01-01T00:00:00.000Z"
 *                 co2_intensity_g_per_kwh: 245.67
 *               timestamp: "2024-01-01T00:00:00.000Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/co2/latest', async (req: Request, res: Response) => {
  try {
    const data = await DataService.getLatestCo2Intensity();
    
    const response: ApiResponse<typeof data> = {
      success: true,
      data,
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error in latest CO2 endpoint:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      path: req.path
    };
    res.status(500).json(errorResponse);
  }
});

/**
 * @swagger
 * /api/mix/latest:
 *   get:
 *     summary: Get latest generation mix data
 *     description: Retrieves the most recent generation mix measurement
 *     tags: [Generation Mix]
 *     responses:
 *       200:
 *         description: Successfully retrieved latest generation mix data
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/MixRow'
 *             example:
 *               success: true
 *               data:
 *                 timestamp: "2024-01-01T00:00:00.000Z"
 *                 hydro_mw: 1250.5
 *                 wind_mw: 890.3
 *                 solar_mw: 456.7
 *                 nuclear_mw: 2100.0
 *                 fossil_mw: 1200.8
 *                 renewable_share_pct: 45.2
 *               timestamp: "2024-01-01T00:00:00.000Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/mix/latest', async (req: Request, res: Response) => {
  try {
    const data = await DataService.getLatestMixData();
    
    const response: ApiResponse<typeof data> = {
      success: true,
      data,
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error in latest mix endpoint:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      path: req.path
    };
    res.status(500).json(errorResponse);
  }
});

export default router;
