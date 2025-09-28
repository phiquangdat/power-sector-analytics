"use client";
import { useState } from "react";
import { runScenario } from "@/lib/fetch";

interface ScenarioModelerProps {
  onScenarioUpdate?: (data: any) => void;
}

export function ScenarioModeler({ onScenarioUpdate }: ScenarioModelerProps) {
  const [params, setParams] = useState({
    solar_boost: 0.0,
    wind_boost: 0.0,
    fossil_reduction: 0.0,
    nuclear_outage: false,
    duration_hours: 24,
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleRunScenario = async () => {
    setLoading(true);
    try {
      const response = await runScenario(params);
      setResults(response);
      onScenarioUpdate?.(response);
    } catch (error) {
      console.error("Failed to run scenario:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setParams({
      solar_boost: 0.0,
      wind_boost: 0.0,
      fossil_reduction: 0.0,
      nuclear_outage: false,
      duration_hours: 24,
    });
    setResults(null);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          What-If Scenario Modeler
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={handleRunScenario}
            disabled={loading}
            className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Running..." : "Run Scenario"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Solar Boost */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Solar Generation Boost: {Math.round(params.solar_boost * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={params.solar_boost}
            onChange={(e) =>
              setParams({ ...params, solar_boost: parseFloat(e.target.value) })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Wind Boost */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wind Generation Boost: {Math.round(params.wind_boost * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={params.wind_boost}
            onChange={(e) =>
              setParams({ ...params, wind_boost: parseFloat(e.target.value) })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Fossil Reduction */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fossil Fuel Reduction: {Math.round(params.fossil_reduction * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={params.fossil_reduction}
            onChange={(e) =>
              setParams({ ...params, fossil_reduction: parseFloat(e.target.value) })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Nuclear Outage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nuclear Outage
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={params.nuclear_outage}
              onChange={(e) =>
                setParams({ ...params, nuclear_outage: e.target.checked })
              }
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-600">
              Simulate nuclear plant outage
            </span>
          </label>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-3">Scenario Impact Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {results.impact_analysis.renewable_share_change.change_pct > 0 ? "+" : ""}
                {results.impact_analysis.renewable_share_change.change_pct.toFixed(1)}%
              </div>
              <div className="text-sm text-blue-700">Renewable Share Change</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {results.impact_analysis.co2_intensity_change.reduction_pct.toFixed(1)}%
              </div>
              <div className="text-sm text-green-700">CO₂ Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {results.impact_analysis.netzero_alignment_change.improvement_pct > 0 ? "+" : ""}
                {results.impact_analysis.netzero_alignment_change.improvement_pct.toFixed(1)}%
              </div>
              <div className="text-sm text-purple-700">Net-Zero Alignment</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
