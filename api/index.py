from flask import Flask, jsonify
from flask_cors import CORS
from flask_restx import Api, Resource, fields
import pandas as pd
import numpy as np
import datetime
import sys
import os
from typing import List, Dict, Any

# Add the project's root directory to the Python path
# This allows us to import our simulator and analysis modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from simulator.simulate import run_once, _now_tz, SimulatorConfig
from analysis.goal_tracker import compute_goal_tracker

app = Flask(__name__)
CORS(app)

# Initialize Flask-RESTX API
api = Api(
    app,
    version='1.0.0',
    title='Nexus Sustainability Intelligence API',
    description='A comprehensive API for sustainability data simulation, analysis, and monitoring',
    doc='/docs/',
    prefix='/api'
)

# Define data models for API documentation
co2_model = api.model('CO2Data', {
    'timestamp': fields.String(required=True, description='ISO timestamp'),
    'co2_intensity_g_per_kwh': fields.Float(required=True, description='CO₂ intensity in g/kWh')
})

mix_model = api.model('MixData', {
    'timestamp': fields.String(required=True, description='ISO timestamp'),
    'hydro_mw': fields.Float(required=True, description='Hydroelectric generation in MW'),
    'wind_mw': fields.Float(required=True, description='Wind generation in MW'),
    'solar_mw': fields.Float(required=True, description='Solar generation in MW'),
    'nuclear_mw': fields.Float(required=True, description='Nuclear generation in MW'),
    'fossil_mw': fields.Float(required=True, description='Fossil fuel generation in MW'),
    'total_mw': fields.Float(required=True, description='Total generation in MW'),
    'renewable_share_pct': fields.Float(required=True, description='Renewable share percentage'),
    'co2_intensity_g_per_kwh': fields.Float(required=True, description='CO₂ intensity in g/kWh')
})

netzero_model = api.model('NetZeroData', {
    'year': fields.Integer(required=True, description='Year'),
    'actual_emissions_mt': fields.Float(required=True, description='Actual emissions in MT'),
    'target_emissions_mt': fields.Float(required=True, description='Target emissions in MT'),
    'alignment_pct': fields.Float(required=True, description='Alignment percentage')
})

anomaly_model = api.model('AnomalyData', {
    'timestamp': fields.String(required=True, description='ISO timestamp'),
    'co2_intensity_g_per_kwh': fields.Float(required=True, description='CO₂ intensity at anomaly'),
    'isAnomaly': fields.Boolean(required=True, description='Whether this is an anomaly'),
    'deviation': fields.Float(required=True, description='Statistical deviation'),
    'severity': fields.String(required=True, description='Severity level: low, medium, high')
})

correlation_model = api.model('CorrelationData', {
    'correlation': fields.Float(required=True, description='Correlation coefficient'),
    'strength': fields.String(required=True, description='Correlation strength: weak, moderate, strong'),
    'direction': fields.String(required=True, description='Correlation direction: positive, negative'),
    'sampleSize': fields.Integer(required=True, description='Number of data points used')
})

goal_tracker_model = api.model('GoalTrackerData', {
    'rai_pct': fields.Float(description='Real-time Alignment Index percentage'),
    'budget': fields.Nested(api.model('BudgetData', {
        'ytd_tons': fields.Integer(description='Year-to-date emissions in tons'),
        'ytd_budget_tons': fields.Integer(description='Year-to-date budget in tons'),
        'days_ahead': fields.Integer(description='Days ahead/behind budget')
    })),
    'velocity': fields.Nested(api.model('VelocityData', {
        'on_track': fields.Boolean(description='Whether on track for target'),
        'v_actual_g_per_kwh_per_yr': fields.Float(description='Actual velocity'),
        'v_required_g_per_kwh_per_yr': fields.Float(description='Required velocity')
    })),
    'pathway': fields.Nested(api.model('PathwayData', {
        'eta_year': fields.Integer(description='Estimated time of arrival year'),
        'series': fields.List(fields.Nested(api.model('PathwaySeries', {
            'year': fields.Integer(description='Year'),
            'target_emissions_mt': fields.Float(description='Target emissions')
        })))
    })),
    'anomalies': fields.Nested(api.model('AnomaliesData', {
        'count': fields.Integer(description='Total anomaly count'),
        'recent': fields.List(fields.Nested(anomaly_model)),
        'severity': fields.Nested(api.model('SeverityData', {
            'low': fields.Integer(description='Low severity count'),
            'medium': fields.Integer(description='Medium severity count'),
            'high': fields.Integer(description='High severity count')
        }))
    })),
    'correlation': fields.Nested(correlation_model),
    'error': fields.String(description='Error message if any')
})

