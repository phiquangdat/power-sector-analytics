from __future__ import annotations

import os
import pandas as pd
import requests


def get_env():
	from dotenv import load_dotenv
	load_dotenv(override=False)
	return os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY")


def fetch_table(table: str, limit: int = 500, order: str = "timestamp") -> pd.DataFrame:
	url, key = get_env()
	if not url or not key:
		raise RuntimeError("Supabase URL/KEY not set")
	endpoint = f"{url}/rest/v1/{table}?select=*&order={order}.desc&limit={limit}"
	headers = {"apikey": key, "Authorization": f"Bearer {key}"}
	resp = requests.get(endpoint, headers=headers, timeout=30)
	resp.raise_for_status()
	return pd.DataFrame(resp.json())



