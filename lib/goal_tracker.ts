// Goal Tracker utilities for Nexus platform
// Based on the Python goal_tracker.py logic

export interface AnomalyData {
  timestamp: string;
  co2_intensity_g_per_kwh: number;
  isAnomaly: boolean;
  deviation: number;
  severity: "low" | "medium" | "high";
}

export interface CorrelationData {
  correlation: number;
  strength: "weak" | "moderate" | "strong";
  direction: "positive" | "negative";
  sampleSize: number;
}

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
  anomalies?: {
    count: number;
    recent: AnomalyData[];
    severity: {
      low: number;
      medium: number;
      high: number;
    };
  };
  correlation?: CorrelationData;
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

// Anomaly Detection Functions
function detectAnomalies(
  co2Data: Co2Data[],
  windowSize: number = 96
): AnomalyData[] {
  if (co2Data.length < windowSize) return [];

  const sortedData = [...co2Data].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  const anomalies: AnomalyData[] = [];

  for (let i = windowSize; i < sortedData.length; i++) {
    const window = sortedData.slice(i - windowSize, i);
    const current = sortedData[i];

    // Calculate moving average and standard deviation
    const values = window.map((d) => d.co2_intensity_g_per_kwh);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      values.length;
    const stdDev = Math.sqrt(variance);

    // Calculate z-score
    const zScore = Math.abs((current.co2_intensity_g_per_kwh - mean) / stdDev);

    // Determine if anomaly (threshold: 2.5 standard deviations)
    const isAnomaly = zScore > 2.5;

    if (isAnomaly) {
      let severity: "low" | "medium" | "high" = "low";
      if (zScore > 3.5) severity = "high";
      else if (zScore > 3.0) severity = "medium";

      anomalies.push({
        timestamp: current.timestamp,
        co2_intensity_g_per_kwh: current.co2_intensity_g_per_kwh,
        isAnomaly: true,
        deviation: zScore,
        severity,
      });
    }
  }

  return anomalies;
}

