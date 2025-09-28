"use client";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
import { AnomalyData } from "@/lib/goal_tracker";
import { ForecastRow } from "@/lib/fetch";

type Point = { timestamp: string; co2_intensity_g_per_kwh: number };

interface ChartCO2Props {
  points: Point[];
  anomalies?: AnomalyData[];
  forecasts?: ForecastRow[];
}

export function ChartCO2({
  points,
  anomalies = [],
  forecasts = [],
}: ChartCO2Props) {
  // Create anomaly data for plotting
  const anomalyPoints = anomalies.map((anomaly) => ({
    x: anomaly.timestamp,
    y: anomaly.co2_intensity_g_per_kwh,
    severity: anomaly.severity,
  }));

  // Create traces
  const traces: any[] = [
    {
      x: points.map((p) => p.timestamp),
      y: points.map((p) => p.co2_intensity_g_per_kwh),
      type: "scatter",
      mode: "lines",
      line: { color: "#2563eb" },
      name: "CO₂ intensity",
    },
  ];

  // Add anomaly traces if any exist
  if (anomalyPoints.length > 0) {
    // Group anomalies by severity for different colors
    const highAnomalies = anomalyPoints.filter((a) => a.severity === "high");
    const mediumAnomalies = anomalyPoints.filter(
      (a) => a.severity === "medium"
    );
    const lowAnomalies = anomalyPoints.filter((a) => a.severity === "low");

    if (highAnomalies.length > 0) {
      traces.push({
        x: highAnomalies.map((a) => a.x),
        y: highAnomalies.map((a) => a.y),
        type: "scatter",
        mode: "markers",
        marker: {
          color: "#dc2626",
          size: 12,
          symbol: "diamond",
          line: { color: "#ffffff", width: 2 },
        },
        name: "High Severity Anomalies",
      });
    }

    if (mediumAnomalies.length > 0) {
      traces.push({
        x: mediumAnomalies.map((a) => a.x),
        y: mediumAnomalies.map((a) => a.y),
        type: "scatter",
        mode: "markers",
        marker: {
          color: "#f59e0b",
          size: 10,
          symbol: "square",
          line: { color: "#ffffff", width: 2 },
        },
        name: "Medium Severity Anomalies",
      });
    }

    if (lowAnomalies.length > 0) {
      traces.push({
        x: lowAnomalies.map((a) => a.x),
        y: lowAnomalies.map((a) => a.y),
        type: "scatter",
        mode: "markers",
        marker: {
          color: "#10b981",
          size: 8,
          symbol: "circle",
          line: { color: "#ffffff", width: 2 },
        },
        name: "Low Severity Anomalies",
      });
    }
  }

  // Add forecast trace if forecasts exist
  if (forecasts.length > 0) {
    traces.push({
      x: forecasts.map((f) => f.timestamp),
      y: forecasts.map((f) => f.co2_intensity_g_per_kwh),
      type: "scatter",
      mode: "lines",
      line: {
        color: "#7c3aed",
        dash: "dash",
        width: 2,
      },
      name: "24h Forecast",
    });
  }

  return (
    <Plot
      data={traces}
      layout={{
        title: { text: "CO₂ intensity over time" },
        xaxis: { title: { text: "Time" } },
        yaxis: { title: { text: "gCO₂/kWh" } },
        autosize: true,
        margin: { l: 50, r: 20, t: 40, b: 40 },
        showlegend: anomalyPoints.length > 0 || forecasts.length > 0,
        legend: {
          x: 0.02,
          y: 0.98,
          bgcolor: "rgba(255, 255, 255, 0.8)",
          bordercolor: "rgba(0, 0, 0, 0.2)",
          borderwidth: 1,
        },
      }}
      useResizeHandler
      style={{ width: "100%", height: "400px" }}
    />
  );
}
