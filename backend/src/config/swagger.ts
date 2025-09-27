import swaggerJsdoc from "swagger-jsdoc";
import { Express } from "express";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sustainability Intelligence Dashboard API",
      version: "1.0.0",
      description:
        "A comprehensive API for real-time sustainability metrics including CO2 intensity, generation mix, and net-zero alignment data.",
      contact: {
        name: "API Support",
        email: "support@sustainability-dashboard.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3002",
        description: "Development server",
      },
      {
        url: "https://api.sustainability-dashboard.com",
        description: "Production server",
      },
    ],
    components: {
      schemas: {
        Co2Row: {
          type: "object",
          properties: {
            timestamp: {
              type: "string",
              format: "date-time",
              description: "ISO 8601 timestamp of the measurement",
            },
            co2_intensity_g_per_kwh: {
              type: "number",
              format: "float",
              description: "CO2 intensity in grams per kilowatt-hour",
              example: 245.67,
            },
          },
          required: ["timestamp", "co2_intensity_g_per_kwh"],
        },
        MixRow: {
          type: "object",
          properties: {
            timestamp: {
              type: "string",
              format: "date-time",
              description: "ISO 8601 timestamp of the measurement",
            },
            hydro_mw: {
              type: "number",
              format: "float",
              description: "Hydroelectric generation in megawatts",
              example: 1250.5,
            },
            wind_mw: {
              type: "number",
              format: "float",
              description: "Wind generation in megawatts",
              example: 890.3,
            },
            solar_mw: {
              type: "number",
              format: "float",
              description: "Solar generation in megawatts",
              example: 456.7,
            },
            nuclear_mw: {
              type: "number",
              format: "float",
              description: "Nuclear generation in megawatts",
              example: 2100.0,
            },
            fossil_mw: {
              type: "number",
              format: "float",
              description: "Fossil fuel generation in megawatts",
              example: 1200.8,
            },
            renewable_share_pct: {
              type: "number",
              format: "float",
              description: "Percentage of renewable energy in the mix",
              example: 45.2,
            },
          },
          required: [
            "timestamp",
            "hydro_mw",
            "wind_mw",
            "solar_mw",
            "nuclear_mw",
            "fossil_mw",
            "renewable_share_pct",
          ],
        },
        NetZeroRow: {
          type: "object",
          properties: {
            year: {
              type: "integer",
              description: "Year of the measurement",
              example: 2024,
            },
            actual_emissions_mt: {
              type: "number",
              format: "float",
              description: "Actual emissions in million tonnes",
              example: 125.5,
            },
            target_emissions_mt: {
              type: "number",
              format: "float",
              description: "Target emissions in million tonnes",
              example: 100.0,
            },
            alignment_pct: {
              type: "number",
              format: "float",
              description: "Percentage alignment with net-zero target",
              example: 79.7,
            },
          },
          required: [
            "year",
            "actual_emissions_mt",
            "target_emissions_mt",
            "alignment_pct",
          ],
        },
        ApiResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "Indicates if the request was successful",
              example: true,
            },
            data: {
              type: "object",
              description: "Response data (varies by endpoint)",
            },
            error: {
              type: "string",
              description: "Error message if success is false",
            },
            timestamp: {
              type: "string",
              format: "date-time",
              description: "ISO 8601 timestamp of the response",
            },
          },
          required: ["success", "timestamp"],
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "string",
              description: "Error message",
              example: "Database connection failed",
            },
            timestamp: {
              type: "string",
              format: "date-time",
              description: "ISO 8601 timestamp of the error",
            },
            path: {
              type: "string",
              description: "API path where the error occurred",
              example: "/api/co2",
            },
          },
          required: ["success", "error", "timestamp", "path"],
        },
        HealthCheckResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: ["healthy", "unhealthy"],
              description: "Overall system health status",
            },
            timestamp: {
              type: "string",
              format: "date-time",
              description: "ISO 8601 timestamp of the health check",
            },
            uptime: {
              type: "integer",
              description: "Server uptime in seconds",
              example: 3600,
            },
            version: {
              type: "string",
              description: "API version",
              example: "1.0.0",
            },
            database: {
              type: "string",
              enum: ["connected", "disconnected"],
              description: "Database connection status",
            },
          },
          required: ["status", "timestamp", "uptime", "version", "database"],
        },
        DashboardData: {
          type: "object",
          properties: {
            co2: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Co2Row",
              },
              description: "CO2 intensity data points",
            },
            mix: {
              type: "array",
              items: {
                $ref: "#/components/schemas/MixRow",
              },
              description: "Generation mix data points",
            },
            netZero: {
              type: "array",
              items: {
                $ref: "#/components/schemas/NetZeroRow",
              },
              description: "Net-zero alignment data points",
            },
          },
          required: ["co2", "mix", "netZero"],
        },
      },
      parameters: {
        LimitParam: {
          name: "limit",
          in: "query",
          description: "Number of data points to return",
          required: false,
          schema: {
            type: "integer",
            minimum: 1,
            maximum: 1000,
            default: 96,
          },
        },
        Co2LimitParam: {
          name: "co2Limit",
          in: "query",
          description: "Number of CO2 data points to return",
          required: false,
          schema: {
            type: "integer",
            minimum: 1,
            maximum: 1000,
            default: 96,
          },
        },
        MixLimitParam: {
          name: "mixLimit",
          in: "query",
          description: "Number of generation mix data points to return",
          required: false,
          schema: {
            type: "integer",
            minimum: 1,
            maximum: 1000,
            default: 96,
          },
        },
        NetZeroLimitParam: {
          name: "netZeroLimit",
          in: "query",
          description: "Number of net-zero data points to return",
          required: false,
          schema: {
            type: "integer",
            minimum: 1,
            maximum: 1000,
            default: 100,
          },
        },
      },
    },
    tags: [
      {
        name: "Health",
        description: "Health check and system status endpoints",
      },
      {
        name: "CO2 Data",
        description: "CO2 intensity metrics and emissions data",
      },
      {
        name: "Generation Mix",
        description: "Energy generation mix and renewable share data",
      },
      {
        name: "Net-Zero",
        description: "Net-zero alignment and target tracking data",
      },
      {
        name: "Dashboard",
        description: "Combined dashboard data endpoints",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/server.ts"],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  // Swagger UI
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Sustainability Intelligence Dashboard API",
    })
  );

  // JSON spec endpoint
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });
};

export default specs;
