"use client";
import { useEffect, useState } from "react";
import { fetchInsights } from "@/lib/fetch";

interface DashboardData {
  co2Data: Array<{ co2_intensity_g_per_kwh: number; timestamp: string }>;
  mixData: Array<{ renewable_share_pct: number; timestamp: string }>;
  netZeroData: Array<{ alignment_pct: number; year: number }>;
}

interface Insight {
  type: string;
  category: string;
  title: string;
  message: string;
  impact?: string;
  severity?: string;
  recommendation?: string;
  timestamp: string;
}

interface InsightsData {
  insights: Insight[];
  alerts: Insight[];
  summary: {
    total_insights: number;
    total_alerts: number;
    high_priority_alerts: number;
    positive_insights: number;
  };
}

interface InsightsFeedProps {
  dashboardData?: DashboardData;
}

export function InsightsFeed({ dashboardData }: InsightsFeedProps) {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(false);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const response = await fetchInsights();
      setData(response);
    } catch (error) {
      console.error("Failed to load insights:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate insights based on current dashboard data
  const generateLocalInsights = (): InsightsData => {
    if (!dashboardData) {
      return {
        insights: [],
        alerts: [],
        summary: {
          total_insights: 0,
          total_alerts: 0,
          high_priority_alerts: 0,
          positive_insights: 0,
        },
      };
    }

    const insights: Insight[] = [];
    const alerts: Insight[] = [];
    const now = new Date().toISOString();

    // Get current values
    const currentCo2 =
      dashboardData.co2Data.length > 0
        ? dashboardData.co2Data[dashboardData.co2Data.length - 1]
            ?.co2_intensity_g_per_kwh || 0
        : 0;
    const currentRenewable =
      dashboardData.mixData.length > 0
        ? dashboardData.mixData[dashboardData.mixData.length - 1]
            ?.renewable_share_pct || 0
        : 0;
    const currentAlignment =
      dashboardData.netZeroData.length > 0
        ? dashboardData.netZeroData[dashboardData.netZeroData.length - 1]
            ?.alignment_pct || 0
        : 0;

    // CO2 Intensity Analysis
    if (currentCo2 > 250) {
      alerts.push({
        type: "warning",
        category: "emissions",
        title: "High CO₂ Intensity Detected",
        message: `Current CO₂ intensity is ${currentCo2.toFixed(
          1
        )} g/kWh, which is above the 250 g/kWh threshold. Consider increasing renewable generation.`,
        severity: "high",
        recommendation:
          "Increase solar and wind generation to reduce carbon intensity",
        timestamp: now,
      });
    } else if (currentCo2 < 150) {
      insights.push({
        type: "positive",
        category: "emissions",
        title: "Excellent CO₂ Performance",
        message: `Current CO₂ intensity is ${currentCo2.toFixed(
          1
        )} g/kWh, well below the 250 g/kWh threshold. Great work!`,
        impact: "high",
        timestamp: now,
      });
    }

    // Renewable Share Analysis
    if (currentRenewable < 20) {
      alerts.push({
        type: "warning",
        category: "renewable",
        title: "Low Renewable Share",
        message: `Current renewable share is ${currentRenewable.toFixed(
          1
        )}%, below the 20% target. Consider increasing renewable capacity.`,
        severity: "medium",
        recommendation: "Invest in additional solar and wind infrastructure",
        timestamp: now,
      });
    } else if (currentRenewable > 30) {
      insights.push({
        type: "positive",
        category: "renewable",
        title: "Strong Renewable Performance",
        message: `Current renewable share is ${currentRenewable.toFixed(
          1
        )}%, exceeding the 20% target. Excellent progress!`,
        impact: "high",
        timestamp: now,
      });
    }

    // Net-zero Alignment Analysis
    if (currentAlignment < 80) {
      alerts.push({
        type: "warning",
        category: "netzero",
        title: "Below Net-zero Target",
        message: `Current net-zero alignment is ${currentAlignment.toFixed(
          1
        )}%, below the 80% target. Accelerate decarbonization efforts.`,
        severity: "high",
        recommendation: "Implement additional carbon reduction measures",
        timestamp: now,
      });
    } else if (currentAlignment > 95) {
      insights.push({
        type: "positive",
        category: "netzero",
        title: "Exceeding Net-zero Targets",
        message: `Current net-zero alignment is ${currentAlignment.toFixed(
          1
        )}%, well above the 80% target. Outstanding performance!`,
        impact: "high",
        timestamp: now,
      });
    }

    // Trend Analysis (if we have enough data)
    if (dashboardData.co2Data.length >= 2) {
      const recentCo2 = dashboardData.co2Data
        .slice(-4)
        .map((d) => d.co2_intensity_g_per_kwh);
      const co2Trend = recentCo2[recentCo2.length - 1] - recentCo2[0];

      if (co2Trend > 20) {
        alerts.push({
          type: "warning",
          category: "trend",
          title: "Rising CO₂ Trend",
          message: `CO₂ intensity has increased by ${co2Trend.toFixed(
            1
          )} g/kWh over the last hour. Monitor closely.`,
          severity: "medium",
          timestamp: now,
        });
      } else if (co2Trend < -20) {
        insights.push({
          type: "positive",
          category: "trend",
          title: "Improving CO₂ Trend",
          message: `CO₂ intensity has decreased by ${Math.abs(co2Trend).toFixed(
            1
          )} g/kWh over the last hour. Great improvement!`,
          impact: "medium",
          timestamp: now,
        });
      }
    }

    return {
      insights,
      alerts,
      summary: {
        total_insights: insights.length,
        total_alerts: alerts.length,
        high_priority_alerts: alerts.filter((a) => a.severity === "high")
          .length,
        positive_insights: insights.filter((i) => i.type === "positive").length,
      },
    };
  };

  useEffect(() => {
    // Try to load from API first, fallback to local generation
    loadInsights().catch(() => {
      // If API fails, use local insights based on dashboard data
      if (dashboardData) {
        setData(generateLocalInsights());
      }
    });

    // Refresh insights every 5 minutes
    const interval = setInterval(() => {
      loadInsights().catch(() => {
        if (dashboardData) {
          setData(generateLocalInsights());
        }
      });
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dashboardData]);

  // Update insights when dashboard data changes
  useEffect(() => {
    if (dashboardData && !data) {
      setData(generateLocalInsights());
    }
  }, [dashboardData, data]);

  const getInsightIcon = (type: string, severity?: string) => {
    if (type === "warning") {
      return severity === "high" ? "🚨" : "⚠️";
    } else if (type === "positive") {
      return "✅";
    } else if (type === "recommendation") {
      return "💡";
    }
    return "ℹ️";
  };

  const getInsightColor = (type: string, severity?: string) => {
    if (type === "warning") {
      return severity === "high"
        ? "border-red-200 bg-red-50"
        : "border-yellow-200 bg-yellow-50";
    } else if (type === "positive") {
      return "border-green-200 bg-green-50";
    } else if (type === "recommendation") {
      return "border-blue-200 bg-blue-50";
    }
    return "border-gray-200 bg-gray-50";
  };

  if (loading && !data) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const allItems = [...data.alerts, ...data.insights].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Insights & Alerts
        </h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-gray-600">
              {data.summary.positive_insights} Positive
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            <span className="text-gray-600">
              {data.summary.total_alerts} Alerts
            </span>
          </div>
        </div>
      </div>

      {allItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🎯</div>
          <p>All systems operating normally</p>
          <p className="text-sm">No insights or alerts at this time</p>
        </div>
      ) : (
        <div className="space-y-4">
          {allItems.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getInsightColor(
                item.type,
                item.severity
              )}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">
                  {getInsightIcon(item.type, item.severity)}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    {item.severity && (
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.severity === "high"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.severity}
                      </span>
                    )}
                    {item.impact && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {item.impact} impact
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{item.message}</p>
                  {item.recommendation && (
                    <div className="text-sm text-blue-700 bg-blue-100 p-2 rounded">
                      <strong>Recommendation:</strong> {item.recommendation}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
