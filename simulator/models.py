from dataclasses import dataclass
from typing import Optional
from datetime import datetime


@dataclass
class Co2IntensityRecord:
	id: Optional[int]
	timestamp: datetime
	co2_intensity_g_per_kwh: float


@dataclass
class GenerationMixRecord:
	id: Optional[int]
	timestamp: datetime
	hydro_mw: float
	wind_mw: float
	solar_mw: float
	nuclear_mw: float
	fossil_mw: float
	total_mw: float
	renewable_share_pct: float


@dataclass
class NetZeroAlignmentRecord:
	year: int
	actual_emissions_mt: float
	target_emissions_mt: float
	alignment_pct: float



