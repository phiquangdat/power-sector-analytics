"use client";
import { Co2Row, MixRow, NetZeroRow } from '@/lib/fetch';
import { GoalTrackerData } from "@/lib/goal_tracker";

interface KPICardsProps {
  co2Data: Co2Row[];
  mixData: MixRow[];
  netZeroData: NetZeroRow[];
  goalTrackerData?: GoalTrackerData;
}

export function KPICards({
  co2Data,
  mixData,
  netZeroData,
  goalTrackerData,
}: KPICardsProps) {
  // Calculate current values
  const currentCo2 =
    co2Data.length > 0
      ? co2Data[co2Data.length - 1]?.co2_intensity_g_per_kwh
      : 0;
  const currentRenewableShare =
    mixData.length > 0 ? mixData[mixData.length - 1]?.renewable_share_pct : 0;
  const latestAlignment =
    netZeroData.length > 0
      ? netZeroData[netZeroData.length - 1]?.alignment_pct
      : 0;

  // Extract anomaly and correlation data
  const anomalyCount = goalTrackerData?.anomalies?.count || 0;
  const correlation = goalTrackerData?.correlation;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      {/* CO₂ Intensity Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mx-auto mb-4">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {currentCo2.toFixed(1)} g/kWh
        </div>
        <div className="text-sm font-medium text-gray-900 mb-1">
          CO₂ Intensity
        </div>
        <div className="text-xs text-gray-500">
          Current carbon emissions per unit of electricity generated
        </div>
      </div>

      {/* Renewable Share Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {currentRenewableShare.toFixed(1)}%
        </div>
        <div className="text-sm font-medium text-gray-900 mb-1">
          Renewable Share
        </div>
        <div className="text-xs text-gray-500">
          Percentage of generation from renewable sources
        </div>
      </div>

      {/* Net-zero Alignment Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {latestAlignment.toFixed(0)}%
        </div>
        <div className="text-sm font-medium text-gray-900 mb-1">
          Net-zero Alignment
        </div>
        <div className="text-xs text-gray-500">
          Annual progress vs target emissions pathway
        </div>
      </div>

      {/* Anomaly Detection Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
        <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-4">
          <svg
            className="w-6 h-6 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {anomalyCount}
        </div>
        <div className="text-sm font-medium text-gray-900 mb-1">
          Anomalies (24h)
        </div>
        <div className="text-xs text-gray-500">
          Unusual CO₂ intensity spikes detected
        </div>
      </div>

      {/* Correlation Analysis Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4">
          <svg
            className="w-6 h-6 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {correlation ? correlation.correlation.toFixed(2) : "N/A"}
        </div>
        <div className="text-sm font-medium text-gray-900 mb-1">
          Correlation
        </div>
        <div className="text-xs text-gray-500">
          {correlation
            ? `${correlation.strength} ${correlation.direction} correlation`
            : "Renewables vs CO₂ intensity"}
        </div>
      </div>
    </div>
  );
}
