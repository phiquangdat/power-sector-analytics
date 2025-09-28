"use client";
import { useState, useEffect, useRef } from "react";
import {
  fetchCo2,
  fetchMix,
  fetchNetZero,
  Co2Row,
  MixRow,
  NetZeroRow,
} from "@/lib/fetch";
import { ChartCO2 } from "@/components/ChartCO2";
import { ChartMix } from "@/components/ChartMix";
import { KPICards } from "@/components/KPICards";
import { GoalTracker } from "@/components/GoalTracker";
import { computeGoalTracker } from "@/lib/goal_tracker";
import { supabase } from "@/lib/supabase";

interface DashboardClientProps {
  initialCo2?: Co2Row[];
  initialMix?: MixRow[];
  initialNetZero?: NetZeroRow[];
  serverError?: string | null;
}

export function DashboardClient({
  initialCo2 = [],
  initialMix = [],
  initialNetZero = [],
  serverError = null,
}: DashboardClientProps) {
  const [co2, setCo2] = useState<Co2Row[]>(initialCo2);
  const [mix, setMix] = useState<MixRow[]>(initialMix);
  const [netZero, setNetZero] = useState<NetZeroRow[]>(initialNetZero);
  const [loading, setLoading] = useState(
    initialCo2.length === 0 &&
      initialMix.length === 0 &&
      initialNetZero.length === 0
  );
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Refs to store subscription objects for cleanup
  const co2Subscription = useRef<ReturnType<
    NonNullable<typeof supabase>["channel"]
  > | null>(null);
  const mixSubscription = useRef<ReturnType<
    NonNullable<typeof supabase>["channel"]
  > | null>(null);
  const netZeroSubscription = useRef<ReturnType<
    NonNullable<typeof supabase>["channel"]
  > | null>(null);

  const fetchData = async () => {
    try {
      const [co2Data, mixData, netZeroData] = await Promise.all([
        fetchCo2(96),
        fetchMix(96),
        fetchNetZero(100),
      ]);

      // Debug logging
      console.log("Fetched data:", {
        co2Count: co2Data.length,
        latestCo2: co2Data[co2Data.length - 1],
        mixCount: mixData.length,
        latestMix: mixData[mixData.length - 1],
        netZeroCount: netZeroData.length,
      });

      setCo2(co2Data);
      setMix(mixData);
      setNetZero(netZeroData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscriptions
  const setupSubscriptions = () => {
    if (!supabase) {
      console.warn(
        "Supabase not initialized, skipping real-time subscriptions"
      );
      return;
    }

    // CO2 intensity subscription
    co2Subscription.current = supabase
      .channel("co2_intensity_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "co2_intensity",
        },
        (payload) => {
          console.log("New CO2 data received:", payload.new);
          // Fetch fresh data when new record is inserted
          fetchCo2(96).then(setCo2).catch(console.error);
          setLastUpdate(new Date());
        }
      )
      .subscribe();

    // Generation mix subscription
    mixSubscription.current = supabase
      .channel("generation_mix_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "generation_mix",
        },
        (payload) => {
          console.log("New generation mix data received:", payload.new);
          // Fetch fresh data when new record is inserted
          fetchMix(96).then(setMix).catch(console.error);
          setLastUpdate(new Date());
        }
      )
      .subscribe();

    // Net zero alignment subscription
    netZeroSubscription.current = supabase
      .channel("netzero_alignment_changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "netzero_alignment",
        },
        (payload) => {
          console.log("Net zero alignment data changed:", payload);
          // Fetch fresh data when any change occurs
          fetchNetZero(100).then(setNetZero).catch(console.error);
          setLastUpdate(new Date());
        }
      )
      .subscribe();
  };

  // Cleanup subscriptions
  const cleanupSubscriptions = () => {
    if (co2Subscription.current) {
      supabase?.removeChannel(co2Subscription.current);
      co2Subscription.current = null;
    }
    if (mixSubscription.current) {
      supabase?.removeChannel(mixSubscription.current);
      mixSubscription.current = null;
    }
    if (netZeroSubscription.current) {
      supabase?.removeChannel(netZeroSubscription.current);
      netZeroSubscription.current = null;
    }
  };

  useEffect(() => {
    // Only fetch data if we don't have initial data from server
    if (
      initialCo2.length === 0 &&
      initialMix.length === 0 &&
      initialNetZero.length === 0
    ) {
      fetchData();
    } else {
      // We have server data, so we're not loading
      setLoading(false);
    }

    // Set up real-time subscriptions
    setupSubscriptions();

    // Set up interval to fetch data every 10 seconds as fallback
    const interval = setInterval(fetchData, 10000);

    return () => {
      clearInterval(interval);
      cleanupSubscriptions();
    };
  }, [initialCo2.length, initialMix.length, initialNetZero.length]);

  // Compute goal tracker metrics
  const goalTrackerData = computeGoalTracker(co2, mix, netZero);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading real-time data...</p>
        </div>
      </div>
    );
  }

  if (serverError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{serverError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sustainability Intelligence Dashboard
            </h1>
            <p className="text-gray-600 max-w-4xl mx-auto mb-4">
              This prototype addresses the WISE Sustainability Intelligence
              challenge: an explorable, real‑time view of key power‑sector
              metrics to support reporting, analysis, and progress toward
              net‑zero by 2050 (IPCC 1.5°C). It illustrates how integrated
              metrics can improve transparency and compliance readiness
              (CSRD/ESRS, EU ETS MRV).
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Live Data
              </div>
              <div>Last updated: {lastUpdate.toLocaleTimeString()}</div>
              <button
                onClick={fetchData}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Refresh Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <KPICards co2Data={co2} mixData={mix} netZeroData={netZero} />

        {/* Goal Tracker Section */}
        {!goalTrackerData.error && (
          <div className="mb-8">
            <GoalTracker data={goalTrackerData} />
          </div>
        )}

        {/* Charts Section */}
        <div className="space-y-8">
          {/* CO₂ Intensity Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                CO₂ Intensity Over Time
              </h2>
              <p className="text-sm text-gray-600">
                Lower is better. Expect dips when wind/solar/hydro output is
                high; spikes during outages or low renewables. Useful for trend
                disclosures and operational decarbonization tracking.
              </p>
            </div>
            <ChartCO2 points={co2} />
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-gray-900 hover:text-blue-600">
                  What this shows (CO₂ intensity)
                </summary>
                <div className="mt-3 text-sm text-gray-600 space-y-1">
                  <div>
                    <strong>Y‑axis:</strong> gCO₂ per kWh.
                  </div>
                  <div>
                    <strong>X‑axis:</strong> time (15‑minute simulated steps).
                  </div>
                  <div>
                    <strong>Drivers:</strong> renewable availability,
                    outages/maintenance, fossil dispatch.
                  </div>
                  <div>
                    <strong>Read it:</strong> downward trend = decarbonization;
                    spikes = operational events.
                  </div>
                  <div>
                    <strong>Why it matters:</strong> core emissions intensity
                    indicator for CSRD/ESRS climate metrics.
                  </div>
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
                Stacked by technology (MW). Weather, maintenance, and price
                signals drive shifts. Supports narrative on energy mix and
                renewable penetration.
              </p>
            </div>
            <ChartMix rows={mix} />
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-gray-900 hover:text-green-600">
                  What this shows (generation mix)
                </summary>
                <div className="mt-3 text-sm text-gray-600 space-y-1">
                  <div>
                    <strong>Stacked area:</strong> MW by source (hydro, wind,
                    solar, nuclear, fossil).
                  </div>
                  <div>
                    <strong>Total:</strong> top of the stack ≈ demand served.
                  </div>
                  <div>
                    <strong>Read it:</strong> larger renewable area → expect
                    lower CO₂ intensity above.
                  </div>
                  <div>
                    <strong>Why it matters:</strong> supports ESRS disclosures
                    on energy mix and renewable share.
                  </div>
                </div>
              </details>
            </div>
          </div>

          {/* Current Mix Pie Chart Placeholder */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Current Generation Mix
              </h2>
              <p className="text-sm text-gray-600">
                Current mix snapshot. Higher renewable share typically
                correlates with lower CO₂ intensity.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="text-gray-500 text-sm mb-2">
                Current Mix Pie Chart
              </div>
              <div className="text-xs text-gray-400">
                (Pie chart component would show current generation breakdown by
                source)
              </div>
            </div>
            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-gray-900 hover:text-purple-600">
                  What this shows (current mix)
                </summary>
                <div className="mt-3 text-sm text-gray-600 space-y-1">
                  <div>
                    <strong>Slices:</strong> share of output by technology right
                    now.
                  </div>
                  <div>
                    <strong>Read it:</strong> bigger renewable slices → lower
                    expected CO₂ intensity.
                  </div>
                  <div>
                    <strong>Why it matters:</strong> quick status for operations
                    and stakeholder reporting.
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Prototype note:</strong> Data are simulated to demonstrate
            flows and visuals. In production, data integrate from plant SCADA,
            fuel/efficiency logs, and emissions inventories.
          </p>
        </div>
      </div>
    </div>
  );
}
