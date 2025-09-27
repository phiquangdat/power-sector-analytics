"use client";

import { useState } from "react";

export default function MethodologyPage() {
  const [selectedSection, setSelectedSection] = useState("all");

  const sections = [
    { id: "all", name: "All Sections", icon: "📊" },
    { id: "co2", name: "CO₂ Intensity", icon: "⚡" },
    { id: "mix", name: "Generation Mix", icon: "🔋" },
    { id: "renewable", name: "Renewable Share", icon: "🌱" },
    { id: "netzero", name: "Net-zero Alignment", icon: "🎯" },
    { id: "advanced", name: "Advanced Metrics", icon: "📈" },
    { id: "implementation", name: "Implementation", icon: "⚙️" },
  ];

  const shouldShowSection = (sectionId: string) => {
    return selectedSection === "all" || selectedSection === sectionId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50">
      {/* Hero Header */}
      <div className="relative bg-blue-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <svg
                className="w-8 h-8 text-white"
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Methodology & Metrics
            </h1>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Comprehensive explanations of our sustainability metrics,
              calculations, and methodologies. Transparent, industry-standard
              approaches for accurate reporting and compliance.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Filter */}
        <div className="mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Choose a Section
              </h3>
              <p className="text-sm text-gray-600">
                Select what you want to learn about
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    selectedSection === section.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span>{section.icon}</span>
                  {section.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Core Metrics Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Core Sustainability Metrics
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Essential indicators for tracking environmental performance and
              regulatory compliance
            </p>
          </div>

          <div className="space-y-8">
            {/* CO₂ Intensity */}
            {shouldShowSection("co2") && (
              <div
                className="group bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-green-300"
                id="co2"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-red-200 transition-colors">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      CO₂ Intensity
                    </h2>
                    <p className="text-sm text-gray-500 font-mono">g/kWh</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <svg
                          className="w-5 h-5 text-blue-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        What it measures
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Carbon emitted per unit electricity generated. This is
                        the core emissions intensity indicator for CSRD/ESRS
                        climate metrics and regulatory compliance.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        How to read it
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        <strong className="text-green-600">
                          Lower is better.
                        </strong>{" "}
                        Spikes often indicate lower renewable availability or
                        outages. Downward trend indicates decarbonization
                        progress.
                      </p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 text-purple-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      Calculation Method
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Simulated Data
                        </p>
                        <p className="text-sm text-gray-600">
                          Derived from generation mix (higher renewables → lower
                          intensity), with realistic variability (weather,
                          outages).
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Production Formula
                        </p>
                        <p className="text-sm text-gray-600 font-mono">
                          Total CO₂ emissions ÷ Total electricity generated
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Generation Mix */}
            {shouldShowSection("mix") && (
              <div
                className="group bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-300"
                id="mix"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Generation Mix
                    </h2>
                    <p className="text-sm text-gray-500 font-mono">
                      MW by Source
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <svg
                          className="w-5 h-5 text-blue-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        What it measures
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Electricity generated by source (hydro, wind, solar,
                        nuclear, fossil) over time. Supports ESRS disclosures on
                        energy mix and renewable share.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        How to read it
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        The stacked area height ≈ total output.{" "}
                        <strong className="text-blue-600">
                          Larger renewable area → typically lower CO₂ intensity.
                        </strong>
                      </p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 text-purple-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      Data Sources
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Simulated Data
                        </p>
                        <p className="text-sm text-gray-600">
                          Supply by technology, scaled to demand with
                          diurnal/weather factors.
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Production Data
                        </p>
                        <p className="text-sm text-gray-600">
                          Real-time data from plant SCADA systems
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Renewable Share */}
            {shouldShowSection("renewable") && (
              <div
                className="group bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-green-300"
                id="renewable"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Renewable Share
                    </h2>
                    <p className="text-sm text-gray-500 font-mono">
                      % of Total Generation
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <svg
                          className="w-5 h-5 text-blue-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        What it measures
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Percentage of total generation from renewables (hydro +
                        wind + solar).
                        <strong className="text-green-600">
                          Higher is generally good;
                        </strong>{" "}
                        expect CO₂ intensity to fall as share rises.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <svg
                          className="w-5 h-5 text-purple-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                        Formula
                      </h3>
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                        <p className="text-gray-700 font-mono text-sm">
                          renewable_share_pct = 100 × (hydro_mw + wind_mw +
                          solar_mw) ÷ total_mw
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
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
                      Key Insights
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        Direct correlation with CO₂ intensity
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        Supports renewable energy targets
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        Key metric for investor reporting
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        Regulatory compliance indicator
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Net-zero Alignment */}
            {shouldShowSection("netzero") && (
              <div
                className="group bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-300"
                id="netzero"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                    <svg
                      className="w-6 h-6 text-purple-600"
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
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Net-zero Alignment
                    </h2>
                    <p className="text-sm text-gray-500 font-mono">
                      % vs Target Pathway
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <svg
                          className="w-5 h-5 text-blue-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        What it measures
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Annual progress vs a target emissions pathway.{" "}
                        <strong className="text-green-600">
                          100% = on or ahead of plan;
                        </strong>{" "}
                        &lt;100% = behind plan.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <svg
                          className="w-5 h-5 text-purple-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                        Formula
                      </h3>
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                        <p className="text-gray-700 font-mono text-sm">
                          alignment_pct = 100 × target_emissions_mt ÷
                          actual_emissions_mt (capped at 100%)
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 text-purple-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Usage & Applications
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        Long-term decarbonization tracking
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        Regulatory compliance reporting
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        Investor progress updates
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        Strategic planning validation
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Goal Tracker Metrics Section */}
        {shouldShowSection("advanced") && (
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Advanced Goal Tracker Metrics
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Sophisticated calculations for real-time progress monitoring and
                strategic planning
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {/* Real-time Alignment Index */}
              <div className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-orange-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors">
                    <svg
                      className="w-5 h-5 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Real-time Alignment Index
                    </h3>
                    <p className="text-xs text-gray-500 font-mono">RAI</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                      <svg
                        className="w-4 h-4 text-blue-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      What it measures
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      How current carbon intensity compares to this year&apos;s
                      target intensity.
                      <strong className="text-green-600">
                        100% = on target;
                      </strong>{" "}
                      &gt;100% better than target; &lt;100% behind.
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-3 border border-orange-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Formula
                    </h4>
                    <p className="text-xs text-gray-700 font-mono">
                      RAI = 100 × I_target(year) ÷ I_current
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Components
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                        I_current: Latest CO₂ intensity reading
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                        I_target(year): Inferred from annual targets
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                        Proportional scaling from base year intensity
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* YTD Carbon Budget */}
              <div className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-red-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                    <svg
                      className="w-5 h-5 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      YTD Carbon Budget
                    </h3>
                    <p className="text-xs text-gray-500 font-mono">
                      Year-to-Date Tracking
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                      <svg
                        className="w-4 h-4 text-blue-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      What it measures
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Whether cumulative emissions so far are within the
                      year-to-date (YTD) budget.
                      <strong className="text-green-600">
                        Positive days → ahead (good);
                      </strong>{" "}
                      negative → behind (bad).
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-3 border border-red-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Key Calculations
                    </h4>
                    <div className="space-y-1 text-xs text-gray-700 font-mono">
                      <div>
                        YTD_budget = annual_target × (elapsed_days ÷ 365)
                      </div>
                      <div>YTD_tons = Σ (total_mw × Δt × intensity × 1e−3)</div>
                      <div>
                        Days ahead/behind = (budget − actual) ÷ avg_daily
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Usage
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                        Monthly/quarterly progress tracking
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                        Early warning system for overruns
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></div>
                        Operational adjustment triggers
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                        Regulatory reporting support
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decarbonization Velocity */}
              <div className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-indigo-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-indigo-200 transition-colors">
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Decarbonization Velocity
                    </h3>
                    <p className="text-xs text-gray-500 font-mono">
                      g/kWh per year
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                      <svg
                        className="w-4 h-4 text-blue-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      What it measures
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Is intensity falling fast enough to meet the year-end
                      target?
                      <strong className="text-green-600">
                        &quot;On track&quot;
                      </strong>{" "}
                      if current decline rate is sufficient; otherwise
                      &quot;Behind&quot;.
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Key Calculations
                    </h4>
                    <div className="space-y-1 text-xs text-gray-700 font-mono">
                      <div>Actual velocity: Slope over last ~7 days</div>
                      <div>
                        Required: (I_current − I_target) × 365 ÷ days_left
                      </div>
                      <div>On track: v_actual ≥ v_required</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Usage
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></div>
                        Performance vs required pace
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                        Strategy adjustment triggers
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></div>
                        Risk assessment tool
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2050 Pathway */}
              <div className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-teal-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-teal-200 transition-colors">
                    <svg
                      className="w-5 h-5 text-teal-600"
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
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      2050 Pathway Alignment
                    </h3>
                    <p className="text-xs text-gray-500 font-mono">
                      Net-Zero Trajectory
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                      <svg
                        className="w-4 h-4 text-blue-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      What it measures
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Relation to the net-zero pathway and an illustrative ETA
                      to near-zero.
                      <strong className="text-green-600">
                        Higher alignment is better;
                      </strong>{" "}
                      ETA closer to/before 2050 is better.
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-3 border border-teal-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Key Metrics
                    </h4>
                    <div className="space-y-1 text-xs text-gray-700 font-mono">
                      <div>
                        Alignment: 100 × target ÷ actual (capped at 100%)
                      </div>
                      <div>ETA: current_year + I_current ÷ v_actual</div>
                      <div>Pathway: target emissions per year to 2050</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Assumptions
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></div>
                        Base year: earliest year in data
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></div>
                        2050 target: 0 Mt emissions
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                        Proportional intensity scaling
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></div>
                        Illustrative ETA for guidance only
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Sources & Notes */}
        {shouldShowSection("implementation") && (
          <div className="mt-16">
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border border-blue-200 p-8 shadow-lg">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Data Sources & Implementation
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Transparent documentation of our data sources, methodologies,
                  and production readiness
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-blue-200">
                  <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                    <svg
                      className="w-6 h-6 text-blue-600 mr-3"
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
                    Current Implementation
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm">
                        Simulated data for demonstration
                      </span>
                    </div>
                    <div className="flex items-center text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm">
                        15-minute update intervals
                      </span>
                    </div>
                    <div className="flex items-center text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm">
                        Realistic weather and operational variations
                      </span>
                    </div>
                    <div className="flex items-center text-blue-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm">Diurnal demand patterns</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-200">
                  <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center">
                    <svg
                      className="w-6 h-6 text-green-600 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Production Ready
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm">
                        Plant SCADA system integration
                      </span>
                    </div>
                    <div className="flex items-center text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm">Fuel and efficiency logs</span>
                    </div>
                    <div className="flex items-center text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm">Emissions inventories</span>
                    </div>
                    <div className="flex items-center text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm">Real-time API connections</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
