import api from "./index";

export interface PartnerTransaction {
  id: number;
  userId: number;
  user?: {
    id: number;
    userid: string;
    name?: string;
    phone?: string;
      profile?: {
        balance: number;
        nickname?: string;
        level?: number;
      };
  };
  type: string; // "deposit" or "withdrawal"
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  explation?: string;
  status: string; // "pending", "A" (approved), "C" (cancelled), "W" (waiting), "DL" (deleted)
  transactionAt: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface PartnerTransactionsResponse {
  success: boolean;
  data: PartnerTransaction[];
  pagination: {
    current_page: number;
    from: number;
    to: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface GetPartnerTransactionsParams {
  page?: number;
  perPage?: number;
  type?: string; // "entire", "deposit", "withdrawal", "cancellation", "delete"
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PartnerRollingTransaction {
  id: number;
  userId: number;
  user?: {
    id: number;
    userid: string;
    name?: string;
    phone?: string;
    profile?: {
      balance: number;
      roll: number;
      nickname?: string;
      level?: number;
    };
  };
  type: string; // "rollingExchange"
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  pointBefore: number; // Used for rolling before
  pointAfter: number; // Used for rolling after
  explation?: string;
  status: string; // "pending", "A" (approved), "C" (cancelled), "W" (waiting), "DL" (deleted)
  transactionAt: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerRollingTransactionsResponse {
  success: boolean;
  data: PartnerRollingTransaction[];
  summary: {
    amountHeld: number;
    rollingBalance: number;
  };
  pagination: {
    current_page: number;
    from: number;
    to: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface GetPartnerRollingTransactionsParams {
  page?: number;
  perPage?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PartnerPointTransaction {
  id: number;
  userId: number;
  user?: {
    id: number;
    userid: string;
    name?: string;
    phone?: string;
    profile?: {
      balance: number;
      point: number;  
      nickname?: string;
      level?: number;
    };
  };
  type: string; // "point"
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  pointBefore: number; // Point before conversion
  pointAfter: number; // Point after conversion
  explation?: string;
  status: string; // "pending", "A" (approved), "C" (cancelled), "W" (waiting), "DL" (deleted)
  transactionAt: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerPointTransactionsResponse {
  success: boolean;
  data: PartnerPointTransaction[];
  summary: {
    amountHeld: number;
    pointsHeld: number;
  };
  pagination: {
    current_page: number;
    from: number;
    to: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface GetPartnerPointTransactionsParams {
  page?: number;
  perPage?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Partner Transaction API functions
export const partnerTransactionAPI = {
  // Get all partner transactions with pagination and filters
  getTransactions: async (
    params: GetPartnerTransactionsParams = {}
  ): Promise<PartnerTransactionsResponse> => {
    const queryParams = new URLSearchParams();

    if (params.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params.perPage) {
      queryParams.append("perPage", params.perPage.toString());
    }
    if (params.type && params.type !== "entire") {
      queryParams.append("type", params.type);
    }
    if (params.search) {
      queryParams.append("search", params.search);
    }
    if (params.dateFrom) {
      queryParams.append("dateFrom", params.dateFrom);
    }
    if (params.dateTo) {
      queryParams.append("dateTo", params.dateTo);
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `partner/transactions?${queryString}`
      : "partner/transactions";

    return api(url, {
      method: "GET",
    });
  },

  // Get rolling transactions for partner
  getRollingTransactions: async (
    params: GetPartnerRollingTransactionsParams = {}
  ): Promise<PartnerRollingTransactionsResponse> => {
    const queryParams = new URLSearchParams();

    if (params.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params.perPage) {
      queryParams.append("perPage", params.perPage.toString());
    }
    if (params.search) {
      queryParams.append("search", params.search);
    }
    if (params.dateFrom) {
      queryParams.append("dateFrom", params.dateFrom);
    }
    if (params.dateTo) {
      queryParams.append("dateTo", params.dateTo);
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `partner/transactions/rolling?${queryString}`
      : "partner/transactions/rolling";

    return api(url, {
      method: "GET",
    });
  },

  // Get point conversion transactions for partner
  getPointTransactions: async (
    params: GetPartnerPointTransactionsParams = {}
  ): Promise<PartnerPointTransactionsResponse> => {
    const queryParams = new URLSearchParams();

    if (params.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params.perPage) {
      queryParams.append("perPage", params.perPage.toString());
    }
    if (params.search) {
      queryParams.append("search", params.search);
    }
    if (params.dateFrom) {
      queryParams.append("dateFrom", params.dateFrom);
    }
    if (params.dateTo) {
      queryParams.append("dateTo", params.dateTo);
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `partner/transactions/point?${queryString}`
      : "partner/transactions/point";

    return api(url, {
      method: "GET",
    });
  },
};

