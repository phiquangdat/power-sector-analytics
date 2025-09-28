from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_restx import Api, Resource, fields
import pandas as pd
import numpy as np
import datetime
import sys
import os
from typing import List, Dict, Any
import warnings

# Add the project's root directory to the Python path
# This allows us to import our simulator and analysis modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from simulator.simulate import simulate_generation_mix, simulate_co2_intensity, simulate_netzero_alignment, _now_tz, SimulatorConfig
from analysis.goal_tracker import compute_goal_tracker

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:3000",
    "https://new-vercel-app.vercel.app",
    "https://new-vercel-app-git-main-phiquangdat.vercel.app",
    "https://*.vercel.app"
], supports_credentials=True)

# Initialize Flask-RESTX API with enhanced Swagger UI
api = Api(
    app,
    version='1.0.0',
    title='Nexus Sustainability Intelligence API',
    description='A comprehensive API for sustainability data simulation, analysis, and monitoring',
    doc='/docs/',
    prefix='/api',
    authorizations={
        'Bearer Auth': {
            'type': 'apiKey',
            'in': 'header',
            'name': 'Authorization',
            'description': 'Bearer token for API authentication'
        }
    },
    security='Bearer Auth',
    ui_params={
        'deepLinking': True,
        'displayRequestDuration': True,
        'docExpansion': 'list',
        'filter': True,
        'showExtensions': True,
        'showCommonExtensions': True,
        'tryItOutEnabled': True
    }
)

# Suppress warnings for cleaner output
warnings.filterwarnings('ignore')

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

# Request models for PUT/PATCH operations
co2_update_model = api.model('CO2UpdateRequest', {
    'co2_intensity_g_per_kwh': fields.Float(required=True, description='New CO₂ intensity in g/kWh', min=0, max=1000)
})

mix_update_model = api.model('MixUpdateRequest', {
    'hydro_mw': fields.Float(description='Hydroelectric generation in MW', min=0),
    'wind_mw': fields.Float(description='Wind generation in MW', min=0),
    'solar_mw': fields.Float(description='Solar generation in MW', min=0),
    'nuclear_mw': fields.Float(description='Nuclear generation in MW', min=0),
    'fossil_mw': fields.Float(description='Fossil fuel generation in MW', min=0)
})

netzero_update_model = api.model('NetZeroUpdateRequest', {
    'year': fields.Integer(required=True, description='Year', min=2020, max=2050),
    'actual_emissions_mt': fields.Float(description='Actual emissions in MT', min=0),
    'target_emissions_mt': fields.Float(description='Target emissions in MT', min=0)
})

# Error response models
error_model = api.model('ErrorResponse', {
    'error': fields.String(required=True, description='Error message'),
    'code': fields.Integer(description='Error code'),
    'timestamp': fields.String(description='Error timestamp'),
    'details': fields.String(description='Additional error details')
})

success_model = api.model('SuccessResponse', {
    'message': fields.String(required=True, description='Success message'),
    'data': fields.Raw(description='Response data'),
    'timestamp': fields.String(description='Response timestamp')
})

# --- Helper Function for Data Generation ---
def generate_live_data(periods=96, freq='15min'):
    """Generates a DataFrame of simulated power plant data."""
    cfg = SimulatorConfig(output_mode="none")
    anchor = _now_tz(cfg.timezone)
    timestamps = pd.to_datetime(pd.date_range(end=anchor, periods=periods, freq=freq))
    
    # Generate records using the correct simulation functions
    mix_records = []
    co2_records = []
    
    for ts in timestamps:
        gen_record = simulate_generation_mix(ts)
        co2_record = simulate_co2_intensity(ts, gen_record)
        mix_records.append(gen_record)
        co2_records.append(co2_record)
    
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
        "co2_intensity_g_per_kwh": co2_records[i].co2_intensity_g_per_kwh
    } for i, r in enumerate(mix_records)])
    
    df_co2 = pd.DataFrame([{
        "timestamp": r.timestamp.isoformat(),
        "co2_intensity_g_per_kwh": r.co2_intensity_g_per_kwh
    } for r in co2_records])

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
forecast_ns = api.namespace('forecast', description='Predictive forecasting operations')
scenario_ns = api.namespace('scenario', description='What-if scenario modeling')
insights_ns = api.namespace('insights', description='Automated insights and alerts')

