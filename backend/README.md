# Sustainability Intelligence Dashboard - Backend API

A Node.js/Express backend API for the Sustainability Intelligence Dashboard, providing real-time data for CO2 intensity, generation mix, and net-zero alignment metrics.

## Features

- **Real-time Data API**: Endpoints for CO2 intensity, generation mix, and net-zero alignment data
- **Supabase Integration**: Connects to Supabase database for data storage
- **TypeScript**: Full TypeScript support with type safety
- **API Documentation**: Interactive Swagger UI with OpenAPI 3.0 specification
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Error Handling**: Comprehensive error handling and logging
- **Health Checks**: Built-in health monitoring endpoints
- **Performance**: Compression and optimized database queries

## API Endpoints

### Health Check
- `GET /health` - Server health status and database connectivity

### Data Endpoints
- `GET /api/co2?limit=96` - CO2 intensity data (default: 96 points)
- `GET /api/mix?limit=96` - Generation mix data (default: 96 points)
- `GET /api/netzero?limit=100` - Net-zero alignment data (default: 100 points)
- `GET /api/dashboard` - All dashboard data in one request
- `GET /api/co2/latest` - Latest CO2 intensity value
- `GET /api/mix/latest` - Latest generation mix data

### Documentation
- `GET /api-docs` - Interactive Swagger UI documentation
- `GET /api-docs.json` - OpenAPI specification in JSON format

### Query Parameters
- `limit`: Number of data points to return (applies to time-series data)
- `co2Limit`, `mixLimit`, `netZeroLimit`: Specific limits for dashboard endpoint

## Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account and database

### Installation

1. **Clone and navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   # Supabase Configuration
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

### Database Schema

The API expects the following Supabase tables:

#### co2_intensity
```sql
CREATE TABLE co2_intensity (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  co2_intensity_g_per_kwh DECIMAL(10,2) NOT NULL
);
```

#### generation_mix
```sql
CREATE TABLE generation_mix (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  hydro_mw DECIMAL(10,2) NOT NULL,
  wind_mw DECIMAL(10,2) NOT NULL,
  solar_mw DECIMAL(10,2) NOT NULL,
  nuclear_mw DECIMAL(10,2) NOT NULL,
  fossil_mw DECIMAL(10,2) NOT NULL,
  renewable_share_pct DECIMAL(5,2) NOT NULL
);
```

#### netzero_alignment
```sql
CREATE TABLE netzero_alignment (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  actual_emissions_mt DECIMAL(10,2) NOT NULL,
  target_emissions_mt DECIMAL(10,2) NOT NULL,
  alignment_pct DECIMAL(5,2) NOT NULL
);
```

## Development

### Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:3001` with hot reload enabled.

### API Documentation

Once the server is running, you can access the interactive API documentation at:
- **Swagger UI**: http://localhost:3001/api-docs
- **OpenAPI Spec**: http://localhost:3001/api-docs.json

The Swagger UI provides:
- Interactive API testing
- Request/response examples
- Schema definitions
- Parameter descriptions
- Error response documentation

### Build for Production
```bash
npm run build
npm start
```

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests (when implemented)

## API Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": [...],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/co2"
}
```

### Health Check Response
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "database": "connected"
}
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Type-safe request handling
- **Error Handling**: No sensitive data in error responses

## Performance Features

- **Compression**: Gzip compression for responses
- **Database Optimization**: Efficient queries with proper indexing
- **Caching Headers**: Appropriate cache headers for static data
- **Connection Pooling**: Supabase connection optimization

## Monitoring

- **Health Endpoint**: `/health` for uptime monitoring
- **Request Logging**: All requests logged with timestamps
- **Error Logging**: Comprehensive error tracking
- **Performance Metrics**: Response time monitoring

## Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

### Docker Support (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
