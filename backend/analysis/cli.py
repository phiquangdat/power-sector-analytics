import sys
from pathlib import Path
import argparse
import pandas as pd


def main() -> None:
	root = Path(__file__).resolve().parents[1]
	sys.path.insert(0, str(root))
	from analysis.data_access import fetch_supabase_table, read_csv_table
	from analysis.metrics import summarize_co2, summarize_generation_mix, summarize_netzero

	parser = argparse.ArgumentParser(description="Analysis CLI")
	parser.add_argument("source", choices=["supabase", "csv"], help="Data source")
	parser.add_argument("--limit", type=int, default=1000)
	parser.add_argument("--csvdir", type=str, default="data")
	args = parser.parse_args()

	if args.source == "supabase":
		df_co2 = fetch_supabase_table("co2_intensity", limit=args.limit, order="timestamp")
		df_gen = fetch_supabase_table("generation_mix", limit=args.limit, order="timestamp")
		df_nz = fetch_supabase_table("netzero_alignment", limit=100, order="year")
	else:
		csvdir = Path(args.csvdir)
		df_co2 = read_csv_table(str(csvdir / "co2_intensity.csv")) if (csvdir / "co2_intensity.csv").exists() else pd.DataFrame()
		df_gen = read_csv_table(str(csvdir / "generation_mix.csv")) if (csvdir / "generation_mix.csv").exists() else pd.DataFrame()
		df_nz = read_csv_table(str(csvdir / "netzero_alignment.csv")) if (csvdir / "netzero_alignment.csv").exists() else pd.DataFrame()

	res = {
		"co2": summarize_co2(df_co2),
		"generation_mix": summarize_generation_mix(df_gen),
		"netzero_alignment": summarize_netzero(df_nz),
	}
	print(res)


if __name__ == "__main__":
	main()



