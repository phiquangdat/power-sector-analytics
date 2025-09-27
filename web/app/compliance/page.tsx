import Link from "next/link";

export default function CompliancePage() {
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="text-center">
						<h1 className="text-3xl font-bold text-gray-900 mb-4">Compliance & Business Value</h1>
						<p className="text-lg text-gray-600 max-w-4xl mx-auto">
							Nexus enables utilities and energy providers to remain compliant and gain competitive advantage 
							in the energy market through integrated sustainability reporting.
						</p>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Executive Summary */}
				<div className="bg-white rounded-lg border border-gray-200 p-8 mb-8 shadow-sm">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">Executive Summary</h2>
					<p className="text-gray-600 mb-4">
						The 2050 net-zero target has made sustainability an operational and financial necessity for the electricity 
						and heat generation sector. There are demands for transparency in emissions and sustainability reporting. 
						Current manual and fragmented compliance processes fail to meet the demands of new regulations and investors.
					</p>
					<p className="text-gray-600">
						<strong>Nexus</strong> is a holistic tool for sustainability reporting, designed for electricity and heat 
						generation companies. It enables utilities and energy providers to remain compliant and gain competitive 
						advantage in the energy market. It is not just a reporting tool, it is a profitability and risk reducing platform.
					</p>
				</div>

				{/* Pain Points & Solutions */}
				<div className="grid md:grid-cols-2 gap-8 mb-8">
					{/* Pain Points */}
					<div className="bg-red-50 rounded-lg border border-red-200 p-6">
						<h3 className="text-xl font-semibold text-red-800 mb-4">Current Pain Points</h3>
						<ul className="space-y-3 text-red-700">
							<li className="flex items-start">
								<span className="text-red-500 mr-2">•</span>
								<strong>Financial and regulatory risks:</strong> Fines and sanctions for non-compliance with regulatory standards
							</li>
							<li className="flex items-start">
								<span className="text-red-500 mr-2">•</span>
								<strong>Investor pressure and capital constraints:</strong> Difficulty securing financing due to non-standardized data
							</li>
							<li className="flex items-start">
								<span className="text-red-500 mr-2">•</span>
								<strong>Operational blind spots:</strong> Siloed, manual and segmented reporting that fail to provide real-time reporting
							</li>
							<li className="flex items-start">
								<span className="text-red-500 mr-2">•</span>
								<strong>Reporting overload:</strong> Excess time, labour and high risk of errors in coordinating separate data sources
							</li>
						</ul>
					</div>

					{/* Solutions */}
					<div className="bg-green-50 rounded-lg border border-green-200 p-6">
						<h3 className="text-xl font-semibold text-green-800 mb-4">What Nexus Offers</h3>
						<ul className="space-y-3 text-green-700">
							<li className="flex items-start">
								<span className="text-green-500 mr-2">•</span>
								<strong>Access to capital:</strong> Provides data to help users meet sustainability financing requirements
							</li>
							<li className="flex items-start">
								<span className="text-green-500 mr-2">•</span>
								<strong>Enhanced brand trust:</strong> Transparent reporting builds public trust and regulatory confidence
							</li>
							<li className="flex items-start">
								<span className="text-green-500 mr-2">•</span>
								<strong>Compliance and strategy:</strong> Reduces data collection time, frees up team for decarbonization planning
							</li>
							<li className="flex items-start">
								<span className="text-green-500 mr-2">•</span>
								<strong>Real-time insights:</strong> Live data visuals that help in decision making and clarity
							</li>
						</ul>
					</div>
				</div>

				{/* Regulatory Compliance */}
				<div className="bg-white rounded-lg border border-gray-200 p-8 mb-8 shadow-sm">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">Regulatory Compliance</h2>
					<div className="grid md:grid-cols-3 gap-6">
						<div className="text-center p-6 bg-blue-50 rounded-lg">
							<h3 className="text-lg font-semibold text-blue-800 mb-2">CSRD / ESRS</h3>
							<p className="text-blue-700 text-sm">
								Climate metrics and double materiality context for Corporate Sustainability Reporting Directive
							</p>
						</div>
						<div className="text-center p-6 bg-purple-50 rounded-lg">
							<h3 className="text-lg font-semibold text-purple-800 mb-2">EU ETS MRV</h3>
							<p className="text-purple-700 text-sm">
								Operational Monitoring, Reporting, and Verification concepts for emissions trading
							</p>
						</div>
						<div className="text-center p-6 bg-indigo-50 rounded-lg">
							<h3 className="text-lg font-semibold text-indigo-800 mb-2">EU Data Act</h3>
							<p className="text-indigo-700 text-sm">
								Data access and sharing considerations with secure interoperability
							</p>
						</div>
					</div>
				</div>

				{/* Business Impact */}
				<div className="bg-white rounded-lg border border-gray-200 p-8 mb-8 shadow-sm">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">Measurable Business Impact</h2>
					<div className="grid md:grid-cols-3 gap-6">
						<div className="text-center">
							<div className="text-3xl font-bold text-green-600 mb-2">70%</div>
							<div className="text-sm text-gray-600">Reduction in manual reporting hours</div>
						</div>
						<div className="text-center">
							<div className="text-3xl font-bold text-blue-600 mb-2">Enhanced</div>
							<div className="text-sm text-gray-600">Access to sustainability financing</div>
						</div>
						<div className="text-center">
							<div className="text-3xl font-bold text-purple-600 mb-2">Improved</div>
							<div className="text-sm text-gray-600">Investor confidence and creditworthiness</div>
						</div>
					</div>
				</div>

				{/* Target Customers */}
				<div className="bg-white rounded-lg border border-gray-200 p-8 mb-8 shadow-sm">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">Target Customers</h2>
					<div className="grid md:grid-cols-2 gap-8">
						<div>
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Customers</h3>
							<ul className="space-y-2 text-gray-600">
								<li>• Independent power producers</li>
								<li>• Industrial heat generation companies</li>
								<li>• District heating providers</li>
								<li>• Electricity and heat generation companies</li>
							</ul>
						</div>
						<div>
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Market Drivers</h3>
							<ul className="space-y-2 text-gray-600">
								<li>• Global push for decarbonization and net-zero targets</li>
								<li>• Stricter compliance requirements under US IRA and EU Green Deal</li>
								<li>• Investor and consumer demand for transparent sustainability metrics</li>
								<li>• Companies that can't track sustainability can't participate</li>
							</ul>
						</div>
					</div>
				</div>

				{/* CTA */}
				<div className="bg-green-600 rounded-lg p-8 text-center text-white">
					<h2 className="text-2xl font-bold mb-4">Ready to Transform Your Compliance?</h2>
					<p className="text-green-100 mb-6">
						Join the future of power sector sustainability intelligence
					</p>
					<Link 
						href="/dashboard"
						className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
					>
						Explore the Platform
					</Link>
				</div>
			</div>
		</div>
	)
}