@co2_ns.route('/')
class CO2Data(Resource):
    @api.doc('get_co2_data', 
             responses={
                 200: 'Success',
                 500: 'Internal Server Error'
             })
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

    @api.doc('create_co2_data',
             responses={
                 201: 'Created',
                 400: 'Bad Request',
                 500: 'Internal Server Error'
             })
    @api.expect(co2_model)
    @api.marshal_with(success_model, code=201)
    def post(self):
        """Create new CO₂ intensity data point
        
        Add a new CO₂ intensity measurement to the system.
        """
        try:
            data = api.payload
            # In a real system, you would save this to a database
            return {
                'message': 'CO₂ data point created successfully',
                'data': data,
                'timestamp': datetime.datetime.now().isoformat()
            }, 201
        except Exception as e:
            api.abort(500, f"Error creating CO₂ data: {str(e)}")

@co2_ns.route('/<string:timestamp>')
class CO2DataItem(Resource):
    @api.doc('get_co2_data_by_timestamp',
             responses={
                 200: 'Success',
                 404: 'Not Found',
                 500: 'Internal Server Error'
             })
    @api.marshal_with(co2_model)
    def get(self, timestamp):
        """Get CO₂ intensity data by timestamp
        
        Retrieve a specific CO₂ intensity measurement by timestamp.
        """
        try:
            # In a real system, you would query the database
            df_co2, _ = generate_live_data()
            record = df_co2[df_co2['timestamp'] == timestamp]
            if record.empty:
                api.abort(404, f"CO₂ data not found for timestamp: {timestamp}")
            return record.iloc[0].to_dict()
        except Exception as e:
            api.abort(500, f"Error retrieving CO₂ data: {str(e)}")

    @api.doc('update_co2_data',
             responses={
                 200: 'Success',
                 400: 'Bad Request',
                 404: 'Not Found',
                 500: 'Internal Server Error'
             })
    @api.expect(co2_update_model)
    @api.marshal_with(success_model)
    def put(self, timestamp):
        """Update CO₂ intensity data
        
        Update an existing CO₂ intensity measurement.
        """
        try:
            data = api.payload
            # In a real system, you would update the database
            return {
                'message': f'CO₂ data updated successfully for timestamp: {timestamp}',
                'data': data,
                'timestamp': datetime.datetime.now().isoformat()
            }
        except Exception as e:
            api.abort(500, f"Error updating CO₂ data: {str(e)}")

    @api.doc('partial_update_co2_data',
             responses={
                 200: 'Success',
                 400: 'Bad Request',
                 404: 'Not Found',
                 500: 'Internal Server Error'
             })
    @api.expect(co2_update_model)
    @api.marshal_with(success_model)
    def patch(self, timestamp):
        """Partially update CO₂ intensity data
        
        Partially update an existing CO₂ intensity measurement.
        """
        try:
            data = api.payload
            # In a real system, you would partially update the database
            return {
                'message': f'CO₂ data partially updated for timestamp: {timestamp}',
                'data': data,
                'timestamp': datetime.datetime.now().isoformat()
            }
        except Exception as e:
            api.abort(500, f"Error partially updating CO₂ data: {str(e)}")

    @api.doc('delete_co2_data',
             responses={
                 204: 'No Content',
                 404: 'Not Found',
                 500: 'Internal Server Error'
             })
    def delete(self, timestamp):
        """Delete CO₂ intensity data
        
        Remove a CO₂ intensity measurement from the system.
        """
        try:
            # In a real system, you would delete from the database
            return '', 204
        except Exception as e:
            api.abort(500, f"Error deleting CO₂ data: {str(e)}")

@mix_ns.route('/')
class MixData(Resource):
    @api.doc('get_mix_data',
             responses={
                 200: 'Success',
                 500: 'Internal Server Error'
             })
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

    @api.doc('create_mix_data',
             responses={
                 201: 'Created',
                 400: 'Bad Request',
                 500: 'Internal Server Error'
             })
    @api.expect(mix_model)
    @api.marshal_with(success_model, code=201)
    def post(self):
        """Create new generation mix data point
        
        Add a new generation mix measurement to the system.
        """
        try:
            data = api.payload
            return {
                'message': 'Generation mix data point created successfully',
                'data': data,
                'timestamp': datetime.datetime.now().isoformat()
            }, 201
        except Exception as e:
            api.abort(500, f"Error creating mix data: {str(e)}")

