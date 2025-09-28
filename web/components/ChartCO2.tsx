"use client";
import dynamic from 'next/dynamic'
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })
import { ForecastRow, fetchCo2Forecast } from "@/lib/fetch";
import { useEffect, useState } from "react";

type Point = { timestamp: string; co2_intensity_g_per_kwh: number }

export function ChartCO2({ points }: { points: Point[] }) {
  const [forecastData, setForecastData] = useState<ForecastRow[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch forecast data on component mount
  useEffect(() => {
    const loadForecast = async () => {
      setLoading(true);
      try {
        const response = await fetchCo2Forecast();
        setForecastData(response.forecast || []);
      } catch (error) {
        console.error("Failed to load forecast:", error);
      } finally {
        setLoading(false);
      }
    };

    loadForecast();
  }, []);
  const traces = [
    {
      x: points.map((p) => p.timestamp),
      y: points.map((p) => p.co2_intensity_g_per_kwh),
      type: "scatter",
      mode: "lines",
      line: { color: "#2563eb" },
      name: "CO₂ intensity",
    } as any,
  ];

  // Add forecast trace if available
  if (forecastData.length > 0) {
    traces.push({
      x: forecastData.map((f) => f.timestamp),
      y: forecastData.map((f) => f.co2_intensity_g_per_kwh),
      type: "scatter",
      mode: "lines",
      line: {
        color: "#7c3aed",
        dash: "dash",
        width: 2,
      },
      name: "24h Forecast",
    } as any);
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
        showlegend: forecastData.length > 0,
      }}
      useResizeHandler
      style={{ width: "100%", height: "400px" }}
    />
  );
}