dashboard_model = api.model('DashboardData', {
    'co2': fields.List(fields.Nested(co2_model)),
    'mix': fields.List(fields.Nested(mix_model)),
    'netzero': fields.List(fields.Nested(netzero_model)),
    'goal_tracker': fields.Nested(goal_tracker_model),
    'timestamp': fields.String(description='Data generation timestamp')
})

# --- Helper Function for Data Generation ---
def generate_live_data(periods=96, freq='15min'):
    """Generates a DataFrame of simulated power plant data."""
    cfg = SimulatorConfig(output_mode="none")
    anchor = _now_tz(cfg.timezone)
    timestamps = pd.to_datetime(pd.date_range(end=anchor, periods=periods, freq=freq))
    
    records = [run_once(cfg, ts) for ts in timestamps]
    
    # Convert records to DataFrames for easier manipulation
    df_mix = pd.DataFrame([{
        "timestamp": r.timestamp.isoformat(),
        "hydro_mw": r.hydro_mw,
        "wind_mw": r.wind_mw,
        "solar_mw": r.solar_mw,
        "nuclear_mw": r.nuclear_mw,
        "fossil_mw": r.fossil_mw,
        "total_mw": r.total_mw,
        "renewable_share_pct": r.renewable_share_pct,
        "co2_intensity_g_per_kwh": r.co2_intensity_g_per_kwh
    } for r in records])
    
    df_co2 = pd.DataFrame([{
        "timestamp": r.timestamp.isoformat(),
        "co2_intensity_g_per_kwh": r.co2_intensity_g_per_kwh
    } for r in records])

    return df_co2, df_mix

def generate_netzero_data():
    """Generate simulated net-zero alignment data."""
    netzero_data = []
    start_year = datetime.datetime.now().year
    
    for i in range(10):
        year = start_year + i
        # Simulate declining emissions with some variation
        base_emissions = 100 - i * 8  # 8% reduction per year
        actual_emissions = base_emissions + np.random.uniform(-3, 3)
        target_emissions = base_emissions
        
        netzero_data.append({
            "year": year,
            "actual_emissions_mt": max(0, actual_emissions),
            "target_emissions_mt": max(0, target_emissions),
            "alignment_pct": min(100, (target_emissions / max(actual_emissions, 0.1)) * 100)
        })
    
    return pd.DataFrame(netzero_data)

# --- API Endpoints ---

@app.route('/')
def home():
    return jsonify({
        "message": "Nexus Sustainability Intelligence API is running.",
        "version": "1.0.0",
        "documentation": "/docs/",
        "endpoints": {
            "co2": "/api/co2",
            "mix": "/api/mix", 
            "netzero": "/api/netzero",
            "goal_tracker": "/api/goal_tracker",
            "dashboard": "/api/dashboard",
            "health": "/api/health"
        }
    })

# Create namespaces for better organization
co2_ns = api.namespace('co2', description='CO₂ intensity data operations')
mix_ns = api.namespace('mix', description='Generation mix data operations')
netzero_ns = api.namespace('netzero', description='Net-zero alignment data operations')
analytics_ns = api.namespace('analytics', description='Advanced analytics operations')
system_ns = api.namespace('system', description='System health and status operations')

