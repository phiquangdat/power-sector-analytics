import Link from "next/link";

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-light text-gray-900 mb-6">
            Compliance & Business Value
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Nexus enables utilities and energy providers to remain compliant and
            gain competitive advantage in the energy market through integrated
            sustainability reporting.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        {/* Executive Summary */}
        <div className="mb-16">
          <h2 className="text-2xl font-light text-gray-900 mb-6">
            Executive Summary
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              The 2050 net-zero target has made sustainability an operational
              and financial necessity for the electricity and heat generation
              sector. There are demands for transparency in emissions and
              sustainability reporting. Current manual and fragmented compliance
              processes fail to meet the demands of new regulations and
              investors.
            </p>
            <p>
              <strong>Nexus</strong> is a holistic tool for sustainability
              reporting, designed for electricity and heat generation companies.
              It enables utilities and energy providers to remain compliant and
              gain competitive advantage in the energy market. It is not just a
              reporting tool, it is a profitability and risk reducing platform.
            </p>
          </div>
        </div>

        {/* Pain Points & Solutions */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Pain Points */}
          <div>
            <h3 className="text-xl font-medium text-gray-900 mb-6">
              Current Pain Points
            </h3>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">•</span>
                <span>
                  <strong>Financial and regulatory risks:</strong> Fines and
                  sanctions for non-compliance with regulatory standards
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">•</span>
                <span>
                  <strong>Investor pressure and capital constraints:</strong>{" "}
                  Difficulty securing financing due to non-standardized data
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">•</span>
                <span>
                  <strong>Operational blind spots:</strong> Siloed, manual and
                  segmented reporting that fail to provide real-time reporting
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-3 mt-1">•</span>
                <span>
                  <strong>Reporting overload:</strong> Excess time, labour and
                  high risk of errors in coordinating separate data sources
                </span>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-xl font-medium text-gray-900 mb-6">
              What Nexus Offers
            </h3>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">•</span>
                <span>
                  <strong>Access to capital:</strong> Provides data to help
                  users meet sustainability financing requirements
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">•</span>
                <span>
                  <strong>Enhanced brand trust:</strong> Transparent reporting
                  builds public trust and regulatory confidence
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">•</span>
                <span>
                  <strong>Compliance and strategy:</strong> Reduces data
                  collection time, frees up team for decarbonization planning
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">•</span>
                <span>
                  <strong>Real-time insights:</strong> Live data visuals that
                  help in decision making and clarity
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Compliance */}
        <div className="mb-16">
          <h2 className="text-2xl font-light text-gray-900 mb-8">
            Regulatory Compliance
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                CSRD / ESRS
              </h3>
              <p className="text-gray-600 text-sm">
                Climate metrics and double materiality context for Corporate
                Sustainability Reporting Directive
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                EU ETS MRV
              </h3>
              <p className="text-gray-600 text-sm">
                Operational Monitoring, Reporting, and Verification concepts for
                emissions trading
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-indigo-500 rounded-full"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                EU Data Act
              </h3>
              <p className="text-gray-600 text-sm">
                Data access and sharing considerations with secure
                interoperability
              </p>
            </div>
          </div>
        </div>

        {/* Business Impact */}
        <div className="mb-16">
          <h2 className="text-2xl font-light text-gray-900 mb-8">
            Measurable Business Impact
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-light text-green-600 mb-2">70%</div>
              <div className="text-gray-600">
                Reduction in manual reporting hours
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-blue-600 mb-2">
                Enhanced
              </div>
              <div className="text-gray-600">
                Access to sustainability financing
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-purple-600 mb-2">
                Improved
              </div>
              <div className="text-gray-600">
                Investor confidence and creditworthiness
              </div>
            </div>
          </div>
        </div>

        {/* Target Customers */}
        <div className="mb-16">
          <h2 className="text-2xl font-light text-gray-900 mb-8">
            Target Customers
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Primary Customers
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Independent power producers</li>
                <li>• Industrial heat generation companies</li>
                <li>• District heating providers</li>
                <li>• Electricity and heat generation companies</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Market Drivers
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Global push for decarbonization and net-zero targets</li>
                <li>
                  • Stricter compliance requirements under US IRA and EU Green
                  Deal
                </li>
                <li>
                  • Investor and consumer demand for transparent sustainability
                  metrics
                </li>
                <li>
                  • Companies that can&apos;t track sustainability can&apos;t
                  participate
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
