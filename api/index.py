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

from simulator.simulate import simulate_generation_mix, simulate_co2_intensity, _now_tz, SimulatorConfig
from analysis.goal_tracker import compute_goal_tracker

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
