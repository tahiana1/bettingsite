import { API_CONFIG } from '../config/api';
import api from '../api';

// Types matching the backend models
export interface BallOption {
  color: 'blue' | 'red' | 'green';
  text: string;
}

export interface MiniBetOption {
  id?: number;
  name: string;
  odds: string;
  type: 'single' | 'combination';
  ball?: 'blue' | 'red' | 'green';
  text?: string;
  balls?: BallOption[];
  gameType: string;
  category: 'powerball' | 'normalball';
  level: number;
  enabled: boolean;
  orderNum?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MiniGameConfig {
  id?: number;
  gameType: string;
  level: number;
  maxBettingValue: number;
  minBettingValue: number;
  isActive: boolean;
}

// API Response types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

interface ApiError {
  error: string;
  validations?: Record<string, string>;
}

// Mini Bet Options API Service
export class MiniBetOptionsAPI {

  // Get all mini bet options with optional filtering
  static async getOptions(params?: {
    gameType?: string;
    category?: string;
    level?: number;
    enabled?: boolean;
  }): Promise<MiniBetOption[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.gameType) queryParams.append('gameType', params.gameType);
      if (params?.category) queryParams.append('category', params.category);
      if (params?.level) queryParams.append('level', params.level.toString());
      if (params?.enabled !== undefined) queryParams.append('enabled', params.enabled.toString());

      const response = await api(`mini/options?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching mini bet options:', error);
      throw error;
    }
  }

  // Get a specific mini bet option by ID
  static async getOption(id: number): Promise<MiniBetOption> {
    try {
      const response = await api(`mini/options/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching mini bet option:', error);
      throw error;
    }
  }

  // Create a new mini bet option
  static async createOption(option: Omit<MiniBetOption, 'id'>): Promise<MiniBetOption> {
    try {
      const response = await api('mini/options', {
        method: 'POST',
        data: option
      });
      return response.data;
    } catch (error) {
      console.error('Error creating mini bet option:', error);
      throw error;
    }
  }

  // Update an existing mini bet option
  static async updateOption(id: number, option: Partial<MiniBetOption>): Promise<MiniBetOption> {
    try {
      const response = await api(`mini/options/${id}`, {
        method: 'PUT',
        data: option
      });
      return response.data;
    } catch (error) {
      console.error('Error updating mini bet option:', error);
      throw error;
    }
  }

  // Delete a mini bet option
  static async deleteOption(id: number): Promise<void> {
    try {
      await api(`mini/options/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error deleting mini bet option:', error);
      throw error;
    }
  }

  // Toggle the enabled status of a mini bet option
  static async toggleOption(id: number): Promise<MiniBetOption> {
    try {
      const response = await api(`mini/options/${id}/toggle`, {
        method: 'PATCH'
      });
      return response.data;
    } catch (error) {
      console.error('Error toggling mini bet option:', error);
      throw error;
    }
  }

  // Bulk update multiple mini bet options
  static async bulkUpdateOptions(updates: Array<{
    id: number;
    enabled?: boolean;
    odds?: string;
    orderNum?: number;
  }>): Promise<void> {
    try {
      await api('mini/options/bulk-update', {
        method: 'PUT',
        data: { options: updates }
      });
    } catch (error) {
      console.error('Error bulk updating mini bet options:', error);
      throw error;
    }
  }

  // Get mini game configurations
  static async getConfigs(params?: {
    gameType?: string;
    level?: number;
  }): Promise<MiniGameConfig[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.gameType) queryParams.append('gameType', params.gameType);
      if (params?.level) queryParams.append('level', params.level.toString());

      const response = await api(`mini/configs?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching mini game configs:', error);
      throw error;
    }
  }

  // Update mini game configuration
  static async updateConfig(config: Partial<MiniGameConfig>): Promise<MiniGameConfig> {
    try {
      const response = await api('mini/configs', {
        method: 'PUT',
        data: config
      });
      return response.data;
    } catch (error) {
      console.error('Error updating mini game config:', error);
      throw error;
    }
  }
}

// Admin API Service (for admin-specific operations)
export class AdminMiniBetOptionsAPI {

  // Initialize default mini bet options for a game type and level
  static async initializeDefaults(gameType: string, level: number): Promise<MiniBetOption[]> {
    try {
      const response = await api('admin/mini/options/initialize-defaults', {
        method: 'POST',
        data: { gameType, level }
      });
      return response.data;
    } catch (error) {
      console.error('Error initializing default mini bet options:', error);
      throw error;
    }
  }

  // Hard delete a mini bet option (admin only)
  static async hardDeleteOption(id: number): Promise<void> {
    try {
      await api(`admin/mini/options/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error hard deleting mini bet option:', error);
      throw error;
    }
  }
}
