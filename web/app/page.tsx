import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-green-600">Nexus</h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/dashboard" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                <Link href="/compliance" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Compliance
                </Link>
                <Link href="/methodology" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Methodology
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Sustainability Intelligence
            <span className="block text-green-600">for Power Sector</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Real-time sustainability metrics and compliance reporting for electricity and heat generation companies. 
            Accelerate your journey to net-zero 2050 with data-driven insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              View Live Dashboard
            </Link>
            <Link 
              href="/compliance"
              className="border border-green-600 text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Learn About Compliance
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Nexus?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transform fragmented compliance processes into integrated, real-time sustainability intelligence
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-green-50">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Monitoring</h3>
              <p className="text-gray-600">
                Live CO₂ intensity, generation mix, and net-zero alignment tracking with 15-minute updates
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-blue-50">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Compliance Ready</h3>
              <p className="text-gray-600">
                Built for CSRD/ESRS, EU ETS MRV, and EU Data Act compliance with automated reporting
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-purple-50">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Goal Tracking</h3>
              <p className="text-gray-600">
                Advanced metrics: Real-time Alignment Index, YTD Carbon Budget, and Decarbonization Velocity
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Context */}
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">WISE Sustainability Intelligence Challenge</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
              This prototype addresses the WISE ecosystem challenge: developing innovative solutions that improve 
              sustainability practices and regulatory compliance in the power sector. Built for the 1.5°C target 
              and net-zero by 2050.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-4 text-green-400">Technical Innovation</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Real-time data integration from multiple sources</li>
                  <li>• Advanced analytics with goal tracking metrics</li>
                  <li>• EU Data Act compliant data sharing architecture</li>
                  <li>• Scalable cloud-native platform</li>
                </ul>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-4 text-green-400">Business Impact</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• 70% reduction in manual reporting hours</li>
                  <li>• Enhanced access to sustainability financing</li>
                  <li>• Improved investor confidence and creditworthiness</li>
                  <li>• Risk reduction through automated compliance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        </div>

      {/* CTA Section */}
      <div className="bg-green-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Sustainability Reporting?</h2>
          <p className="text-xl text-green-100 mb-8">
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

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-green-400 mb-4">Nexus</h3>
            <p className="text-gray-400 mb-6">
              Sustainability Intelligence Platform for the Power Sector
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
              <Link href="/compliance" className="text-gray-400 hover:text-white transition-colors">Compliance</Link>
              <Link href="/methodology" className="text-gray-400 hover:text-white transition-colors">Methodology</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
