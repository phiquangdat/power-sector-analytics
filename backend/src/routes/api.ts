import { Router, Request, Response } from 'express';
import { DataService } from '../services/dataService';
import { ApiResponse, ErrorResponse } from '../types';

const router = Router();

/**
 * Get CO2 intensity data
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
 * Get generation mix data
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
 * Get net-zero alignment data
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
 * Get all dashboard data in one request
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
 * Get latest CO2 intensity value
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
 * Get latest generation mix data
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
