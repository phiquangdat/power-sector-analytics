"use client";
import { useEffect, useState } from "react";
import { fetchInsights } from "@/lib/fetch";

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

export function InsightsFeed() {
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

  useEffect(() => {
    loadInsights();
    // Refresh insights every 5 minutes
    const interval = setInterval(loadInsights, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
      return severity === "high" ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50";
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
            <span className="text-gray-600">{data.summary.positive_insights} Positive</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            <span className="text-gray-600">{data.summary.total_alerts} Alerts</span>
          </div>
          <button
            onClick={loadInsights}
            disabled={loading}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
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
              className={`p-4 rounded-lg border ${getInsightColor(item.type, item.severity)}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">
                  {getInsightIcon(item.type, item.severity)}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    {item.severity && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.severity === "high" 
                          ? "bg-red-100 text-red-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
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
