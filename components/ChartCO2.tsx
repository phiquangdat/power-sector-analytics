"use client";
import dynamic from 'next/dynamic'
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

type Point = { timestamp: string; co2_intensity_g_per_kwh: number }

export function ChartCO2({ points }: { points: Point[] }) {
	return (
		<Plot
			data={[
				{
					x: points.map(p => p.timestamp),
					y: points.map(p => p.co2_intensity_g_per_kwh),
					type: 'scatter',
					mode: 'lines',
					line: { color: '#2563eb' },
					name: 'CO₂ intensity',
				},
			]}
			layout={{
				title: { text: 'CO₂ intensity over time' },
				xaxis: { title: { text: 'Time' } },
				yaxis: { title: { text: 'gCO₂/kWh' } },
				autosize: true,
				margin: { l: 50, r: 20, t: 40, b: 40 },
			}}
			useResizeHandler
			style={{ width: '100%', height: '400px' }}
		/>
	)
}


