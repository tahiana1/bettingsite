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

// Optional params for money history (same as generic transactions but conceptually separated)
export interface GetPartnerMoneyHistoryParams extends GetPartnerTransactionsParams {}

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

export interface PartnerPointDetailTransaction {
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
  type: string; // "point" or "pointDeposit"
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  pointBefore: number; // Point before transaction
  pointAfter: number; // Point after transaction
  explation?: string;
  status: string;
  transactionAt: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerPointDetailsResponse {
  success: boolean;
  data: PartnerPointDetailTransaction[];
  pagination: {
    current_page: number;
    from: number;
    to: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface GetPartnerPointDetailsParams {
  page?: number;
  perPage?: number;
  type?: string; // "entire", "point", "pointDeposit", or explanation filter
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PartnerRollingHistoryTransaction {
  id: number;
  userId: number;
  type: string;
  amount: number; // Rolling gold amount
  balanceBefore: number; // Previous rolling fee
  balanceAfter: number; // After that rolling money
  shortcut: string; // Game company|Game name
  explation?: string;
  status: string;
  transactionAt: string; // Betting time
  createdAt: string; // Registration time
  user?: {
    id: number;
    userid: string;
    name?: string;
    live: number; // Rolling percentage
    profile?: {
      nickname?: string;
      level?: number;
    };
  };
}

export interface PartnerRollingHistoryResponse {
  success: boolean;
  data: PartnerRollingHistoryTransaction[];
  summary: {
    bettingAmount: number;
    rolloverAmount: number;
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

export interface GetPartnerRollingHistoryParams {
  page?: number;
  perPage?: number;
  type?: string; // "entire", "bettingRelatedRolling", "memberRollingCoversation", "rollingCoversationOfDistributor", "adminRollingPayments"
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  searchByRegistrationTime?: boolean;
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

  // Get partner money history transactions (limited to money-related types)
  getMoneyHistory: async (
    params: GetPartnerMoneyHistoryParams = {}
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
      ? `partner/transactions/money-history?${queryString}`
      : "partner/transactions/money-history";

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

  // Get point details transactions for partner (point and pointDeposit types)
  getPointDetails: async (
    params: GetPartnerPointDetailsParams = {}
  ): Promise<PartnerPointDetailsResponse> => {
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
      ? `partner/transactions/point-details?${queryString}`
      : "partner/transactions/point-details";

    return api(url, {
      method: "GET",
    });
  },

  // Get point details transactions for direct members (point and pointDeposit types)
  getDirectMemberPointsDetails: async (
    params: GetPartnerPointDetailsParams = {}
  ): Promise<PartnerPointDetailsResponse> => {
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
      ? `partner/member-management/direct-member-points-details?${queryString}`
      : "partner/member-management/direct-member-points-details";

    return api(url, {
      method: "GET",
    });
  },

  // Get rolling history transactions for partner
  getRollingHistory: async (
    params: GetPartnerRollingHistoryParams = {}
  ): Promise<PartnerRollingHistoryResponse> => {
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
    if (params.searchByRegistrationTime) {
      queryParams.append("searchByRegistrationTime", "true");
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `partner/transactions/rolling-history?${queryString}`
      : "partner/transactions/rolling-history";

    return api(url, {
      method: "GET",
    });
  },
};

