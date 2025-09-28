# Deployment Guide for Nexus Sustainability Intelligence API

## Free Hosting Options

### 1. Railway (Recommended)

- **Free Tier**: $5 credit monthly (enough for small apps)
- **Features**: Auto-deploy from GitHub, custom domains, SSL
- **Deployment**: Connect GitHub repo, auto-detects Flask

### 2. Render

- **Free Tier**: 512MB RAM, sleeps after 15min inactivity
- **Features**: Auto-deploy from GitHub, custom domains
- **Deployment**: Connect GitHub repo, select Python environment

### 3. Fly.io

- **Free Tier**: 256MB RAM, 1GB storage
- **Features**: Global deployment, persistent storage
- **Deployment**: Use fly CLI or GitHub integration

### 4. Heroku (Limited Free)

- **Free Tier**: No longer available (paid only)
- **Alternative**: Use Railway or Render

## Deployment Steps

### Option 1: Railway (Easiest)

1. **Sign up** at [railway.app](https://railway.app)
2. **Connect GitHub** repository
3. **Create new project** from GitHub repo
4. **Railway auto-detects** Flask app
5. **Deploy** - your API will be live!

### Option 2: Render

1. **Sign up** at [render.com](https://render.com)
2. **Connect GitHub** repository
3. **Create new Web Service**
4. **Configure**:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn api.index:app --bind 0.0.0.0:$PORT`
5. **Deploy**

### Option 3: Fly.io

1. **Install fly CLI**: `curl -L https://fly.io/install.sh | sh`
2. **Login**: `fly auth login`
3. **Initialize**: `fly launch` (creates fly.toml)
4. **Deploy**: `fly deploy`

## Environment Variables

Set these in your hosting platform:

```
PORT=5000
FLASK_ENV=production
CORS_ORIGINS=https://your-frontend-domain.com
```

## Testing Your Deployment

After deployment, test these endpoints:

- `GET /` - API info
- `GET /docs/` - Swagger UI
- `GET /api/co2/` - CO₂ data
- `GET /api/system/health` - Health check

## Troubleshooting

### Common Issues:

1. **Port binding**: Ensure app binds to `0.0.0.0:$PORT`
2. **Dependencies**: Check `requirements.txt` includes all packages
3. **CORS**: Update CORS origins for your frontend domain
4. **Memory**: Free tiers have limited RAM, monitor usage

### Logs:

- Railway: View logs in dashboard
- Render: View logs in service dashboard
- Fly.io: `fly logs`

## Cost Considerations

- **Railway**: $5/month credit (usually free for small apps)
- **Render**: Free tier sleeps after inactivity
- **Fly.io**: Free tier with usage limits

## Next Steps

1. Choose a platform (Railway recommended)
2. Deploy your API
3. Update frontend to use new API URL
4. Test all endpoints
5. Set up monitoring/alerts