// Correlation Analysis Functions
function calculateCorrelation(
  co2Data: Co2Data[],
  mixData: MixData[]
): CorrelationData {
  if (co2Data.length === 0 || mixData.length === 0) {
    return {
      correlation: 0,
      strength: "weak",
      direction: "positive",
      sampleSize: 0,
    };
  }

  // Sort and align data by timestamp
  const sortedCo2 = [...co2Data].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  const sortedMix = [...mixData].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Find common timestamps
  const co2Timestamps = new Set(sortedCo2.map((d) => d.timestamp));
  const mixTimestamps = new Set(sortedMix.map((d) => d.timestamp));
  const commonTimestamps = [...co2Timestamps].filter((ts) =>
    mixTimestamps.has(ts)
  );

  if (commonTimestamps.length < 2) {
    return {
      correlation: 0,
      strength: "weak",
      direction: "positive",
      sampleSize: 0,
    };
  }

  // Extract paired values
  const co2Values: number[] = [];
  const renewableValues: number[] = [];

  commonTimestamps.forEach((timestamp) => {
    const co2Point = sortedCo2.find((d) => d.timestamp === timestamp);
    const mixPoint = sortedMix.find((d) => d.timestamp === timestamp);

    if (co2Point && mixPoint) {
      co2Values.push(co2Point.co2_intensity_g_per_kwh);
      renewableValues.push(mixPoint.renewable_share_pct);
    }
  });

  // Calculate Pearson correlation coefficient
  const n = co2Values.length;
  const sumX = co2Values.reduce((sum, val) => sum + val, 0);
  const sumY = renewableValues.reduce((sum, val) => sum + val, 0);
  const sumXY = co2Values.reduce(
    (sum, val, i) => sum + val * renewableValues[i],
    0
  );
  const sumX2 = co2Values.reduce((sum, val) => sum + val * val, 0);
  const sumY2 = renewableValues.reduce((sum, val) => sum + val * val, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt(
    (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
  );

  const correlation = denominator === 0 ? 0 : numerator / denominator;

  // Determine strength and direction
  const absCorrelation = Math.abs(correlation);
  let strength: "weak" | "moderate" | "strong" = "weak";
  if (absCorrelation > 0.7) strength = "strong";
  else if (absCorrelation > 0.3) strength = "moderate";

  return {
    correlation: Math.round(correlation * 1000) / 1000, // Round to 3 decimal places
    strength,
    direction: correlation >= 0 ? "positive" : "negative",
    sampleSize: n,
  };
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
    const sortedCo2 = [...co2Data].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    const sortedMix = [...mixData].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    const sortedNetZero = [...netZeroData].sort((a, b) => a.year - b.year);

    const result: GoalTrackerData = {};

    // Debug logging
    console.log("Goal Tracker Debug:", {
      co2DataLength: sortedCo2.length,
      latestCo2: sortedCo2[sortedCo2.length - 1],
      mixDataLength: sortedMix.length,
      latestMix: sortedMix[sortedMix.length - 1],
      netZeroDataLength: sortedNetZero.length,
    });

    // 1. Real-time Alignment Index (RAI)
    const currentCo2 = sortedCo2[sortedCo2.length - 1]?.co2_intensity_g_per_kwh;
    const currentYear = new Date().getFullYear();
    const currentYearData = sortedNetZero.find((nz) => nz.year === currentYear);

    if (currentCo2 && currentYearData) {
      // Estimate target intensity for current year (simplified)
      const baseYear = Math.min(...sortedNetZero.map((nz) => nz.year));
      const baseYearData = sortedNetZero.find((nz) => nz.year === baseYear);

      if (baseYearData) {
        // Proportional scaling from base year intensity
        const baseIntensity = 400; // Assume base intensity of 400 g/kWh
        const targetIntensity =
          baseIntensity *
          (currentYearData.target_emissions_mt /
            baseYearData.target_emissions_mt);
        result.rai_pct = Math.min(100, (targetIntensity / currentCo2) * 100);
      }
    }

    // 2. YTD Carbon Budget
    const currentDate = new Date();
    const yearStart = new Date(currentDate.getFullYear(), 0, 1);
    const daysElapsed = Math.floor(
      (currentDate.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (currentYearData) {
      const annualTargetTons = currentYearData.target_emissions_mt * 1000; // Convert to tons
      const ytdBudgetTons = annualTargetTons * (daysElapsed / 365);

      // Calculate actual emissions (simplified - using average intensity)
      const avgIntensity =
        sortedCo2.reduce((sum, d) => sum + d.co2_intensity_g_per_kwh, 0) /
        sortedCo2.length;
      const avgGeneration =
        sortedMix.reduce(
          (sum, d) =>
            sum +
            (d.hydro_mw + d.wind_mw + d.solar_mw + d.nuclear_mw + d.fossil_mw),
          0
        ) / sortedMix.length;
      const hoursElapsed = daysElapsed * 24;
      const ytdTons = (avgGeneration * hoursElapsed * avgIntensity) / 1000; // Convert g to kg to tons

      const daysAhead = (ytdBudgetTons - ytdTons) / (ytdTons / daysElapsed);

      result.budget = {
        ytd_tons: Math.round(ytdTons),
        ytd_budget_tons: Math.round(ytdBudgetTons),
        days_ahead: Math.round(daysAhead),
      };
    }

    // 3. Decarbonization Velocity
    if (sortedCo2.length >= 7) {
      // Calculate velocity over last 7 days
      const recentCo2 = sortedCo2.slice(-7);
      const timeSpan =
        (new Date(recentCo2[recentCo2.length - 1].timestamp).getTime() -
          new Date(recentCo2[0].timestamp).getTime()) /
        (1000 * 60 * 60 * 24);

      const intensityChange =
        recentCo2[recentCo2.length - 1].co2_intensity_g_per_kwh -
        recentCo2[0].co2_intensity_g_per_kwh;
      const vActual = (intensityChange / timeSpan) * 365; // Convert to per year

      // Required velocity to meet year-end target
      const currentIntensity =
        sortedCo2[sortedCo2.length - 1].co2_intensity_g_per_kwh;
      const yearEndTarget = currentYearData
        ? (currentYearData.target_emissions_mt /
            currentYearData.actual_emissions_mt) *
          currentIntensity
        : currentIntensity * 0.9; // Assume 10% reduction

      const daysLeft = 365 - daysElapsed;
      const vRequired = ((currentIntensity - yearEndTarget) * 365) / daysLeft;

      result.velocity = {
        on_track: vActual <= vRequired, // Negative velocity (decline) is good
        v_actual_g_per_kwh_per_yr: Math.round(vActual * 100) / 100,
        v_required_g_per_kwh_per_yr: Math.round(vRequired * 100) / 100,
      };
    }

    // 4. 2050 Pathway
    if (sortedNetZero.length > 0) {
      const currentIntensity =
        sortedCo2[sortedCo2.length - 1]?.co2_intensity_g_per_kwh;
      const vActual = result.velocity?.v_actual_g_per_kwh_per_yr || 0;

      if (currentIntensity && vActual < 0) {
        // Only if declining
        const etaYear = currentYear + Math.abs(currentIntensity / vActual);
        result.pathway = {
          eta_year: Math.round(etaYear),
          series: sortedNetZero.map((nz) => ({
            year: nz.year,
            target_emissions_mt: nz.target_emissions_mt,
          })),
        };
      }
    }

    // 5. Anomaly Detection
    const anomalies = detectAnomalies(sortedCo2, 96); // 24-hour window (96 * 15min)
    const recentAnomalies = anomalies.slice(-10); // Last 10 anomalies

    const severityCounts = anomalies.reduce(
      (acc, anomaly) => {
        acc[anomaly.severity]++;
        return acc;
      },
      { low: 0, medium: 0, high: 0 }
    );

    result.anomalies = {
      count: anomalies.length,
      recent: recentAnomalies,
      severity: severityCounts,
    };

    // 6. Correlation Analysis
    result.correlation = calculateCorrelation(sortedCo2, sortedMix);

    return result;
  } catch (error) {
    return { error: `Goal tracker computation failed: ${error}` };
  }
}
