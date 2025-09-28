#!/usr/bin/env python3
"""
Deploy the Flask backend to Render.com
"""
import os
import subprocess
import sys
import json
import time
import requests
from pathlib import Path

def check_git_status():
    """Check if we're in a git repository and if there are uncommitted changes"""
    print("🔍 Checking git status...")
    
    try:
        # Check if we're in a git repo
        result = subprocess.run(['git', 'status', '--porcelain'], 
                              capture_output=True, text=True, check=True)
        
        if result.stdout.strip():
            print("⚠️  You have uncommitted changes:")
            print(result.stdout)
            response = input("Do you want to commit these changes? (y/n): ")
            if response.lower() == 'y':
                commit_message = input("Enter commit message: ") or "Deploy backend fixes"
                subprocess.run(['git', 'add', '.'], check=True)
                subprocess.run(['git', 'commit', '-m', commit_message], check=True)
                print("✅ Changes committed")
            else:
                print("❌ Please commit your changes before deploying")
                return False
        else:
            print("✅ No uncommitted changes")
        
        return True
    except subprocess.CalledProcessError:
        print("❌ Not in a git repository or git not available")
        return False

def push_to_github():
    """Push changes to GitHub"""
    print("📤 Pushing to GitHub...")
    
    try:
        # Get current branch
        result = subprocess.run(['git', 'branch', '--show-current'], 
                              capture_output=True, text=True, check=True)
        branch = result.stdout.strip()
        
        # Push to origin
        subprocess.run(['git', 'push', 'origin', branch], check=True)
        print(f"✅ Pushed to GitHub (branch: {branch})")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to push to GitHub: {e}")
        return False

def create_render_deployment_instructions():
    """Create instructions for manual Render deployment"""
    instructions = """
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
"""
    
    with open("RENDER_DEPLOYMENT_INSTRUCTIONS.md", "w") as f:
        f.write(instructions)
    
    print("📋 Created RENDER_DEPLOYMENT_INSTRUCTIONS.md")
    return True

def main():
    """Main deployment process"""
    print("🚀 Starting Render deployment process...\n")
    
    # Check git status
    if not check_git_status():
        return 1
    
    # Push to GitHub
    if not push_to_github():
        return 1
    
    # Create deployment instructions
    create_render_deployment_instructions()
    
    print("\n🎉 Deployment preparation complete!")
    print("\n📋 Next steps:")
    print("1. Follow the instructions in RENDER_DEPLOYMENT_INSTRUCTIONS.md")
    print("2. Create the web service on Render.com")
    print("3. Wait for deployment to complete")
    print("4. Test your API endpoints")
    print("5. Update your frontend configuration")
    
    return 0

if __name__ == "__main__":
    exit(main())
