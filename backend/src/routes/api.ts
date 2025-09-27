import { Router, Request, Response } from 'express';
import { DataService } from '../services/dataService';
import {
  ApiResponse,
  ErrorResponse,
  CreateResponse,
  UpdateResponse,
  DeleteResponse,
  CreateCo2Request,
  UpdateCo2Request,
  CreateMixRequest,
  UpdateMixRequest,
  CreateNetZeroRequest,
  UpdateNetZeroRequest,
} from "../types";

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

// ========== CRUD OPERATIONS ==========

/**
 * @swagger
 * /api/co2:
 *   post:
 *     summary: Create new CO2 intensity record
 *     description: Creates a new CO2 intensity measurement record
 *     tags: [CO2 Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCo2Request'
 *     responses:
 *       201:
 *         description: Successfully created CO2 intensity record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/co2', async (req: Request, res: Response) => {
  try {
    const data: CreateCo2Request = req.body;
    
    // Basic validation
    if (!data.timestamp || typeof data.co2_intensity_g_per_kwh !== 'number') {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Invalid request data. Required: timestamp (string), co2_intensity_g_per_kwh (number)',
        timestamp: new Date().toISOString(),
        path: req.path
      };
      return res.status(400).json(errorResponse);
    }

    const result = await DataService.createCo2Data(data);
    
    const response: CreateResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error in POST CO2 endpoint:', error);
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
 * /api/co2/{id}:
 *   put:
 *     summary: Update CO2 intensity record
 *     description: Updates an existing CO2 intensity measurement record
 *     tags: [CO2 Data]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The CO2 record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCo2Request'
 *     responses:
 *       200:
 *         description: Successfully updated CO2 intensity record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/co2/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const data: UpdateCo2Request = req.body;
    
    if (isNaN(id)) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Invalid ID parameter',
        timestamp: new Date().toISOString(),
        path: req.path
      };
      return res.status(400).json(errorResponse);
    }

    const result = await DataService.updateCo2Data(id, data);
    
    const response: UpdateResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error in PUT CO2 endpoint:', error);
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
 * /api/co2/{id}:
 *   delete:
 *     summary: Delete CO2 intensity record
 *     description: Deletes an existing CO2 intensity measurement record
 *     tags: [CO2 Data]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The CO2 record ID
 *     responses:
 *       200:
 *         description: Successfully deleted CO2 intensity record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/co2/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Invalid ID parameter',
        timestamp: new Date().toISOString(),
        path: req.path
      };
      return res.status(400).json(errorResponse);
    }

    await DataService.deleteCo2Data(id);
    
    const response: DeleteResponse = {
      success: true,
      message: 'CO2 intensity record deleted successfully',
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error in DELETE CO2 endpoint:', error);
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
 *   post:
 *     summary: Create new generation mix record
 *     description: Creates a new generation mix measurement record
 *     tags: [Generation Mix]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMixRequest'
 *     responses:
 *       201:
 *         description: Successfully created generation mix record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/mix', async (req: Request, res: Response) => {
  try {
    const data: CreateMixRequest = req.body;
    
    // Basic validation
    if (!data.timestamp || 
        typeof data.hydro_mw !== 'number' ||
        typeof data.wind_mw !== 'number' ||
        typeof data.solar_mw !== 'number' ||
        typeof data.nuclear_mw !== 'number' ||
        typeof data.fossil_mw !== 'number' ||
        typeof data.renewable_share_pct !== 'number') {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Invalid request data. All fields must be numbers except timestamp (string)',
        timestamp: new Date().toISOString(),
        path: req.path
      };
      return res.status(400).json(errorResponse);
    }

    const result = await DataService.createMixData(data);
    
    const response: CreateResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error in POST mix endpoint:', error);
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
 * /api/mix/{id}:
 *   put:
 *     summary: Update generation mix record
 *     description: Updates an existing generation mix measurement record
 *     tags: [Generation Mix]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The generation mix record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMixRequest'
 *     responses:
 *       200:
 *         description: Successfully updated generation mix record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/mix/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const data: UpdateMixRequest = req.body;
    
    if (isNaN(id)) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Invalid ID parameter',
        timestamp: new Date().toISOString(),
        path: req.path
      };
      return res.status(400).json(errorResponse);
    }

    const result = await DataService.updateMixData(id, data);
    
    const response: UpdateResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error in PUT mix endpoint:', error);
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
 * /api/mix/{id}:
 *   delete:
 *     summary: Delete generation mix record
 *     description: Deletes an existing generation mix measurement record
 *     tags: [Generation Mix]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The generation mix record ID
 *     responses:
 *       200:
 *         description: Successfully deleted generation mix record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/mix/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Invalid ID parameter',
        timestamp: new Date().toISOString(),
        path: req.path
      };
      return res.status(400).json(errorResponse);
    }

    await DataService.deleteMixData(id);
    
    const response: DeleteResponse = {
      success: true,
      message: 'Generation mix record deleted successfully',
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error in DELETE mix endpoint:', error);
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
 *   post:
 *     summary: Create new net-zero alignment record
 *     description: Creates a new net-zero alignment record
 *     tags: [Net-Zero]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNetZeroRequest'
 *     responses:
 *       201:
 *         description: Successfully created net-zero alignment record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/netzero', async (req: Request, res: Response) => {
  try {
    const data: CreateNetZeroRequest = req.body;
    
    // Basic validation
    if (typeof data.year !== 'number' ||
        typeof data.actual_emissions_mt !== 'number' ||
        typeof data.target_emissions_mt !== 'number' ||
        typeof data.alignment_pct !== 'number') {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Invalid request data. All fields must be numbers',
        timestamp: new Date().toISOString(),
        path: req.path
      };
      return res.status(400).json(errorResponse);
    }

    const result = await DataService.createNetZeroData(data);
    
    const response: CreateResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error in POST netzero endpoint:', error);
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
 * /api/netzero/{id}:
 *   put:
 *     summary: Update net-zero alignment record
 *     description: Updates an existing net-zero alignment record
 *     tags: [Net-Zero]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The net-zero alignment record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNetZeroRequest'
 *     responses:
 *       200:
 *         description: Successfully updated net-zero alignment record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/netzero/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const data: UpdateNetZeroRequest = req.body;
    
    if (isNaN(id)) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Invalid ID parameter',
        timestamp: new Date().toISOString(),
        path: req.path
      };
      return res.status(400).json(errorResponse);
    }

    const result = await DataService.updateNetZeroData(id, data);
    
    const response: UpdateResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error in PUT netzero endpoint:', error);
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
 * /api/netzero/{id}:
 *   delete:
 *     summary: Delete net-zero alignment record
 *     description: Deletes an existing net-zero alignment record
 *     tags: [Net-Zero]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The net-zero alignment record ID
 *     responses:
 *       200:
 *         description: Successfully deleted net-zero alignment record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/netzero/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: 'Invalid ID parameter',
        timestamp: new Date().toISOString(),
        path: req.path
      };
      return res.status(400).json(errorResponse);
    }

    await DataService.deleteNetZeroData(id);
    
    const response: DeleteResponse = {
      success: true,
      message: 'Net-zero alignment record deleted successfully',
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error in DELETE netzero endpoint:', error);
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
