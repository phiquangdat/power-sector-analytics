import math
import random
from typing import Tuple


def bounded_normal(base: float, std_dev: float, lower: float, upper: float) -> float:
	value = random.gauss(mu=base, sigma=std_dev)
	return max(lower, min(upper, value))


def diurnal_profile(hour: int, min_factor: float = 0.8, max_factor: float = 1.2) -> float:
	"""Return a diurnal factor with peak demand early evening, trough at night."""
	# Peak around 19:00, trough around 03:00
	phase = (hour - 19) % 24
	# Use cosine centered at 0 for peak at 19:00
	# Normalize to [min_factor, max_factor]
	cos_val = (math.cos(phase / 24 * 2 * math.pi) + 1) / 2
	return min_factor + (max_factor - min_factor) * cos_val


def weather_variation() -> Tuple[float, float, float]:
	"""Return multiplicative factors for wind, solar, hydro (simplified weather impacts)."""
	wind = bounded_normal(1.0, 0.2, 0.5, 1.5)
	solar = bounded_normal(1.0, 0.25, 0.2, 1.6)
	hydro = bounded_normal(1.0, 0.05, 0.8, 1.2)
	return wind, solar, hydro


def planned_outage_factor() -> float:
	"""Occasional reduction to simulate outages/maintenance (e.g., nuclear or fossil)."""
	if random.random() < 0.02:
		return 0.7
	return 1.0


def fossil_price_shock_factor() -> float:
	"""Rare temporary reduction in fossil output due to price spikes or CO2 cost."""
	if random.random() < 0.01:
		return 0.8
	return 1.0


def compute_co2_intensity(renewable_share_pct: float, base_range=(100, 300)) -> float:
	"""Map renewable share to CO2 intensity with noise. Higher renewables -> lower intensity."""
	low, high = base_range
	# Inverse relationship: when renewables 60%, intensity ~ low; at 30%, ~ high
	norm = max(0.0, min(1.0, (60 - renewable_share_pct) / 30))
	base = low + norm * (high - low)
	return bounded_normal(base, std_dev=10, lower=low, upper=high)

