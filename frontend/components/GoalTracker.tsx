"use client";
import { GoalTrackerData } from '@/lib/goal_tracker';

interface GoalTrackerProps {
  data: GoalTrackerData;
}

export function GoalTracker({ data }: GoalTrackerProps) {
  if (data.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {data.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Goal Tracker (1.5°C / Net-zero 2050)</h2>
        <p className="text-gray-600">
          Real-time metrics tracking progress toward net-zero emissions by 2050
        </p>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Real-time Alignment Index */}
        {data.rai_pct !== undefined && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {data.rai_pct.toFixed(0)}%
            </div>
            <div className="text-sm font-medium text-gray-900 mb-1">Real-time Alignment Index</div>
            <div className="text-xs text-gray-500">
              Target intensity vs current intensity. 100% means on target.
            </div>
          </div>
        )}

        {/* YTD Carbon Budget */}
        {data.budget && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {data.budget.ytd_tons.toLocaleString()} t
            </div>
            <div className="text-sm font-medium text-gray-900 mb-1">YTD Carbon Budget</div>
            <div className="text-xs text-gray-500 mb-2">
              of {data.budget.ytd_budget_tons.toLocaleString()} t budget
            </div>
            <div className={`text-sm font-medium ${data.budget.days_ahead >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.budget.days_ahead >= 0 ? '+' : ''}{data.budget.days_ahead} days ahead
            </div>
          </div>
        )}

        {/* Decarbonization Velocity */}
        {data.velocity && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <div className={`text-2xl font-bold mb-2 ${data.velocity.on_track ? 'text-green-600' : 'text-red-600'}`}>
              {data.velocity.on_track ? 'On Track' : 'Behind'}
            </div>
            <div className="text-sm font-medium text-gray-900 mb-1">Decarbonization Velocity</div>
            <div className="text-xs text-gray-500">
              Actual: {data.velocity.v_actual_g_per_kwh_per_yr} g/kWh/yr<br/>
              Required: {data.velocity.v_required_g_per_kwh_per_yr} g/kWh/yr
            </div>
          </div>
        )}
      </div>

      {/* 2050 Pathway Section */}
      {data.pathway && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">2050 Pathway (Net-zero trajectory)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pathway Alignment and ETA */}
            <div className="space-y-4">
              {data.pathway.eta_year && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {data.pathway.eta_year}
                  </div>
                  <div className="text-sm font-medium text-gray-900 mb-1">ETA to near-zero</div>
                  <div className="text-xs text-gray-500">
                    Year when current decline rate would reach near-zero intensity
                  </div>
                </div>
              )}
            </div>

            {/* Pathway Chart Placeholder */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-gray-500 text-sm">
                Target emissions pathway visualization
              </div>
              <div className="text-xs text-gray-400 mt-1">
                (Chart component would go here)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How it works expandable section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-gray-900 hover:text-green-600">
            How the Goal Tracker works
          </summary>
          <div className="mt-3 text-sm text-gray-600 space-y-2">
            <div>
              <strong>Alignment Index:</strong> Compares current CO₂ intensity to this year's target intensity derived from annual targets.
            </div>
            <div>
              <strong>Budget:</strong> Integrates emissions from power output and intensity vs a proportional year-to-date budget.
            </div>
            <div>
              <strong>Velocity:</strong> Compares observed intensity decline rate vs the rate needed to meet this year's target.
            </div>
            <div>
              <strong>2050 Pathway:</strong> Shows how current annual emissions compare to the pathway target and illustrative ETA to near-zero.
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
