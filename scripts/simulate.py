import sys
from pathlib import Path


def main() -> None:
	# Allow running as a stand-alone script without installation
	root = Path(__file__).resolve().parents[1]
	sys.path.insert(0, str(root))
	from simulator.simulate import main as _main  # type: ignore
	_main()


if __name__ == "__main__":
	main()



