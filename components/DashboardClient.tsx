"use client";
import { useState, useEffect } from "react";
import {
  fetchCo2,
  fetchMix,
  fetchNetZero,
  fetchGoalTracker,
  Co2Row,
  MixRow,
  NetZeroRow,
} from "@/lib/fetch";
import { ChartCO2 } from "@/components/ChartCO2";
import { ChartMix } from "@/components/ChartMix";
import { KPICards } from "@/components/KPICards";
import { GoalTracker } from "@/components/GoalTracker";

export function DashboardClient() {
  const [co2, setCo2] = useState<Co2Row[]>([]);
  const [mix, setMix] = useState<MixRow[]>([]);
  const [netZero, setNetZero] = useState<NetZeroRow[]>([]);
  const [goalTrackerData, setGoalTrackerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("connecting");

  const fetchData = async () => {
    try {
      setConnectionStatus("connecting");

      const [co2Data, mixData, netZeroData, goalTrackerData] =
        await Promise.all([
          fetchCo2(),
          fetchMix(),
          fetchNetZero(),
          fetchGoalTracker(),
        ]);

      setCo2(co2Data);
      setMix(mixData);
      setNetZero(netZeroData);
      setGoalTrackerData(goalTrackerData);
      setLastUpdate(new Date());
      setConnectionStatus("connected");
    } catch (error) {
      console.error("Error fetching data:", error);
      setConnectionStatus("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Loading real-time data from Python backend...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 text-center py-6 mb-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Sustainability Intelligence Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Powered by Python Simulation & Analysis
        </p>
        <div className="flex items-center justify-center mt-4 space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                connectionStatus === "connected"
                  ? "bg-green-500"
                  : connectionStatus === "connecting"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm text-gray-600 capitalize">
              {connectionStatus}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <KPICards
        co2Data={co2}
        mixData={mix}
        netZeroData={netZero}
        goalTrackerData={goalTrackerData}
      />

      {/* Goal Tracker Section */}
      {goalTrackerData && !goalTrackerData.error && (
        <div className="mb-8">
          <GoalTracker data={goalTrackerData} />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 gap-8">
        {/* CO₂ Intensity Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              CO₂ Intensity Over Time
            </h2>
            <p className="text-sm text-gray-600">
              Real-time carbon emissions per unit of electricity generated.
              Lower is better. Expect dips when wind/solar/hydro output is high;
              spikes during outages or low renewables. Useful for trend
              disclosures and operational decarbonization tracking.
            </p>
          </div>
          <ChartCO2 points={co2} />
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-gray-900 hover:text-blue-600">
                What this shows (CO₂ intensity)
              </summary>
              <div className="mt-2 text-sm text-gray-700">
                <p>
                  This chart displays the carbon intensity of electricity
                  generation in grams of CO₂ per kilowatt-hour (gCO₂/kWh). It's
                  a key metric for measuring the environmental impact of power
                  generation.
                </p>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li>
                    <strong>Lower values</strong> indicate cleaner electricity
                    generation
                  </li>
                  <li>
                    <strong>Higher values</strong> suggest more fossil fuel
                    dependency
                  </li>
                  <li>
                    <strong>Trends</strong> help track decarbonization progress
                  </li>
                </ul>
              </div>
            </details>
          </div>
        </div>

        {/* Generation Mix Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Generation Mix (MW)
            </h2>
            <p className="text-sm text-gray-600">
              Real-time breakdown of electricity generation by source. Shows the
              contribution of renewable (hydro, wind, solar) and non-renewable
              (nuclear, fossil) sources to total generation capacity.
            </p>
          </div>
          <ChartMix rows={mix} />
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-gray-900 hover:text-green-600">
                What this shows (Generation Mix)
              </summary>
              <div className="mt-2 text-sm text-gray-700">
                <p>
                  This chart shows the real-time generation mix by energy source
                  in megawatts (MW). It helps visualize the balance between
                  renewable and non-renewable energy sources.
                </p>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li>
                    <strong>Renewable sources</strong> (hydro, wind, solar) are
                    environmentally friendly
                  </li>
                  <li>
                    <strong>Nuclear</strong> is low-carbon but non-renewable
                  </li>
                  <li>
                    <strong>Fossil fuels</strong> have the highest carbon
                    footprint
                  </li>
                </ul>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {connectionStatus === "error" && (
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Connection Error
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Unable to connect to the Python backend. Please check that the
                  API server is running.
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={fetchData}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
