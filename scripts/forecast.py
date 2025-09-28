#!/usr/bin/env python3
"""
CO₂ Intensity Forecasting Script
Generates 24-hour forecasts using historical data and saves to Supabase
"""

import os
import sys
import json
import requests
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any
import numpy as np
from dotenv import load_dotenv

# Add the project root to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

class CO2Forecaster:
    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_KEY')
        
        if not self.supabase_url or not self.supabase_key:
            raise ValueError("Missing Supabase credentials")
    
    def fetch_historical_data(self, hours: int = 168) -> List[Dict[str, Any]]:
        """Fetch historical CO₂ data from Supabase"""
        # Calculate start time (hours ago)
        start_time = datetime.now(timezone.utc) - timedelta(hours=hours)
        
        url = f"{self.supabase_url}/rest/v1/co2_intensity"
        headers = {
            "apikey": self.supabase_key,
            "Authorization": f"Bearer {self.supabase_key}",
            "Content-Type": "application/json"
        }
        
        params = {
            "timestamp": f"gte.{start_time.isoformat()}",
            "order": "timestamp.asc"
        }
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        return response.json()
    
    def simple_linear_forecast(self, data: List[Dict[str, Any]], forecast_hours: int = 24) -> List[Dict[str, Any]]:
        """Simple linear regression forecast"""
        if len(data) < 2:
            return []
        
        # Extract timestamps and values
        timestamps = [datetime.fromisoformat(d['timestamp'].replace('Z', '+00:00')) for d in data]
        values = [d['co2_intensity_g_per_kwh'] for d in data]
        
        # Convert timestamps to numeric (hours since first timestamp)
        start_time = timestamps[0]
        x = [(t - start_time).total_seconds() / 3600 for t in timestamps]
        
        # Fit linear regression
        x_array = np.array(x)
        y_array = np.array(values)
        
        # Calculate slope and intercept
        n = len(x_array)
        sum_x = np.sum(x_array)
        sum_y = np.sum(y_array)
        sum_xy = np.sum(x_array * y_array)
        sum_x2 = np.sum(x_array * x_array)
        
        slope = (n * sum_xy - sum_x * sum_y) / (n * sum_x2 - sum_x * sum_x)
        intercept = (sum_y - slope * sum_x) / n
        
        # Generate forecast
        forecasts = []
        last_timestamp = timestamps[-1]
        
        for i in range(1, forecast_hours + 1):
            # Calculate forecast time (every 15 minutes)
            forecast_time = last_timestamp + timedelta(minutes=15 * i)
            forecast_x = (forecast_time - start_time).total_seconds() / 3600
            forecast_value = slope * forecast_x + intercept
            
            # Add some realistic noise/variation
            noise = np.random.normal(0, np.std(y_array) * 0.1)
            forecast_value = max(0, forecast_value + noise)  # Ensure non-negative
            
            forecasts.append({
                "timestamp": forecast_time.isoformat(),
                "co2_intensity_g_per_kwh": round(forecast_value, 2),
                "forecast_type": "linear_regression"
            })
        
        return forecasts
    
    def seasonal_forecast(self, data: List[Dict[str, Any]], forecast_hours: int = 24) -> List[Dict[str, Any]]:
        """Seasonal forecast based on daily patterns"""
        if len(data) < 24:  # Need at least 24 hours of data
            return self.simple_linear_forecast(data, forecast_hours)
        
        # Extract timestamps and values
        timestamps = [datetime.fromisoformat(d['timestamp'].replace('Z', '+00:00')) for d in data]
        values = [d['co2_intensity_g_per_kwh'] for d in data]
        
        # Calculate daily patterns (average by hour of day)
        hourly_averages = {}
        for i, ts in enumerate(timestamps):
            hour = ts.hour
            if hour not in hourly_averages:
                hourly_averages[hour] = []
            hourly_averages[hour].append(values[i])
        
        # Calculate mean for each hour
        hourly_means = {hour: np.mean(vals) for hour, vals in hourly_averages.items()}
        
        # Generate forecast using daily pattern
        forecasts = []
        last_timestamp = timestamps[-1]
        
        for i in range(1, forecast_hours + 1):
            forecast_time = last_timestamp + timedelta(minutes=15 * i)
            hour = forecast_time.hour
            
            # Use hourly average if available, otherwise use overall average
            base_value = hourly_means.get(hour, np.mean(values))
            
            # Add trend component (simple moving average)
            recent_values = values[-24:] if len(values) >= 24 else values
            trend = np.mean(recent_values[-6:]) - np.mean(recent_values[:6]) if len(recent_values) >= 6 else 0
            
            # Add some noise
            noise = np.random.normal(0, np.std(values) * 0.05)
            forecast_value = max(0, base_value + trend + noise)
            
            forecasts.append({
                "timestamp": forecast_time.isoformat(),
                "co2_intensity_g_per_kwh": round(forecast_value, 2),
                "forecast_type": "seasonal"
            })
        
        return forecasts
    
    def save_forecasts(self, forecasts: List[Dict[str, Any]]):
        """Save forecasts to Supabase"""
        if not forecasts:
            return
        
        url = f"{self.supabase_url}/rest/v1/co2_forecasts"
        headers = {
            "apikey": self.supabase_key,
            "Authorization": f"Bearer {self.supabase_key}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=minimal"
        }
        
        # Add metadata
        for forecast in forecasts:
            forecast["created_at"] = datetime.now(timezone.utc).isoformat()
            forecast["forecast_horizon_hours"] = 24
        
        response = requests.post(url, headers=headers, json=forecasts)
        response.raise_for_status()
        
        print(f"Saved {len(forecasts)} forecasts to Supabase")
    
    def run_forecast(self):
        """Main forecasting workflow"""
        try:
            print("Fetching historical data...")
            historical_data = self.fetch_historical_data(hours=168)  # 1 week
            
            if len(historical_data) < 24:
                print("Insufficient historical data for forecasting")
                return
            
            print(f"Loaded {len(historical_data)} historical data points")
            
            # Generate forecasts using different methods
            print("Generating linear regression forecast...")
            linear_forecasts = self.simple_linear_forecast(historical_data)
            
            print("Generating seasonal forecast...")
            seasonal_forecasts = self.seasonal_forecast(historical_data)
            
            # Combine forecasts (use seasonal as primary, linear as fallback)
            combined_forecasts = []
            for i in range(len(seasonal_forecasts)):
                if i < len(linear_forecasts):
                    # Blend the forecasts
                    seasonal_val = seasonal_forecasts[i]["co2_intensity_g_per_kwh"]
                    linear_val = linear_forecasts[i]["co2_intensity_g_per_kwh"]
                    blended_val = (seasonal_val * 0.7) + (linear_val * 0.3)
                    
                    combined_forecasts.append({
                        "timestamp": seasonal_forecasts[i]["timestamp"],
                        "co2_intensity_g_per_kwh": round(blended_val, 2),
                        "forecast_type": "blended"
                    })
                else:
                    combined_forecasts.append(seasonal_forecasts[i])
            
            print(f"Generated {len(combined_forecasts)} forecasts")
            
            # Save to Supabase
            self.save_forecasts(combined_forecasts)
            
            print("Forecasting completed successfully!")
            
        except Exception as e:
            print(f"Forecasting failed: {e}")
            raise

def main():
    """Main entry point"""
    try:
        forecaster = CO2Forecaster()
        forecaster.run_forecast()
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