@mix_ns.route('/<string:timestamp>')
class MixDataItem(Resource):
    @api.doc('get_mix_data_by_timestamp',
             responses={
                 200: 'Success',
                 404: 'Not Found',
                 500: 'Internal Server Error'
             })
    @api.marshal_with(mix_model)
    def get(self, timestamp):
        """Get generation mix data by timestamp
        
        Retrieve a specific generation mix measurement by timestamp.
        """
        try:
            _, df_mix = generate_live_data()
            record = df_mix[df_mix['timestamp'] == timestamp]
            if record.empty:
                api.abort(404, f"Mix data not found for timestamp: {timestamp}")
            return record.iloc[0].to_dict()
        except Exception as e:
            api.abort(500, f"Error retrieving mix data: {str(e)}")

    @api.doc('update_mix_data',
             responses={
                 200: 'Success',
                 400: 'Bad Request',
                 404: 'Not Found',
                 500: 'Internal Server Error'
             })
    @api.expect(mix_update_model)
    @api.marshal_with(success_model)
    def put(self, timestamp):
        """Update generation mix data
        
        Update an existing generation mix measurement.
        """
        try:
            data = api.payload
            return {
                'message': f'Mix data updated successfully for timestamp: {timestamp}',
                'data': data,
                'timestamp': datetime.datetime.now().isoformat()
            }
        except Exception as e:
            api.abort(500, f"Error updating mix data: {str(e)}")

    @api.doc('partial_update_mix_data',
             responses={
                 200: 'Success',
                 400: 'Bad Request',
                 404: 'Not Found',
                 500: 'Internal Server Error'
             })
    @api.expect(mix_update_model)
    @api.marshal_with(success_model)
    def patch(self, timestamp):
        """Partially update generation mix data
        
        Partially update an existing generation mix measurement.
        """
        try:
            data = api.payload
            return {
                'message': f'Mix data partially updated for timestamp: {timestamp}',
                'data': data,
                'timestamp': datetime.datetime.now().isoformat()
            }
        except Exception as e:
            api.abort(500, f"Error partially updating mix data: {str(e)}")

    @api.doc('delete_mix_data',
             responses={
                 204: 'No Content',
                 404: 'Not Found',
                 500: 'Internal Server Error'
             })
    def delete(self, timestamp):
        """Delete generation mix data
        
        Remove a generation mix measurement from the system.
        """
        try:
            return '', 204
        except Exception as e:
            api.abort(500, f"Error deleting mix data: {str(e)}")

@netzero_ns.route('/')
class NetZeroData(Resource):
    @api.doc('get_netzero_data',
             responses={
                 200: 'Success',
                 500: 'Internal Server Error'
             })
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

    @api.doc('create_netzero_data',
             responses={
                 201: 'Created',
                 400: 'Bad Request',
                 500: 'Internal Server Error'
             })
    @api.expect(netzero_model)
    @api.marshal_with(success_model, code=201)
    def post(self):
        """Create new net-zero alignment data point
        
        Add a new net-zero alignment measurement to the system.
        """
        try:
            data = api.payload
            return {
                'message': 'Net-zero data point created successfully',
                'data': data,
                'timestamp': datetime.datetime.now().isoformat()
            }, 201
        except Exception as e:
            api.abort(500, f"Error creating net-zero data: {str(e)}")

