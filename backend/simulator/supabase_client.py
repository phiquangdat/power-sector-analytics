from typing import Iterable, Dict, Any, Optional
import requests
from datetime import datetime


class SupabaseClient:
	def __init__(self, url: Optional[str], key: Optional[str]):
		self.url = url
		self.key = key

	def enabled(self) -> bool:
		return bool(self.url and self.key)

	def insert_rows(self, table: str, rows: Iterable[Dict[str, Any]], on_conflict: Optional[str] = None, resolution: Optional[str] = None) -> None:
		if not self.enabled():
			return
		rows = list(rows)
		if not rows:
			return
		# Serialize datetimes to ISO strings for JSON
		payload = []
		for r in rows:
			obj: Dict[str, Any] = {}
			for k, v in r.items():
				# Drop fields with None (e.g., id) so DB defaults apply
				if v is None:
					continue
				if isinstance(v, datetime):
					obj[k] = v.isoformat()
				else:
					obj[k] = v
			payload.append(obj)
		endpoint = f"{self.url}/rest/v1/{table}"
		if on_conflict:
			endpoint = f"{endpoint}?on_conflict={on_conflict}"
		headers = {
			"apikey": self.key,
			"Authorization": f"Bearer {self.key}",
			"Content-Type": "application/json",
			"Prefer": f"{'resolution='+resolution+',' if resolution else ''}return=minimal",
		}
		resp = requests.post(endpoint, json=payload, headers=headers, timeout=30)
		try:
			resp.raise_for_status()
		except requests.HTTPError as e:
			# Attach response text for easier debugging
			raise requests.HTTPError(f"{e} | details: {resp.text}") from e

