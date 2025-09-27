"use client";
import { Co2Row, MixRow, NetZeroRow } from '@/lib/fetch';

interface KPICardsProps {
  co2Data: Co2Row[];
  mixData: MixRow[];
  netZeroData: NetZeroRow[];
}

export function KPICards({ co2Data, mixData, netZeroData }: KPICardsProps) {
  // Calculate current values
  const currentCo2 = co2Data.length > 0 ? co2Data[co2Data.length - 1]?.co2_intensity_g_per_kwh : 0;
  const currentRenewableShare = mixData.length > 0 ? mixData[mixData.length - 1]?.renewable_share_pct : 0;
  const latestAlignment = netZeroData.length > 0 ? netZeroData[netZeroData.length - 1]?.alignment_pct : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* CO₂ Intensity Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mx-auto mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {currentCo2.toFixed(1)} g/kWh
        </div>
        <div className="text-sm font-medium text-gray-900 mb-1">CO₂ Intensity</div>
        <div className="text-xs text-gray-500">
          Current carbon emissions per unit of electricity generated
        </div>
      </div>

      {/* Renewable Share Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {currentRenewableShare.toFixed(1)}%
        </div>
        <div className="text-sm font-medium text-gray-900 mb-1">Renewable Share</div>
        <div className="text-xs text-gray-500">
          Percentage of generation from renewable sources
        </div>
      </div>

      {/* Net-zero Alignment Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {latestAlignment.toFixed(0)}%
        </div>
        <div className="text-sm font-medium text-gray-900 mb-1">Net-zero Alignment</div>
        <div className="text-xs text-gray-500">
          Annual progress vs target emissions pathway
        </div>
      </div>
    </div>
  );
}