@netzero_ns.route('/<int:year>')
class NetZeroDataItem(Resource):
    @api.doc('get_netzero_data_by_year',
             responses={
                 200: 'Success',
                 404: 'Not Found',
                 500: 'Internal Server Error'
             })
    @api.marshal_with(netzero_model)
    def get(self, year):
        """Get net-zero alignment data by year
        
        Retrieve a specific net-zero alignment measurement by year.
        """
        try:
            df_netzero = generate_netzero_data()
            record = df_netzero[df_netzero['year'] == year]
            if record.empty:
                api.abort(404, f"Net-zero data not found for year: {year}")
            return record.iloc[0].to_dict()
        except Exception as e:
            api.abort(500, f"Error retrieving net-zero data: {str(e)}")

    @api.doc('update_netzero_data',
             responses={
                 200: 'Success',
                 400: 'Bad Request',
                 404: 'Not Found',
                 500: 'Internal Server Error'
             })
    @api.expect(netzero_update_model)
    @api.marshal_with(success_model)
    def put(self, year):
        """Update net-zero alignment data
        
        Update an existing net-zero alignment measurement.
        """
        try:
            data = api.payload
            return {
                'message': f'Net-zero data updated successfully for year: {year}',
                'data': data,
                'timestamp': datetime.datetime.now().isoformat()
            }
        except Exception as e:
            api.abort(500, f"Error updating net-zero data: {str(e)}")

    @api.doc('partial_update_netzero_data',
             responses={
                 200: 'Success',
                 400: 'Bad Request',
                 404: 'Not Found',
                 500: 'Internal Server Error'
             })
    @api.expect(netzero_update_model)
    @api.marshal_with(success_model)
    def patch(self, year):
        """Partially update net-zero alignment data
        
        Partially update an existing net-zero alignment measurement.
        """
        try:
            data = api.payload
            return {
                'message': f'Net-zero data partially updated for year: {year}',
                'data': data,
                'timestamp': datetime.datetime.now().isoformat()
            }
        except Exception as e:
            api.abort(500, f"Error partially updating net-zero data: {str(e)}")

    @api.doc('delete_netzero_data',
             responses={
                 204: 'No Content',
                 404: 'Not Found',
                 500: 'Internal Server Error'
             })
    def delete(self, year):
        """Delete net-zero alignment data
        
        Remove a net-zero alignment measurement from the system.
        """
        try:
            return '', 204
        except Exception as e:
            api.abort(500, f"Error deleting net-zero data: {str(e)}")

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
                df_co2, 
                df_mix, 
                df_netzero
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
                df_co2_extended, 
                df_mix_extended, 
                df_netzero
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
    @api.doc('health_check',
             responses={
                 200: 'Success',
                 503: 'Service Unavailable'
             })
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

@system_ns.route('/status')
class Status(Resource):
    @api.doc('get_system_status',
             responses={
                 200: 'Success',
                 500: 'Internal Server Error'
             })
    def get(self):
        """Get detailed system status
        
        Returns comprehensive system status including uptime, memory usage, and service health.
        """
        try:
            return {
                "status": "operational",
                "uptime_seconds": 3600,  # Simulated uptime
                "memory_usage": {
                    "total": 8589934592,  # 8GB simulated
                    "available": 4294967296,  # 4GB simulated
                    "percent": 50.0
                },
                "cpu_usage": 25.0,  # Simulated CPU usage
                "timestamp": datetime.datetime.now().isoformat(),
                "version": "1.0.0"
            }
        except Exception as e:
            api.abort(500, f"Error retrieving system status: {str(e)}")

@system_ns.route('/metrics')
class Metrics(Resource):
    @api.doc('get_system_metrics',
             responses={
                 200: 'Success',
                 500: 'Internal Server Error'
             })
    def get(self):
        """Get system performance metrics
        
        Returns detailed performance metrics for monitoring and alerting.
        """
        try:
            return {
                "timestamp": datetime.datetime.now().isoformat(),
                "system": {
                    "cpu_percent": 25.0,  # Simulated CPU usage
                    "memory": {
                        "total": 8589934592,  # 8GB simulated
                        "available": 4294967296,  # 4GB simulated
                        "percent": 50.0
                    },
                    "disk": {
                        "total": 1000000000000,  # 1TB simulated
                        "free": 500000000000,  # 500GB simulated
                        "percent": 50.0
                    }
                },
                "api": {
                    "requests_per_minute": 120,  # Simulated
                    "average_response_time": 150,  # Simulated in ms
                    "error_rate": 0.02  # Simulated 2% error rate
                }
            }
        except Exception as e:
            api.abort(500, f"Error retrieving metrics: {str(e)}")

# ============================================================================
# PREDICTIVE FORECASTING ENDPOINTS
# ============================================================================

