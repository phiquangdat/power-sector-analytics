from __future__ import annotations

import os
from typing import Optional
import pandas as pd
import requests


def load_env():
	from dotenv import load_dotenv
	load_dotenv(override=False)


def get_supabase_env() -> tuple[Optional[str], Optional[str]]:
	load_env()
	return os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY")


def fetch_supabase_table(table: str, limit: int = 1000, order: str = "timestamp") -> pd.DataFrame:
	url, key = get_supabase_env()
	if not url or not key:
		raise RuntimeError("Supabase URL/KEY not set in environment")
	endpoint = f"{url}/rest/v1/{table}?select=*&order={order}.desc&limit={limit}"
	headers = {
		"apikey": key,
		"Authorization": f"Bearer {key}",
	}
	resp = requests.get(endpoint, headers=headers, timeout=30)
	resp.raise_for_status()
	data = resp.json()
	return pd.DataFrame(data)


def read_csv_table(path: str) -> pd.DataFrame:
	return pd.read_csv(path)



