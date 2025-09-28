"use client";
import { useState, useEffect } from "react";

interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  parameters?: Array<{
    name: string;
    type: string;
    description: string;
    required: boolean;
  }>;
  response: {
    type: string;
    description: string;
    example?: any;
  };
}

export default function ApiDocsPage() {
  const [apiStatus, setApiStatus] = useState<"loading" | "online" | "offline">("loading");
  const [apiVersion, setApiVersion] = useState<string>("");

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/system/health");
        if (response.ok) {
          const data = await response.json();
          setApiStatus("online");
          setApiVersion(data.version);
        } else {
          setApiStatus("offline");
        }
      } catch (error) {
        setApiStatus("offline");
      }
    };

    checkApiStatus();
  }, []);

  const endpoints: ApiEndpoint[] = [
    {
      method: "GET",
      path: "/api/co2",
      description: "Get real-time CO₂ intensity data",
      response: {
        type: "Array<CO2Data>",
        description: "List of CO₂ intensity measurements",
        example: [
          {
            timestamp: "2024-01-15T10:30:00Z",
            co2_intensity_g_per_kwh: 245.7
          }
        ]
      }
    },
    {
      method: "GET",
      path: "/api/mix",
      description: "Get generation mix data by source",
      response: {
        type: "Array<MixData>",
        description: "List of generation mix measurements",
        example: [
          {
            timestamp: "2024-01-15T10:30:00Z",
            hydro_mw: 1200.5,
            wind_mw: 800.2,
            solar_mw: 450.8,
            nuclear_mw: 2100.0,
            fossil_mw: 1800.3,
            total_mw: 6351.8,
            renewable_share_pct: 38.6,
            co2_intensity_g_per_kwh: 245.7
          }
        ]
      }
    },
    {
      method: "GET",
      path: "/api/netzero",
      description: "Get net-zero alignment data",
      response: {
        type: "Array<NetZeroData>",
        description: "Annual emissions targets and performance",
        example: [
          {
            year: 2024,
            actual_emissions_mt: 95.2,
            target_emissions_mt: 100.0,
            alignment_pct: 95.2
          }
        ]
      }
    },
    {
      method: "GET",
      path: "/api/analytics/goal_tracker",
      description: "Get comprehensive goal tracking analysis",
      response: {
        type: "GoalTrackerData",
        description: "Advanced analytics including anomalies, correlation, and projections",
        example: {
          rai_pct: 87.5,
          budget: {
            ytd_tons: 45000,
            ytd_budget_tons: 48000,
            days_ahead: 12
          },
          velocity: {
            on_track: true,
            v_actual_g_per_kwh_per_yr: -15.2,
            v_required_g_per_kwh_per_yr: -12.0
          },
          anomalies: {
            count: 3,
            recent: [
              {
                timestamp: "2024-01-15T08:45:00Z",
                co2_intensity_g_per_kwh: 320.5,
                isAnomaly: true,
                deviation: 2.8,
                severity: "medium"
              }
            ],
            severity: { low: 1, medium: 2, high: 0 }
          },
          correlation: {
            correlation: -0.85,
            strength: "strong",
            direction: "negative",
            sampleSize: 720
          }
        }
      }
    },
    {
      method: "GET",
      path: "/api/analytics/dashboard",
      description: "Get complete dashboard data",
      response: {
        type: "DashboardData",
        description: "All data needed for the sustainability dashboard",
        example: {
          co2: [],
          mix: [],
          netzero: [],
          goal_tracker: {},
          timestamp: "2024-01-15T10:30:00Z"
        }
      }
    },
    {
      method: "GET",
      path: "/api/system/health",
      description: "Health check endpoint",
      response: {
        type: "HealthData",
        description: "API status and version information",
        example: {
          status: "healthy",
          timestamp: "2024-01-15T10:30:00Z",
          version: "1.0.0",
          services: {
            simulator: "operational",
            analytics: "operational",
            data_generation: "operational"
          }
        }
      }
    }
  ];

  const dataModels = [
    {
      name: "CO2Data",
      description: "CO₂ intensity measurement",
      fields: [
        { name: "timestamp", type: "string", description: "ISO timestamp" },
        { name: "co2_intensity_g_per_kwh", type: "number", description: "CO₂ intensity in g/kWh" }
      ]
    },
    {
      name: "MixData",
      description: "Generation mix by source",
      fields: [
        { name: "timestamp", type: "string", description: "ISO timestamp" },
        { name: "hydro_mw", type: "number", description: "Hydroelectric generation in MW" },
        { name: "wind_mw", type: "number", description: "Wind generation in MW" },
        { name: "solar_mw", type: "number", description: "Solar generation in MW" },
        { name: "nuclear_mw", type: "number", description: "Nuclear generation in MW" },
        { name: "fossil_mw", type: "number", description: "Fossil fuel generation in MW" },
        { name: "total_mw", type: "number", description: "Total generation in MW" },
        { name: "renewable_share_pct", type: "number", description: "Renewable share percentage" },
        { name: "co2_intensity_g_per_kwh", type: "number", description: "CO₂ intensity in g/kWh" }
      ]
    },
    {
      name: "AnomalyData",
      description: "Anomaly detection result",
      fields: [
        { name: "timestamp", type: "string", description: "ISO timestamp" },
        { name: "co2_intensity_g_per_kwh", type: "number", description: "CO₂ intensity at anomaly" },
        { name: "isAnomaly", type: "boolean", description: "Whether this is an anomaly" },
        { name: "deviation", type: "number", description: "Statistical deviation" },
        { name: "severity", type: "string", description: "Severity level: low, medium, high" }
      ]
    },
    {
      name: "CorrelationData",
      description: "Correlation analysis result",
      fields: [
        { name: "correlation", type: "number", description: "Correlation coefficient" },
        { name: "strength", type: "string", description: "Correlation strength: weak, moderate, strong" },
        { name: "direction", type: "string", description: "Correlation direction: positive, negative" },
        { name: "sampleSize", type: "number", description: "Number of data points used" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Nexus Sustainability Intelligence API
              </h1>
              <p className="text-gray-600 mt-2">
                Comprehensive API for sustainability data simulation, analysis, and monitoring
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    apiStatus === "online"
                      ? "bg-green-500"
                      : apiStatus === "loading"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm text-gray-600 capitalize">
                  {apiStatus}
                </span>
              </div>
              {apiVersion && (
                <span className="text-sm text-gray-500">v{apiVersion}</span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Start</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Base URL</h3>
              <code className="bg-gray-100 px-3 py-2 rounded text-sm">
                http://127.0.0.1:5000
              </code>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Interactive Documentation</h3>
              <a
                href="http://127.0.0.1:5000/docs/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                http://127.0.0.1:5000/docs/
              </a>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Example Request</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                <code>{`curl -X GET "http://127.0.0.1:5000/api/co2" \\
  -H "Content-Type: application/json"`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Endpoints */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">API Endpoints</h2>
          <div className="space-y-6">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-center space-x-4 mb-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      endpoint.method === "GET"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {endpoint.method}
                  </span>
                  <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {endpoint.path}
                  </code>
                </div>
                <p className="text-gray-700 mb-4">{endpoint.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Response</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Type:</strong> {endpoint.response.type}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        <strong>Description:</strong> {endpoint.response.description}
                      </div>
                      {endpoint.response.example && (
                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-2">Example:</div>
                          <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
                            <code>{JSON.stringify(endpoint.response.example, null, 2)}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Models */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Models</h2>
          <div className="space-y-6">
            {dataModels.map((model, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="mb-3">
                  <h3 className="text-lg font-medium text-gray-900">{model.name}</h3>
                  <p className="text-gray-600 text-sm">{model.description}</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 font-medium text-gray-900">Field</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-900">Type</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-900">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {model.fields.map((field, fieldIndex) => (
                        <tr key={fieldIndex} className="border-b border-gray-100">
                          <td className="py-2 px-3 font-mono text-blue-600">{field.name}</td>
                          <td className="py-2 px-3 text-gray-600">{field.type}</td>
                          <td className="py-2 px-3 text-gray-600">{field.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Real-time Simulation</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Advanced power plant simulation algorithms</li>
                <li>• Realistic generation mix modeling</li>
                <li>• Dynamic CO₂ intensity calculations</li>
                <li>• 15-minute interval data generation</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Advanced Analytics</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Anomaly detection with statistical analysis</li>
                <li>• Correlation analysis between variables</li>
                <li>• Goal tracking and progress monitoring</li>
                <li>• Predictive forecasting capabilities</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Sustainability Metrics</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Real-time Alignment Index (RAI)</li>
                <li>• Carbon budget tracking</li>
                <li>• Decarbonization velocity</li>
                <li>• Net-zero pathway projections</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">API Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• RESTful API design</li>
                <li>• OpenAPI/Swagger documentation</li>
                <li>• JSON response format</li>
                <li>• Comprehensive error handling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
