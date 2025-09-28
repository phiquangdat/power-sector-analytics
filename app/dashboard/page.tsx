import { DashboardClient } from "@/components/DashboardClient";
import {
  fetchCo2,
  fetchMix,
  fetchNetZero,
  Co2Row,
  MixRow,
  NetZeroRow,
} from "@/lib/fetch";

export default async function DashboardPage() {
  // Fetch initial data on the server
  let initialCo2: Co2Row[] = [];
  let initialMix: MixRow[] = [];
  let initialNetZero: NetZeroRow[] = [];
  let serverError: string | null = null;

  try {
    const [co2Data, mixData, netZeroData] = await Promise.all([
      fetchCo2(96),
      fetchMix(96),
      fetchNetZero(100),
    ]);

    initialCo2 = co2Data;
    initialMix = mixData;
    initialNetZero = netZeroData;
  } catch (error) {
    console.error("Server-side data fetch error:", error);
    serverError = "Failed to load initial data";
  }

  return (
    <DashboardClient
      initialCo2={initialCo2}
      initialMix={initialMix}
      initialNetZero={initialNetZero}
      serverError={serverError}
    />
  );
}
