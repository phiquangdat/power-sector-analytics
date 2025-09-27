import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-light text-gray-900 mb-6">
            About Nexus
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Meet the team behind the sustainability intelligence platform
            transforming the power sector&apos;s journey to net-zero by 2050.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Team Member 1 */}
          <div className="text-center group">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-50 transition-colors duration-300">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">MA</span>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Md Basharul Alam
            </h3>
            <p className="text-sm text-green-600 mb-3">
              CEO & Co-Founder
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              15+ years in sustainability and regulatory compliance
            </p>
          </div>

          {/* Team Member 2 */}
          <div className="text-center group">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-50 transition-colors duration-300">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">SA</span>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Sean Afamefuna
            </h3>
            <p className="text-sm text-blue-600 mb-3">
              CTO & Co-Founder
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Full-stack engineer specializing in real-time data systems
            </p>
          </div>

          {/* Team Member 3 */}
          <div className="text-center group">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-50 transition-colors duration-300">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">EI</span>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Elisha Itani
            </h3>
            <p className="text-sm text-purple-600 mb-3">
              Head of Data Science
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              PhD in Environmental Engineering with carbon expertise
            </p>
          </div>

          {/* Team Member 4 */}
          <div className="text-center group">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-50 transition-colors duration-300">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">NO</span>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Nnanna Otuh
            </h3>
            <p className="text-sm text-orange-600 mb-3">
              Head of Product
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Product strategist with energy sector experience
            </p>
          </div>

          {/* Team Member 5 */}
          <div className="text-center group">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-teal-50 transition-colors duration-300">
              <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">DP</span>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Dat Phi
            </h3>
            <p className="text-sm text-teal-600 mb-3">
              Head of Business Development
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Business development expert in renewable energy
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            Ready to Transform Your Sustainability Reporting?
          </h2>
          <p className="text-gray-600 mb-8">
            Join the future of power sector sustainability intelligence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Explore the Platform
            </Link>
            <Link
              href="/compliance"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Learn About Compliance
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}