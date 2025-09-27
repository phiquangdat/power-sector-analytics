// Goal Tracker utilities for Nexus platform
// Based on the Python goal_tracker.py logic

export interface GoalTrackerData {
  rai_pct?: number;
  budget?: {
    ytd_tons: number;
    ytd_budget_tons: number;
    days_ahead: number;
  };
  velocity?: {
    on_track: boolean;
    v_actual_g_per_kwh_per_yr: number;
    v_required_g_per_kwh_per_yr: number;
  };
  pathway?: {
    eta_year?: number;
    series?: Array<{
      year: number;
      target_emissions_mt: number;
    }>;
  };
  error?: string;
}

export interface Co2Data {
  timestamp: string;
  co2_intensity_g_per_kwh: number;
}

export interface MixData {
  timestamp: string;
  hydro_mw: number;
  wind_mw: number;
  solar_mw: number;
  nuclear_mw: number;
  fossil_mw: number;
  renewable_share_pct: number;
}

export interface NetZeroData {
  year: number;
  actual_emissions_mt: number;
  target_emissions_mt: number;
  alignment_pct: number;
}

export function computeGoalTracker(
  co2Data: Co2Data[],
  mixData: MixData[],
  netZeroData: NetZeroData[]
): GoalTrackerData {
  try {
    if (co2Data.length === 0 || mixData.length === 0) {
      return { error: "Insufficient data for goal tracking" };
    }

    // Sort data by timestamp
    const sortedCo2 = [...co2Data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const sortedMix = [...mixData].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const sortedNetZero = [...netZeroData].sort((a, b) => a.year - b.year);

    const result: GoalTrackerData = {};

    // Debug logging
    console.log('Goal Tracker Debug:', {
      co2DataLength: sortedCo2.length,
      latestCo2: sortedCo2[sortedCo2.length - 1],
      mixDataLength: sortedMix.length,
      latestMix: sortedMix[sortedMix.length - 1],
      netZeroDataLength: sortedNetZero.length
    });

    // 1. Real-time Alignment Index (RAI)
    const currentCo2 = sortedCo2[sortedCo2.length - 1]?.co2_intensity_g_per_kwh;
    const currentYear = new Date().getFullYear();
    const currentYearData = sortedNetZero.find(nz => nz.year === currentYear);
    
    if (currentCo2 && currentYearData) {
      // Estimate target intensity for current year (simplified)
      const baseYear = Math.min(...sortedNetZero.map(nz => nz.year));
      const baseYearData = sortedNetZero.find(nz => nz.year === baseYear);
      
      if (baseYearData) {
        // Proportional scaling from base year intensity
        const baseIntensity = 400; // Assume base intensity of 400 g/kWh
        const targetIntensity = baseIntensity * (currentYearData.target_emissions_mt / baseYearData.target_emissions_mt);
        result.rai_pct = Math.min(100, (targetIntensity / currentCo2) * 100);
      }
    }

    // 2. YTD Carbon Budget
    const currentDate = new Date();
    const yearStart = new Date(currentDate.getFullYear(), 0, 1);
    const daysElapsed = Math.floor((currentDate.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24));
    
    if (currentYearData) {
      const annualTargetTons = currentYearData.target_emissions_mt * 1000; // Convert to tons
      const ytdBudgetTons = annualTargetTons * (daysElapsed / 365);
      
      // Calculate actual emissions (simplified - using average intensity)
      const avgIntensity = sortedCo2.reduce((sum, d) => sum + d.co2_intensity_g_per_kwh, 0) / sortedCo2.length;
      const avgGeneration = sortedMix.reduce((sum, d) => sum + (d.hydro_mw + d.wind_mw + d.solar_mw + d.nuclear_mw + d.fossil_mw), 0) / sortedMix.length;
      const hoursElapsed = daysElapsed * 24;
      const ytdTons = (avgGeneration * hoursElapsed * avgIntensity) / 1000; // Convert g to kg to tons
      
      const daysAhead = (ytdBudgetTons - ytdTons) / (ytdTons / daysElapsed);
      
      result.budget = {
        ytd_tons: Math.round(ytdTons),
        ytd_budget_tons: Math.round(ytdBudgetTons),
        days_ahead: Math.round(daysAhead)
      };
    }

    // 3. Decarbonization Velocity
    if (sortedCo2.length >= 7) {
      // Calculate velocity over last 7 days
      const recentCo2 = sortedCo2.slice(-7);
      const timeSpan = (new Date(recentCo2[recentCo2.length - 1].timestamp).getTime() - 
                       new Date(recentCo2[0].timestamp).getTime()) / (1000 * 60 * 60 * 24);
      
      const intensityChange = recentCo2[recentCo2.length - 1].co2_intensity_g_per_kwh - recentCo2[0].co2_intensity_g_per_kwh;
      const vActual = (intensityChange / timeSpan) * 365; // Convert to per year
      
      // Required velocity to meet year-end target
      const currentIntensity = sortedCo2[sortedCo2.length - 1].co2_intensity_g_per_kwh;
      const yearEndTarget = currentYearData ? 
        (currentYearData.target_emissions_mt / currentYearData.actual_emissions_mt) * currentIntensity : 
        currentIntensity * 0.9; // Assume 10% reduction
      
      const daysLeft = 365 - daysElapsed;
      const vRequired = ((currentIntensity - yearEndTarget) * 365) / daysLeft;
      
      result.velocity = {
        on_track: vActual <= vRequired, // Negative velocity (decline) is good
        v_actual_g_per_kwh_per_yr: Math.round(vActual * 100) / 100,
        v_required_g_per_kwh_per_yr: Math.round(vRequired * 100) / 100
      };
    }

    // 4. 2050 Pathway
    if (sortedNetZero.length > 0) {
      const currentIntensity = sortedCo2[sortedCo2.length - 1]?.co2_intensity_g_per_kwh;
      const vActual = result.velocity?.v_actual_g_per_kwh_per_yr || 0;
      
      if (currentIntensity && vActual < 0) { // Only if declining
        const etaYear = currentYear + Math.abs(currentIntensity / vActual);
        result.pathway = {
          eta_year: Math.round(etaYear),
          series: sortedNetZero.map(nz => ({
            year: nz.year,
            target_emissions_mt: nz.target_emissions_mt
          }))
        };
      }
    }

    return result;
  } catch (error) {
    return { error: `Goal tracker computation failed: ${error}` };
  }
}
