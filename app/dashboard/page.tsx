import { fetchCo2, fetchMix } from '@/lib/fetch'
import { ChartCO2 } from '@/components/ChartCO2'
import { ChartMix } from '@/components/ChartMix'

export default async function DashboardPage() {
	const [co2, mix] = await Promise.all([fetchCo2(96), fetchMix(96)])
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-semibold">Live Dashboard</h1>
			<div className="grid grid-cols-1 gap-6">
				<div className="rounded-md border p-4 bg-white/50">
					<ChartCO2 points={co2 as any} />
				</div>
				<div className="rounded-md border p-4 bg-white/50">
					<ChartMix rows={mix as any} />
				</div>
			</div>
		</div>
	)
}


