import api from "./index";

export interface PartnerCasinoBetFilters {
  limit?: number;
  offset?: number;
  game_name_filter?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface PartnerMiniGameBetFilters {
  limit?: number;
  offset?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface PartnerCasinoBet {
  id: number;
  userId: number;
  user?: {
    id: number;
    userid: string;
    profile?: {
      level: number;
      nickname: string;
      name: string;
      phone: string;
    };
    root?: {
      id: number;
      userid: string;
    };
    parent?: {
      id: number;
      userid: string;
    };
  };
  gameId: number;
  gameName: string;
  transId: string;
  bettingTime: number;
  details: any;
  betAmount: number;
  winAmount: number;
  netAmount: number;
  resultStatus: string;
  beforeAmount: number;
  afterAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  betId: number;
  winId: number;
}

export interface PartnerMiniGameBet {
  id: number;
  type: string;
  userId: number;
  user?: {
    id: number;
    userid: string;
    profile?: {
      level: number;
      nickname: string;
      name: string;
      phone: string;
    };
    root?: {
      id: number;
      userid: string;
    };
    parent?: {
      id: number;
      userid: string;
    };
  };
  gameId: number;
  amount: number;
  status: string;
  gameName: string;
  transId: string;
  winningAmount: number;
  bettingTime: number;
  details: any;
  beforeAmount: number;
  afterAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerBettingResponse<T> {
  message: string;
  status: boolean;
  data: T[];
  total: number;
}

// Partner Betting API functions
export const partnerBettingAPI = {
  // Get casino bets (includes slot and non-slot)
  getCasinoBets: async (
    filters: PartnerCasinoBetFilters = {}
  ): Promise<PartnerBettingResponse<PartnerCasinoBet>> => {
    return api("partner/betting/casino", {
      method: "POST",
      data: {
        limit: filters.limit || 25,
        offset: filters.offset || 0,
        game_name_filter: filters.game_name_filter || "",
        status: filters.status || "",
        date_from: filters.date_from || "",
        date_to: filters.date_to || "",
        search: filters.search || "",
      },
    });
  },

  // Get mini game bets
  getMiniGameBets: async (
    filters: PartnerMiniGameBetFilters = {}
  ): Promise<PartnerBettingResponse<PartnerMiniGameBet>> => {
    return api("partner/betting/minigame", {
      method: "POST",
      data: {
        limit: filters.limit || 25,
        offset: filters.offset || 0,
        status: filters.status || "",
        date_from: filters.date_from || "",
        date_to: filters.date_to || "",
        search: filters.search || "",
      },
    });
  },
};

