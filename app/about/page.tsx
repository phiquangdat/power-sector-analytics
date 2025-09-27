import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">About Nexus</h1>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Learn about our mission to transform sustainability reporting in the power sector 
              and help companies achieve net-zero by 2050.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            Nexus is a comprehensive sustainability intelligence platform designed specifically for 
            electricity and heat generation companies. We believe that achieving net-zero by 2050 
            requires real-time visibility, automated compliance, and data-driven decision making.
          </p>
          <p className="text-gray-600">
            Our platform transforms fragmented compliance processes into integrated, real-time 
            sustainability intelligence that helps companies not only meet regulatory requirements 
            but also gain competitive advantage in the evolving energy market.
          </p>
        </div>

        {/* Vision Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Vision</h2>
          <p className="text-gray-600 mb-6">
            We envision a future where every power generation company has the tools and insights 
            needed to accelerate their journey to net-zero. By providing real-time sustainability 
            metrics, automated compliance reporting, and advanced goal tracking, we enable 
            companies to:
          </p>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Reduce manual reporting time by up to 70%</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Enhance access to sustainability financing</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Improve investor confidence and creditworthiness</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Reduce compliance risks through automation</span>
            </li>
          </ul>
        </div>

        {/* Technology Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technology & Innovation</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Data Integration</h3>
              <p className="text-gray-600 mb-4">
                Our platform integrates data from multiple sources including plant SCADA systems, 
                fuel logs, and emissions inventories to provide 15-minute update intervals.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Analytics</h3>
              <p className="text-gray-600">
                We provide sophisticated metrics including Real-time Alignment Index, YTD Carbon 
                Budget, and Decarbonization Velocity to track progress toward net-zero goals.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Ready</h3>
              <p className="text-gray-600 mb-4">
                Built for CSRD/ESRS, EU ETS MRV, and EU Data Act compliance with automated 
                reporting capabilities that reduce manual work and errors.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Scalable Architecture</h3>
              <p className="text-gray-600">
                Cloud-native platform designed to scale with your operations and integrate 
                seamlessly with existing systems.
              </p>
            </div>
          </div>
        </div>

        {/* WISE Challenge Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">WISE Sustainability Intelligence Challenge</h2>
          <p className="text-gray-600 mb-6">
            This prototype addresses the WISE ecosystem challenge: developing innovative solutions 
            that improve sustainability practices and regulatory compliance in the power sector. 
            Built for the 1.5°C target and net-zero by 2050.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-3">Technical Innovation</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Real-time data integration from multiple sources</li>
                <li>• Advanced analytics with goal tracking metrics</li>
                <li>• EU Data Act compliant data sharing architecture</li>
                <li>• Scalable cloud-native platform</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-3">Business Impact</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 70% reduction in manual reporting hours</li>
                <li>• Enhanced access to sustainability financing</li>
                <li>• Improved investor confidence and creditworthiness</li>
                <li>• Risk reduction through automated compliance</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Target Market Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Who We Serve</h2>
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

        {/* CTA Section */}
        <div className="bg-green-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Sustainability Reporting?</h2>
          <p className="text-green-100 mb-6">
            Join the future of power sector sustainability intelligence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore the Platform
            </Link>
            <Link 
              href="/compliance"
              className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Learn About Compliance
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
