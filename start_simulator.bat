@echo off
echo Starting Nexus Sustainability Intelligence Simulator...
echo This will run continuously, updating data every 5 seconds
echo Press Ctrl+C to stop
echo.

python scripts/simulate.py continuous --wall 5 --step 15 --output supabase

pause

