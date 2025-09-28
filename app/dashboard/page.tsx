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
  let hasError = false;

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
    console.error("Error fetching initial data on server:", error);
    hasError = true;
  }

  return (
    <DashboardClient
      initialCo2={initialCo2}
      initialMix={initialMix}
      initialNetZero={initialNetZero}
      hasError={hasError}
    />
  );
}