@co2_ns.route('/')
class CO2Data(Resource):
    @api.doc('get_co2_data')
    @api.marshal_list_with(co2_model)
    def get(self):
        """Get CO₂ intensity data
        
        Returns real-time CO₂ intensity measurements in g/kWh.
        Data is generated using advanced simulation algorithms.
        """
        try:
            df_co2, _ = generate_live_data()
            return df_co2.to_dict(orient='records')
        except Exception as e:
            api.abort(500, f"Error generating CO₂ data: {str(e)}")

@mix_ns.route('/')
class MixData(Resource):
    @api.doc('get_mix_data')
    @api.marshal_list_with(mix_model)
    def get(self):
        """Get generation mix data
        
        Returns real-time electricity generation breakdown by source.
        Includes renewable (hydro, wind, solar) and non-renewable (nuclear, fossil) sources.
        """
        try:
            _, df_mix = generate_live_data()
            return df_mix.to_dict(orient='records')
        except Exception as e:
            api.abort(500, f"Error generating mix data: {str(e)}")

@netzero_ns.route('/')
class NetZeroData(Resource):
    @api.doc('get_netzero_data')
    @api.marshal_list_with(netzero_model)
    def get(self):
        """Get net-zero alignment data
        
        Returns annual emissions targets and actual performance.
        Shows progress towards net-zero goals with alignment percentages.
        """
        try:
            df_netzero = generate_netzero_data()
            return df_netzero.to_dict(orient='records')
        except Exception as e:
            api.abort(500, f"Error generating net-zero data: {str(e)}")

@analytics_ns.route('/goal_tracker')
class GoalTracker(Resource):
    @api.doc('get_goal_tracker')
    @api.marshal_with(goal_tracker_model)
    def get(self):
        """Get comprehensive goal tracking analysis
        
        Returns advanced analytics including:
        - Real-time Alignment Index (RAI)
        - Carbon budget tracking
        - Decarbonization velocity
        - 2050 pathway projections
        - Anomaly detection results
        - Correlation analysis
        """
        try:
            # Generate more data for comprehensive analysis
            df_co2, df_mix = generate_live_data(periods=720)  # 7.5 days of data
            df_netzero = generate_netzero_data()
            
            # Use your existing goal tracker logic
            goal_data = compute_goal_tracker(
                df_co2.to_dict(orient='records'), 
                df_mix.to_dict(orient='records'), 
                df_netzero.to_dict(orient='records')
            )
            return goal_data
        except Exception as e:
            api.abort(500, f"Error generating goal tracker data: {str(e)}")

@analytics_ns.route('/dashboard')
class Dashboard(Resource):
    @api.doc('get_dashboard_data')
    @api.marshal_with(dashboard_model)
    def get(self):
        """Get complete dashboard data
        
        Returns all data needed for the sustainability dashboard:
        - CO₂ intensity data
        - Generation mix data
        - Net-zero alignment data
        - Comprehensive analytics
        """
        try:
            df_co2, df_mix = generate_live_data()
            df_netzero = generate_netzero_data()
            
            # Get goal tracker data with more historical data
            df_co2_extended, df_mix_extended = generate_live_data(periods=720)
            goal_data = compute_goal_tracker(
                df_co2_extended.to_dict(orient='records'), 
                df_mix_extended.to_dict(orient='records'), 
                df_netzero.to_dict(orient='records')
            )
            
            return {
                "co2": df_co2.to_dict(orient='records'),
                "mix": df_mix.to_dict(orient='records'),
                "netzero": df_netzero.to_dict(orient='records'),
                "goal_tracker": goal_data,
                "timestamp": datetime.datetime.now().isoformat()
            }
        except Exception as e:
            api.abort(500, f"Error generating dashboard data: {str(e)}")

@system_ns.route('/health')
class Health(Resource):
    @api.doc('health_check')
    def get(self):
        """Health check endpoint
        
        Returns API status and version information.
        Use this endpoint to verify the API is running correctly.
        """
        return {
            "status": "healthy",
            "timestamp": datetime.datetime.now().isoformat(),
            "version": "1.0.0",
            "services": {
                "simulator": "operational",
                "analytics": "operational",
                "data_generation": "operational"
            }
        }

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
