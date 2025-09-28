import math
import random
from typing import Tuple


def bounded_normal(base: float, std_dev: float, lower: float, upper: float) -> float:
	value = random.gauss(mu=base, sigma=std_dev)
	return max(lower, min(upper, value))


def diurnal_profile(hour: int, min_factor: float = 0.7, max_factor: float = 1.3) -> float:
	"""Return a diurnal factor with peak demand early evening, trough at night."""
	# Peak around 19:00, trough around 03:00
	phase = (hour - 19) % 24
	# Use cosine centered at 0 for peak at 19:00
	# Normalize to [min_factor, max_factor] - increased range for more variation
	cos_val = (math.cos(phase / 24 * 2 * math.pi) + 1) / 2
	return min_factor + (max_factor - min_factor) * cos_val


def weather_variation() -> Tuple[float, float, float]:
	"""Return multiplicative factors for wind, solar, hydro (simplified weather impacts)."""
	# DRAMATIC variation for testing - much more extreme changes
	wind = bounded_normal(1.0, 0.8, 0.1, 3.0)  # Very high wind variation
	solar = bounded_normal(1.0, 1.0, 0.05, 4.0)  # Very high solar variation
	hydro = bounded_normal(1.0, 0.3, 0.3, 2.0)  # High hydro variation
	return wind, solar, hydro


def planned_outage_factor() -> float:
	"""Occasional reduction to simulate outages/maintenance (e.g., nuclear or fossil)."""
	if random.random() < 0.15:  # Much higher chance for testing
		return 0.3  # Very severe outage
	return 1.0


def fossil_price_shock_factor() -> float:
	"""Rare temporary reduction in fossil output due to price spikes or CO2 cost."""
	if random.random() < 0.1:  # Much higher chance for testing
		return 0.4  # Very severe price shock
	return 1.0


def compute_co2_intensity(renewable_share_pct: float, base_range=(50, 500)) -> float:
	"""Map renewable share to CO2 intensity with noise. Higher renewables -> lower intensity."""
	low, high = base_range
	# DRAMATIC inverse relationship for testing
	# When renewables 80%, intensity ~ low; at 10%, ~ high
	norm = max(0.0, min(1.0, (80 - renewable_share_pct) / 70))
	base = low + norm * (high - low)
	# Add LOTS of noise for dramatic variation
	return bounded_normal(base, std_dev=50, lower=low, upper=high)



