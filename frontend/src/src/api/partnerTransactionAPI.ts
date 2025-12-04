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
};

