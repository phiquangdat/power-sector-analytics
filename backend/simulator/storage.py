import csv
import os
from datetime import datetime
from typing import Iterable, Dict, Any


def ensure_dir(path: str) -> None:
	if not os.path.isdir(path):
		os.makedirs(path, exist_ok=True)


def append_csv(path: str, rows: Iterable[Dict[str, Any]]) -> None:
	rows = list(rows)
	if not rows:
		return
	ensure_dir(os.path.dirname(path))
	file_exists = os.path.isfile(path)
	with open(path, "a", newline="", encoding="utf-8") as f:
		writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
		if not file_exists:
			writer.writeheader()
		for row in rows:
			writer.writerow(_serialize_row(row))


def _serialize_row(row: Dict[str, Any]) -> Dict[str, Any]:
	out: Dict[str, Any] = {}
	for k, v in row.items():
		if isinstance(v, datetime):
			out[k] = v.isoformat()
		else:
			out[k] = v
	return out



