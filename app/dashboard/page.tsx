import { fetchCo2, fetchMix, fetchNetZero, Co2Row, MixRow, NetZeroRow } from '@/lib/fetch'
import { ChartCO2 } from '@/components/ChartCO2'
import { ChartMix } from '@/components/ChartMix'
import { KPICards } from '@/components/KPICards'
import { GoalTracker } from '@/components/GoalTracker'
import { computeGoalTracker } from '@/lib/goal_tracker'

export default async function DashboardPage() {
	const [co2, mix, netZero]: [Co2Row[], MixRow[], NetZeroRow[]] = await Promise.all([
		fetchCo2(96), 
		fetchMix(96),
		fetchNetZero(100)
	])

	// Compute goal tracker metrics
	const goalTrackerData = computeGoalTracker(co2, mix, netZero)

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="text-center">
						<h1 className="text-3xl font-bold text-gray-900 mb-2">Sustainability Intelligence Dashboard</h1>
						<p className="text-gray-600 max-w-4xl mx-auto">
							This prototype addresses the WISE Sustainability Intelligence challenge: an explorable, real‑time view of key power‑sector metrics 
							to support reporting, analysis, and progress toward net‑zero by 2050 (IPCC 1.5°C). 
							It illustrates how integrated metrics can improve transparency and compliance readiness (CSRD/ESRS, EU ETS MRV).
						</p>
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
							<h2 className="text-xl font-semibold text-gray-900 mb-2">CO₂ Intensity Over Time</h2>
							<p className="text-sm text-gray-600">
								Lower is better. Expect dips when wind/solar/hydro output is high; spikes during outages or low renewables. 
								Useful for trend disclosures and operational decarbonization tracking.
							</p>
						</div>
						<ChartCO2 points={co2} />
						<div className="mt-4 p-4 bg-blue-50 rounded-lg">
							<details className="group">
								<summary className="cursor-pointer text-sm font-medium text-gray-900 hover:text-blue-600">
									What this shows (CO₂ intensity)
								</summary>
								<div className="mt-3 text-sm text-gray-600 space-y-1">
									<div><strong>Y‑axis:</strong> gCO₂ per kWh.</div>
									<div><strong>X‑axis:</strong> time (15‑minute simulated steps).</div>
									<div><strong>Drivers:</strong> renewable availability, outages/maintenance, fossil dispatch.</div>
									<div><strong>Read it:</strong> downward trend = decarbonization; spikes = operational events.</div>
									<div><strong>Why it matters:</strong> core emissions intensity indicator for CSRD/ESRS climate metrics.</div>
								</div>
							</details>
						</div>
					</div>

					{/* Generation Mix Chart */}
					<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
						<div className="mb-4">
							<h2 className="text-xl font-semibold text-gray-900 mb-2">Generation Mix (MW)</h2>
							<p className="text-sm text-gray-600">
								Stacked by technology (MW). Weather, maintenance, and price signals drive shifts. 
								Supports narrative on energy mix and renewable penetration.
							</p>
						</div>
						<ChartMix rows={mix} />
						<div className="mt-4 p-4 bg-green-50 rounded-lg">
							<details className="group">
								<summary className="cursor-pointer text-sm font-medium text-gray-900 hover:text-green-600">
									What this shows (generation mix)
								</summary>
								<div className="mt-3 text-sm text-gray-600 space-y-1">
									<div><strong>Stacked area:</strong> MW by source (hydro, wind, solar, nuclear, fossil).</div>
									<div><strong>Total:</strong> top of the stack ≈ demand served.</div>
									<div><strong>Read it:</strong> larger renewable area → expect lower CO₂ intensity above.</div>
									<div><strong>Why it matters:</strong> supports ESRS disclosures on energy mix and renewable share.</div>
								</div>
							</details>
						</div>
					</div>

					{/* Current Mix Pie Chart Placeholder */}
					<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
						<div className="mb-4">
							<h2 className="text-xl font-semibold text-gray-900 mb-2">Current Generation Mix</h2>
							<p className="text-sm text-gray-600">
								Current mix snapshot. Higher renewable share typically correlates with lower CO₂ intensity.
							</p>
						</div>
						<div className="bg-gray-50 rounded-lg p-8 text-center">
							<div className="text-gray-500 text-sm mb-2">Current Mix Pie Chart</div>
							<div className="text-xs text-gray-400">
								(Pie chart component would show current generation breakdown by source)
							</div>
						</div>
						<div className="mt-4 p-4 bg-purple-50 rounded-lg">
							<details className="group">
								<summary className="cursor-pointer text-sm font-medium text-gray-900 hover:text-purple-600">
									What this shows (current mix)
								</summary>
								<div className="mt-3 text-sm text-gray-600 space-y-1">
									<div><strong>Slices:</strong> share of output by technology right now.</div>
									<div><strong>Read it:</strong> bigger renewable slices → lower expected CO₂ intensity.</div>
									<div><strong>Why it matters:</strong> quick status for operations and stakeholder reporting.</div>
								</div>
							</details>
						</div>
					</div>
				</div>

				{/* Footer Note */}
				<div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
					<p className="text-sm text-yellow-800">
						<strong>Prototype note:</strong> Data are simulated to demonstrate flows and visuals. 
						In production, data integrate from plant SCADA, fuel/efficiency logs, and emissions inventories.
					</p>
				</div>
			</div>
		</div>
	)
}


