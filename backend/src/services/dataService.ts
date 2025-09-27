import { supabase } from '../config/database';
import {
  Co2Row,
  MixRow,
  NetZeroRow,
  CreateCo2Request,
  UpdateCo2Request,
  CreateMixRequest,
  UpdateMixRequest,
  CreateNetZeroRequest,
  UpdateNetZeroRequest,
} from "../types";

export class DataService {
  /**
   * Fetch CO2 intensity data
   */
  static async fetchCo2Data(limit: number = 96): Promise<Co2Row[]> {
    if (!supabase) {
      console.warn("Supabase not initialized, returning empty data");
      return [];
    }

    try {
      const { data, error } = await supabase
        .from("co2_intensity")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to fetch CO2 data: ${error.message}`);
      }

      return ((data ?? []) as Co2Row[]).reverse();
    } catch (error) {
      console.error("Error fetching CO2 data:", error);
      throw error;
    }
  }

  /**
   * Fetch generation mix data
   */
  static async fetchMixData(limit: number = 96): Promise<MixRow[]> {
    if (!supabase) {
      console.warn("Supabase not initialized, returning empty data");
      return [];
    }

    try {
      const { data, error } = await supabase
        .from("generation_mix")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to fetch mix data: ${error.message}`);
      }

      return ((data ?? []) as MixRow[]).reverse();
    } catch (error) {
      console.error("Error fetching mix data:", error);
      throw error;
    }
  }

  /**
   * Fetch net-zero alignment data
   */
  static async fetchNetZeroData(limit: number = 100): Promise<NetZeroRow[]> {
    if (!supabase) {
      console.warn("Supabase not initialized, returning empty data");
      return [];
    }

    try {
      const { data, error } = await supabase
        .from("netzero_alignment")
        .select("*")
        .order("year", { ascending: true })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to fetch net-zero data: ${error.message}`);
      }

      return (data ?? []) as NetZeroRow[];
    } catch (error) {
      console.error("Error fetching net-zero data:", error);
      throw error;
    }
  }

  /**
   * Fetch all dashboard data in parallel
   */
  static async fetchAllData(
    co2Limit: number = 96,
    mixLimit: number = 96,
    netZeroLimit: number = 100
  ) {
    try {
      const [co2Data, mixData, netZeroData] = await Promise.all([
        this.fetchCo2Data(co2Limit),
        this.fetchMixData(mixLimit),
        this.fetchNetZeroData(netZeroLimit),
      ]);

      return {
        co2: co2Data,
        mix: mixData,
        netZero: netZeroData,
      };
    } catch (error) {
      console.error("Error fetching all data:", error);
      throw error;
    }
  }

  /**
   * Get latest CO2 intensity value
   */
  static async getLatestCo2Intensity(): Promise<Co2Row | null> {
    if (!supabase) {
      console.warn("Supabase not initialized, returning null");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("co2_intensity")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        throw new Error(`Failed to fetch latest CO2 data: ${error.message}`);
      }

      return data as Co2Row;
    } catch (error) {
      console.error("Error fetching latest CO2 data:", error);
      return null;
    }
  }

  /**
   * Get latest generation mix data
   */
  static async getLatestMixData(): Promise<MixRow | null> {
    if (!supabase) {
      console.warn("Supabase not initialized, returning null");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("generation_mix")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        throw new Error(`Failed to fetch latest mix data: ${error.message}`);
      }

      return data as MixRow;
    } catch (error) {
      console.error("Error fetching latest mix data:", error);
      return null;
    }
  }

  // ========== CRUD OPERATIONS ==========

  /**
   * Create new CO2 intensity record
   */
  static async createCo2Data(data: CreateCo2Request) {
    if (!supabase) {
      throw new Error("Supabase not initialized");
    }

    try {
      const { data: result, error } = await supabase
        .from("co2_intensity")
        .insert([data])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create CO2 data: ${error.message}`);
      }

      return result;
    } catch (error) {
      console.error("Error creating CO2 data:", error);
      throw error;
    }
  }

  /**
   * Update CO2 intensity record
   */
  static async updateCo2Data(id: number, data: UpdateCo2Request) {
    if (!supabase) {
      throw new Error("Supabase not initialized");
    }

    try {
      const { data: result, error } = await supabase
        .from("co2_intensity")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update CO2 data: ${error.message}`);
      }

      return result;
    } catch (error) {
      console.error("Error updating CO2 data:", error);
      throw error;
    }
  }

  /**
   * Delete CO2 intensity record
   */
  static async deleteCo2Data(id: number) {
    if (!supabase) {
      throw new Error("Supabase not initialized");
    }

    try {
      const { error } = await supabase
        .from("co2_intensity")
        .delete()
        .eq("id", id);

      if (error) {
        throw new Error(`Failed to delete CO2 data: ${error.message}`);
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting CO2 data:", error);
      throw error;
    }
  }

  /**
   * Create new generation mix record
   */
  static async createMixData(data: CreateMixRequest) {
    if (!supabase) {
      throw new Error("Supabase not initialized");
    }

    try {
      const { data: result, error } = await supabase
        .from("generation_mix")
        .insert([data])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create mix data: ${error.message}`);
      }

      return result;
    } catch (error) {
      console.error("Error creating mix data:", error);
      throw error;
    }
  }

  /**
   * Update generation mix record
   */
  static async updateMixData(id: number, data: UpdateMixRequest) {
    if (!supabase) {
      throw new Error("Supabase not initialized");
    }

    try {
      const { data: result, error } = await supabase
        .from("generation_mix")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update mix data: ${error.message}`);
      }

      return result;
    } catch (error) {
      console.error("Error updating mix data:", error);
      throw error;
    }
  }

  /**
   * Delete generation mix record
   */
  static async deleteMixData(id: number) {
    if (!supabase) {
      throw new Error("Supabase not initialized");
    }

    try {
      const { error } = await supabase
        .from("generation_mix")
        .delete()
        .eq("id", id);

      if (error) {
        throw new Error(`Failed to delete mix data: ${error.message}`);
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting mix data:", error);
      throw error;
    }
  }

  /**
   * Create new net-zero alignment record
   */
  static async createNetZeroData(data: CreateNetZeroRequest) {
    if (!supabase) {
      throw new Error("Supabase not initialized");
    }

    try {
      const { data: result, error } = await supabase
        .from("netzero_alignment")
        .insert([data])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create net-zero data: ${error.message}`);
      }

      return result;
    } catch (error) {
      console.error("Error creating net-zero data:", error);
      throw error;
    }
  }

  /**
   * Update net-zero alignment record
   */
  static async updateNetZeroData(id: number, data: UpdateNetZeroRequest) {
    if (!supabase) {
      throw new Error("Supabase not initialized");
    }

    try {
      const { data: result, error } = await supabase
        .from("netzero_alignment")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update net-zero data: ${error.message}`);
      }

      return result;
    } catch (error) {
      console.error("Error updating net-zero data:", error);
      throw error;
    }
  }

  /**
   * Delete net-zero alignment record
   */
  static async deleteNetZeroData(id: number) {
    if (!supabase) {
      throw new Error("Supabase not initialized");
    }

    try {
      const { error } = await supabase
        .from("netzero_alignment")
        .delete()
        .eq("id", id);

      if (error) {
        throw new Error(`Failed to delete net-zero data: ${error.message}`);
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting net-zero data:", error);
      throw error;
    }
  }
}