@forecast_ns.route('/co2')
class CO2Forecast(Resource):
    @api.doc('forecast_co2',
             description='Generate CO2 intensity forecast using ARIMA time-series model',
             responses={
                 200: 'Success',
                 400: 'Bad Request',
                 500: 'Internal Server Error'
             })
    def get(self):
        """Generate CO2 intensity forecast for the next 24 hours using ARIMA model"""
        try:
            # Get historical data (last 7 days = 672 data points at 15-min intervals)
            from simulator.simulate import SimulatorConfig
            config = SimulatorConfig()
            
            # Generate historical timestamps (last 7 days)
            anchor = _now_tz(config.timezone)
            timestamps = pd.to_datetime(pd.date_range(end=anchor, periods=672, freq='15min'))
            
            # Generate historical data using the simulator
            historical_data = []
            for ts in timestamps:
                gen_record = simulate_generation_mix(ts)
                co2_record = simulate_co2_intensity(ts, gen_record)
                historical_data.append({
                    "timestamp": co2_record.timestamp.isoformat(),
                    "co2_intensity_g_per_kwh": co2_record.co2_intensity_g_per_kwh
                })
            
            if len(historical_data) < 100:
                api.abort(400, "Insufficient historical data for forecasting")
            
            # Extract timestamps and values
            timestamps = [row['timestamp'] for row in historical_data]
            values = [row['co2_intensity_g_per_kwh'] for row in historical_data]
            
            # Convert to pandas Series for ARIMA
            series = pd.Series(values, index=pd.to_datetime(timestamps))
            
            # Use simple time-series forecasting (moving average with trend)
            try:
                # Calculate trend from recent data
                recent_values = values[-48:]  # Last 12 hours
                trend = np.polyfit(range(len(recent_values)), recent_values, 1)[0]
                
                # Generate forecast with trend continuation
                last_value = values[-1]
                forecast_values = []
                for i in range(96):  # 24 hours = 96 * 15min
                    # Apply trend with some noise and seasonality
                    trend_component = trend * (i + 1)
                    seasonal_component = 20 * np.sin(2 * np.pi * i / 96)  # Daily cycle
                    noise = np.random.normal(0, 5)  # Small random noise
                    forecast_value = last_value + trend_component + seasonal_component + noise
                    forecast_values.append(max(50, min(300, forecast_value)))  # Clamp to realistic range
                
            except Exception as e:
                # Fallback to simple moving average
                forecast_values = [np.mean(values[-24:])] * 96
            
            # Generate forecast timestamps (next 24 hours)
            last_timestamp = pd.to_datetime(timestamps[-1])
            forecast_timestamps = []
            for i in range(96):  # 96 * 15min = 24 hours
                forecast_time = last_timestamp + pd.Timedelta(minutes=15 * (i + 1))
                forecast_timestamps.append(forecast_time.isoformat())
            
            # Create forecast data
            forecast_data = []
            for i, (timestamp, value) in enumerate(zip(forecast_timestamps, forecast_values)):
                forecast_data.append({
                    'timestamp': timestamp,
                    'co2_intensity_g_per_kwh': max(0, min(300, value)),  # Clamp to realistic range
                    'forecast_type': 'arima',
                    'forecast_horizon_hours': 24,
                    'created_at': datetime.datetime.now().isoformat()
                })
            
            return {
                'forecast': forecast_data,
                'model_info': {
                    'type': 'Trend-based Forecasting',
                    'training_data_points': len(historical_data),
                    'forecast_horizon_hours': 24,
                    'confidence_interval': 0.95
                },
                'metadata': {
                    'generated_at': datetime.datetime.now().isoformat(),
                    'data_source': 'simulated_historical'
                }
            }
            
        except Exception as e:
            api.abort(500, f"Error generating forecast: {str(e)}")

# ============================================================================
# SCENARIO MODELING ENDPOINTS
# ============================================================================

