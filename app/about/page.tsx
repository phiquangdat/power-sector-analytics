import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              About Nexus
            </h1>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Meet the team behind the sustainability intelligence platform
              transforming the power sector&apos;s journey to net-zero by 2050.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Team Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Our Team
          </h2>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Md Basharul Alam
              </h3>
              <p className="text-sm text-green-600 font-medium mb-2">
                CEO & Co-Founder
              </p>
              <p className="text-sm text-gray-600">
                Former energy consultant with 15+ years in sustainability and
                regulatory compliance.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sean Afamefuna
              </h3>
              <p className="text-sm text-blue-600 font-medium mb-2">
                CTO & Co-Founder
              </p>
              <p className="text-sm text-gray-600">
                Full-stack engineer specializing in real-time data systems and
                cloud architecture.
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Elisha Itani
              </h3>
              <p className="text-sm text-purple-600 font-medium mb-2">
                Head of Data Science
              </p>
              <p className="text-sm text-gray-600">
                PhD in Environmental Engineering with expertise in carbon
                accounting and emissions modeling.
              </p>
            </div>

            {/* Team Member 4 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nnanna Otuh
              </h3>
              <p className="text-sm text-orange-600 font-medium mb-2">
                Head of Product
              </p>
              <p className="text-sm text-gray-600">
                Product strategist with deep experience in energy sector
                software and user experience design.
              </p>
            </div>

            {/* Team Member 5 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Dat Phi
              </h3>
              <p className="text-sm text-teal-600 font-medium mb-2">
                Head of Business Development
              </p>
              <p className="text-sm text-gray-600">
                Business development expert with strong connections in the
                renewable energy and utility sectors.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-green-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Transform Your Sustainability Reporting?
          </h2>
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
