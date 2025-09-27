import { supabase } from '../config/database';
import { Co2Row, MixRow, NetZeroRow } from '../types';

export class DataService {
  /**
   * Fetch CO2 intensity data
   */
  static async fetchCo2Data(limit: number = 96): Promise<Co2Row[]> {
    try {
      const { data, error } = await supabase
        .from('co2_intensity')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to fetch CO2 data: ${error.message}`);
      }

      return ((data ?? []) as Co2Row[]).reverse();
    } catch (error) {
      console.error('Error fetching CO2 data:', error);
      throw error;
    }
  }

  /**
   * Fetch generation mix data
   */
  static async fetchMixData(limit: number = 96): Promise<MixRow[]> {
    try {
      const { data, error } = await supabase
        .from('generation_mix')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to fetch mix data: ${error.message}`);
      }

      return ((data ?? []) as MixRow[]).reverse();
    } catch (error) {
      console.error('Error fetching mix data:', error);
      throw error;
    }
  }

  /**
   * Fetch net-zero alignment data
   */
  static async fetchNetZeroData(limit: number = 100): Promise<NetZeroRow[]> {
    try {
      const { data, error } = await supabase
        .from('netzero_alignment')
        .select('*')
        .order('year', { ascending: true })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to fetch net-zero data: ${error.message}`);
      }

      return (data ?? []) as NetZeroRow[];
    } catch (error) {
      console.error('Error fetching net-zero data:', error);
      throw error;
    }
  }

  /**
   * Fetch all dashboard data in parallel
   */
  static async fetchAllData(co2Limit: number = 96, mixLimit: number = 96, netZeroLimit: number = 100) {
    try {
      const [co2Data, mixData, netZeroData] = await Promise.all([
        this.fetchCo2Data(co2Limit),
        this.fetchMixData(mixLimit),
        this.fetchNetZeroData(netZeroLimit)
      ]);

      return {
        co2: co2Data,
        mix: mixData,
        netZero: netZeroData
      };
    } catch (error) {
      console.error('Error fetching all data:', error);
      throw error;
    }
  }

  /**
   * Get latest CO2 intensity value
   */
  static async getLatestCo2Intensity(): Promise<Co2Row | null> {
    try {
      const { data, error } = await supabase
        .from('co2_intensity')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        throw new Error(`Failed to fetch latest CO2 data: ${error.message}`);
      }

      return data as Co2Row;
    } catch (error) {
      console.error('Error fetching latest CO2 data:', error);
      return null;
    }
  }

  /**
   * Get latest generation mix data
   */
  static async getLatestMixData(): Promise<MixRow | null> {
    try {
      const { data, error } = await supabase
        .from('generation_mix')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        throw new Error(`Failed to fetch latest mix data: ${error.message}`);
      }

      return data as MixRow;
    } catch (error) {
      console.error('Error fetching latest mix data:', error);
      return null;
    }
  }
}
