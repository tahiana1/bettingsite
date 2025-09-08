import api from "@/api";

export interface CasinoBetFilters {
  limit?: number;
  offset?: number;
  game_name_filter?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
}

export const fetchCasinoBets = async (filters: CasinoBetFilters = {}) => {
  try {
    const response = await api("bets/get-all-casinoBets", {
      method: "POST",
      data: {
        limit: filters.limit || 25,
        offset: filters.offset || 0,
        game_name_filter: filters.game_name_filter || "",
        status: filters.status || "",
        date_from: filters.date_from || "",
        date_to: filters.date_to || "",
      },
    });

    return {
      casinoBets: response.data || [],
      total: response.total || 0,
      status: response.status || false,
      message: response.message || "",
    };
  } catch (error) {
    console.error("Error fetching casino bets:", error);
    return {
      casinoBets: [],
      total: 0,
      status: false,
      message: "Error fetching casino bets",
    };
  }
};

export interface UserBettingHistoryFilters {
  user_id: number;
  limit?: number;
  offset?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
}

export const fetchUserBettingHistory = async (filters: UserBettingHistoryFilters) => {
  try {
    const response = await api("bets/get-user-betting-history", {
      method: "POST",
      data: {
        user_id: filters.user_id,
        limit: filters.limit || 25,
        offset: filters.offset || 0,
        status: filters.status || "",
        date_from: filters.date_from || "",
        date_to: filters.date_to || "",
      },
    });

    return {
      casinoBets: response.data?.casinoBets || [],
      sportsBets: response.data?.sportsBets || [],
      casinoTotal: response.data?.casinoTotal || 0,
      sportsTotal: response.data?.sportsTotal || 0,
      totalRecords: response.data?.totalRecords || 0,
      status: response.status || false,
      message: response.message || "",
    };
  } catch (error) {
    console.error("Error fetching user betting history:", error);
    return {
      casinoBets: [],
      sportsBets: [],
      casinoTotal: 0,
      sportsTotal: 0,
      totalRecords: 0,
      status: false,
      message: "Error fetching user betting history",
    };
  }
};
