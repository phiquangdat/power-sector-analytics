"use client";
import dynamic from 'next/dynamic'
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

type Mix = {
	timestamp: string
	hydro_mw: number
	wind_mw: number
	solar_mw: number
	nuclear_mw: number
	fossil_mw: number
}

export function ChartMix({ rows }: { rows: Mix[] }) {
	const x = rows.map(r => r.timestamp)
	const series = [
		{ name: 'Hydro', y: rows.map(r => r.hydro_mw), color: '#22c55e' },
		{ name: 'Wind', y: rows.map(r => r.wind_mw), color: '#14b8a6' },
		{ name: 'Solar', y: rows.map(r => r.solar_mw), color: '#f59e0b' },
		{ name: 'Nuclear', y: rows.map(r => r.nuclear_mw), color: '#6366f1' },
		{ name: 'Fossil', y: rows.map(r => r.fossil_mw), color: '#ef4444' },
	]
	return (
		<Plot
			data={series.map(s => ({ x, y: s.y, stackgroup: 'one', type: 'scatter', mode: 'lines', name: s.name, line: { color: s.color } }))}
			layout={{
				title: { text: 'Generation mix (MW)' },
				xaxis: { title: { text: 'Time' } },
				yaxis: { title: { text: 'MW' } },
				autosize: true,
				margin: { l: 50, r: 20, t: 40, b: 40 },
			}}
			useResizeHandler
			style={{ width: '100%', height: '400px' }}
		/>
	)
}