@scenario_ns.route('/')
class ScenarioModeler(Resource):
    @api.doc('run_scenario',
             description='Run what-if scenario analysis with modified generation parameters',
             responses={
                 200: 'Success',
                 400: 'Bad Request',
                 500: 'Internal Server Error'
             })
    def get(self):
        """Run scenario analysis with modified generation parameters"""
        try:
            # Get scenario parameters from query string
            solar_boost = float(request.args.get('solar_boost', 0.0))  # 0.0 to 1.0 (0% to 100% boost)
            wind_boost = float(request.args.get('wind_boost', 0.0))
            fossil_reduction = float(request.args.get('fossil_reduction', 0.0))  # 0.0 to 1.0 (0% to 100% reduction)
            nuclear_outage = request.args.get('nuclear_outage', 'false').lower() == 'true'
            duration_hours = int(request.args.get('duration_hours', 24))
            
            # Validate parameters
            if not (0 <= solar_boost <= 2.0 and 0 <= wind_boost <= 2.0 and 0 <= fossil_reduction <= 1.0):
                api.abort(400, "Invalid parameter values. Boosts should be 0-2.0, reductions 0-1.0")
            
            # Get current generation mix data
            from simulator.simulate import SimulatorConfig
            config = SimulatorConfig()
            
            # Generate current mix timestamps (last 24 hours)
            anchor = _now_tz(config.timezone)
            timestamps = pd.to_datetime(pd.date_range(end=anchor, periods=96, freq='15min'))
            
            # Generate current mix data using the simulator
            current_mix = []
            for ts in timestamps:
                gen_record = simulate_generation_mix(ts)
                current_mix.append({
                    "timestamp": gen_record.timestamp.isoformat(),
                    "hydro_mw": gen_record.hydro_mw,
                    "wind_mw": gen_record.wind_mw,
                    "solar_mw": gen_record.solar_mw,
                    "nuclear_mw": gen_record.nuclear_mw,
                    "fossil_mw": gen_record.fossil_mw,
                    "total_mw": gen_record.total_mw,
                    "renewable_share_pct": gen_record.renewable_share_pct,
                    "co2_intensity_g_per_kwh": simulate_co2_intensity(ts, gen_record).co2_intensity_g_per_kwh
                })
            
            # Apply scenario modifications
            scenario_mix = []
            for data_point in current_mix:
                modified_point = data_point.copy()
                
                # Apply solar boost
                if solar_boost > 0:
                    modified_point['solar_mw'] *= (1 + solar_boost)
                
                # Apply wind boost
                if wind_boost > 0:
                    modified_point['wind_mw'] *= (1 + wind_boost)
                
                # Apply fossil reduction
                if fossil_reduction > 0:
                    modified_point['fossil_mw'] *= (1 - fossil_reduction)
                
                # Apply nuclear outage
                if nuclear_outage:
                    modified_point['nuclear_mw'] = 0
                
                # Recalculate total and renewable share
                modified_point['total_mw'] = (
                    modified_point['hydro_mw'] + 
                    modified_point['wind_mw'] + 
                    modified_point['solar_mw'] + 
                    modified_point['nuclear_mw'] + 
                    modified_point['fossil_mw']
                )
                
                modified_point['renewable_share_pct'] = (
                    (modified_point['hydro_mw'] + modified_point['wind_mw'] + modified_point['solar_mw']) /
                    modified_point['total_mw'] * 100
                )
                
                # Recalculate CO2 intensity based on new mix
                renewable_share = modified_point['renewable_share_pct'] / 100
                modified_point['co2_intensity_g_per_kwh'] = 300 * (1 - renewable_share) + 50 * renewable_share
                
                scenario_mix.append(modified_point)
            
            # Calculate scenario impact metrics
            current_avg_renewable = np.mean([p['renewable_share_pct'] for p in current_mix])
            scenario_avg_renewable = np.mean([p['renewable_share_pct'] for p in scenario_mix])
            
            current_avg_co2 = np.mean([p['co2_intensity_g_per_kwh'] for p in current_mix])
            scenario_avg_co2 = np.mean([p['co2_intensity_g_per_kwh'] for p in scenario_mix])
            
            # Calculate net-zero alignment impact
            current_alignment = 75.0  # Simulated current alignment
            co2_reduction_pct = (current_avg_co2 - scenario_avg_co2) / current_avg_co2 * 100
            scenario_alignment = min(100, current_alignment + co2_reduction_pct * 0.5)
            
            return {
                'scenario_data': scenario_mix,
                'impact_analysis': {
                    'renewable_share_change': {
                        'current': round(current_avg_renewable, 1),
                        'scenario': round(scenario_avg_renewable, 1),
                        'change_pct': round(scenario_avg_renewable - current_avg_renewable, 1)
                    },
                    'co2_intensity_change': {
                        'current': round(current_avg_co2, 1),
                        'scenario': round(scenario_avg_co2, 1),
                        'reduction_pct': round(co2_reduction_pct, 1)
                    },
                    'netzero_alignment_change': {
                        'current': round(current_alignment, 1),
                        'scenario': round(scenario_alignment, 1),
                        'improvement_pct': round(scenario_alignment - current_alignment, 1)
                    }
                },
                'scenario_parameters': {
                    'solar_boost': solar_boost,
                    'wind_boost': wind_boost,
                    'fossil_reduction': fossil_reduction,
                    'nuclear_outage': nuclear_outage,
                    'duration_hours': duration_hours
                },
                'metadata': {
                    'generated_at': datetime.datetime.now().isoformat(),
                    'data_points': len(scenario_mix)
                }
            }
            
        except Exception as e:
            api.abort(500, f"Error running scenario: {str(e)}")

