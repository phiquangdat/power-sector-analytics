
# Render.com Deployment Instructions

## Step 1: Create Web Service on Render

1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:

### Basic Settings:
- **Name**: `nexus-sustainability-api`
- **Environment**: `Python 3`
- **Region**: `Oregon (US West)`
- **Branch**: `main` (or your current branch)

### Build & Deploy:
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `cd api && gunicorn index:app --bind 0.0.0.0:$PORT`

### Plan:
- **Free**: Limited resources, may sleep after inactivity
- **Starter**: $7/month, always running

### Environment Variables (optional):
- `PYTHON_VERSION`: `3.9.18`
- `FLASK_ENV`: `production`

## Step 2: Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete (5-10 minutes)
3. Your API will be available at: `https://nexus-sustainability-api.onrender.com`

## Step 3: Test Deployment
Test these endpoints:
- `GET /` - API information
- `GET /api/system/health` - Health check
- `GET /api/co2/` - CO₂ data
- `GET /api/mix/` - Generation mix data
- `GET /api/netzero/` - Net-zero alignment data

## Step 4: Update Frontend
Update `vercel.json` with your Render URL:
```json
{
  "env": {
    "NEXT_PUBLIC_API_URL": "https://nexus-sustainability-api.onrender.com"
  }
}
```

## Troubleshooting

### Common Issues:
1. **Build fails**: Check that all dependencies are in `requirements.txt`
2. **App crashes**: Check logs in Render dashboard
3. **CORS errors**: Update CORS origins in Flask app
4. **Slow responses**: Consider upgrading to Starter plan

### Logs:
- View logs in Render dashboard under "Logs" tab
- Check for import errors or missing dependencies
- Monitor memory usage and response times

## Next Steps:
1. Set up custom domain (optional)
2. Configure monitoring and alerts
3. Set up database (PostgreSQL) for persistent data
4. Implement caching (Redis) for better performance