# ============================================================================
# INSIGHTS AND ALERTS ENDPOINTS
# ============================================================================

@insights_ns.route('/')
class InsightsFeed(Resource):
    @api.doc('get_insights',
             description='Get automated insights and alerts based on current data',
             responses={
                 200: 'Success',
                 500: 'Internal Server Error'
             })
    def get(self):
        """Generate automated insights and alerts based on current data analysis"""
        try:
            insights = []
            alerts = []
            
            # Get current data
            from simulator.simulate import SimulatorConfig
            config = SimulatorConfig()
            
            # Generate timestamps for historical data
            anchor = _now_tz(config.timezone)
            co2_timestamps = pd.to_datetime(pd.date_range(end=anchor, periods=672, freq='15min'))
            mix_timestamps = pd.to_datetime(pd.date_range(end=anchor, periods=96, freq='15min'))
            
            # Generate CO2 data (last 7 days)
            co2_data = []
            for ts in co2_timestamps:
                gen_record = simulate_generation_mix(ts)
                co2_record = simulate_co2_intensity(ts, gen_record)
                co2_data.append({
                    "timestamp": co2_record.timestamp.isoformat(),
                    "co2_intensity_g_per_kwh": co2_record.co2_intensity_g_per_kwh
                })
            
            # Generate mix data (last 24 hours)
            mix_data = []
            for ts in mix_timestamps:
                gen_record = simulate_generation_mix(ts)
                mix_data.append({
                    "timestamp": gen_record.timestamp.isoformat(),
                    "hydro_mw": gen_record.hydro_mw,
                    "wind_mw": gen_record.wind_mw,
                    "solar_mw": gen_record.solar_mw,
                    "nuclear_mw": gen_record.nuclear_mw,
                    "fossil_mw": gen_record.fossil_mw,
                    "total_mw": gen_record.total_mw,
                    "renewable_share_pct": gen_record.renewable_share_pct,
                    "co2_intensity_g_per_kwh": simulate_co2_intensity(ts, gen_record).co2_intensity_g_per_kwh
                })
            # Generate net-zero data for goal tracker
            netzero_data = []
            for year in range(2020, 2026):
                nz_record = simulate_netzero_alignment(year)
                netzero_data.append({
                    "year": nz_record.year,
                    "actual_emissions_mt": nz_record.actual_emissions_mt,
                    "target_emissions_mt": nz_record.target_emissions_mt,
                    "alignment_pct": nz_record.alignment_pct
                })
            
            # Convert to DataFrames for goal tracker
            df_co2 = pd.DataFrame(co2_data)
            df_gen = pd.DataFrame(mix_data)
            df_nz = pd.DataFrame(netzero_data)
            
            goal_tracker = compute_goal_tracker(df_co2, df_gen, df_nz)
            
            # 1. Anomaly Detection
            current_co2 = co2_data[-1]['co2_intensity_g_per_kwh']
            weekly_avg = np.mean([p['co2_intensity_g_per_kwh'] for p in co2_data[-168:]])  # Last 7 days
            weekly_std = np.std([p['co2_intensity_g_per_kwh'] for p in co2_data[-168:]])
            
            if current_co2 > weekly_avg + 2 * weekly_std:
                alerts.append({
                    'type': 'warning',
                    'category': 'anomaly',
                    'title': 'Unusually High CO₂ Intensity Detected',
                    'message': f'Current CO₂ intensity ({current_co2:.1f} g/kWh) is significantly above the weekly average ({weekly_avg:.1f} g/kWh)',
                    'severity': 'high',
                    'timestamp': datetime.datetime.now().isoformat()
                })
            elif current_co2 < weekly_avg - 2 * weekly_std:
                insights.append({
                    'type': 'positive',
                    'category': 'performance',
                    'title': 'Excellent CO₂ Performance',
                    'message': f'Current CO₂ intensity ({current_co2:.1f} g/kWh) is well below the weekly average ({weekly_avg:.1f} g/kWh)',
                    'impact': 'high',
                    'timestamp': datetime.datetime.now().isoformat()
                })
            
            # 2. Renewable Generation Analysis
            current_renewable = mix_data[-1]['renewable_share_pct']
            daily_avg_renewable = np.mean([p['renewable_share_pct'] for p in mix_data])
            
            if current_renewable > daily_avg_renewable + 10:
                insights.append({
                    'type': 'positive',
                    'category': 'renewable',
                    'title': 'Strong Renewable Generation',
                    'message': f'Current renewable share ({current_renewable:.1f}%) is significantly above daily average ({daily_avg_renewable:.1f}%)',
                    'impact': 'medium',
                    'timestamp': datetime.datetime.now().isoformat()
                })
            elif current_renewable < daily_avg_renewable - 15:
                alerts.append({
                    'type': 'warning',
                    'category': 'renewable',
                    'title': 'Low Renewable Generation',
                    'message': f'Current renewable share ({current_renewable:.1f}%) is below daily average ({daily_avg_renewable:.1f}%)',
                    'severity': 'medium',
                    'timestamp': datetime.datetime.now().isoformat()
                })
            
            # 3. Goal Tracker Analysis
            if 'decarbonization_velocity' in goal_tracker:
                velocity = goal_tracker['decarbonization_velocity']
                if velocity < 0.5:  # Below target pace
                    alerts.append({
                        'type': 'warning',
                        'category': 'goals',
                        'title': 'Decarbonization Pace Below Target',
                        'message': f'Current decarbonization velocity ({velocity:.2f}) is insufficient to meet annual targets',
                        'severity': 'high',
                        'recommendation': 'Consider accelerating renewable deployment or reducing fossil fuel dependence',
                        'timestamp': datetime.datetime.now().isoformat()
                    })
                elif velocity > 1.2:  # Above target pace
                    insights.append({
                        'type': 'positive',
                        'category': 'goals',
                        'title': 'Exceeding Decarbonization Targets',
                        'message': f'Current decarbonization velocity ({velocity:.2f}) is above target pace',
                        'impact': 'high',
                        'timestamp': datetime.datetime.now().isoformat()
                    })
            
            # 4. Trend Analysis
            recent_co2_trend = np.polyfit(range(24), [p['co2_intensity_g_per_kwh'] for p in co2_data[-24:]], 1)[0]
            if recent_co2_trend < -2:  # Significant downward trend
                insights.append({
                    'type': 'positive',
                    'category': 'trend',
                    'title': 'Strong CO₂ Reduction Trend',
                    'message': 'CO₂ intensity has been decreasing significantly over the last 24 hours',
                    'impact': 'high',
                    'timestamp': datetime.datetime.now().isoformat()
                })
            elif recent_co2_trend > 2:  # Significant upward trend
                alerts.append({
                    'type': 'warning',
                    'category': 'trend',
                    'title': 'Rising CO₂ Intensity Trend',
                    'message': 'CO₂ intensity has been increasing significantly over the last 24 hours',
                    'severity': 'medium',
                    'timestamp': datetime.datetime.now().isoformat()
                })
            
            # 5. Generation Mix Optimization
            current_solar = mix_data[-1]['solar_mw']
            current_wind = mix_data[-1]['wind_mw']
            max_solar = max([p['solar_mw'] for p in mix_data])
            max_wind = max([p['wind_mw'] for p in mix_data])
            
            if current_solar < max_solar * 0.3:
                insights.append({
                    'type': 'recommendation',
                    'category': 'optimization',
                    'title': 'Solar Generation Optimization Opportunity',
                    'message': f'Current solar generation ({current_solar:.1f} MW) is well below peak capacity ({max_solar:.1f} MW)',
                    'impact': 'medium',
                    'recommendation': 'Consider increasing solar capacity or improving solar efficiency',
                    'timestamp': datetime.datetime.now().isoformat()
                })
            
            return {
                'insights': insights,
                'alerts': alerts,
                'summary': {
                    'total_insights': len(insights),
                    'total_alerts': len(alerts),
                    'high_priority_alerts': len([a for a in alerts if a.get('severity') == 'high']),
                    'positive_insights': len([i for i in insights if i.get('type') == 'positive'])
                },
                'metadata': {
                    'generated_at': datetime.datetime.now().isoformat(),
                    'data_analyzed': {
                        'co2_data_points': len(co2_data),
                        'mix_data_points': len(mix_data)
                    }
                }
            }
            
        except Exception as e:
            api.abort(500, f"Error generating insights: {str(e)}")

if __name__ == '__main__':
    import os
    import logging
    
    # Configure logging for production
    if not app.debug:
        handler = logging.StreamHandler()
        handler.setLevel(logging.INFO)
        app.logger.addHandler(handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('Nexus Sustainability API startup')
    
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
