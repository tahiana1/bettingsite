import api from "./index";

export interface PartnerInbox {
  id: number;
  userId: number;
  user?: {
    id: number;
    userid: string;
    name?: string;
  };
  fromId: number;
  title: string;
  description: string;
  status: boolean;
  orderNum?: number;
  openedAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface PartnerInboxesResponse {
  success: boolean;
  data: PartnerInbox[];
  pagination: {
    current_page: number;
    from: number;
    to: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface SinglePartnerInboxResponse {
  success: boolean;
  data: PartnerInbox;
  message: string;
}

export interface PartnerUser {
  id: number;
  userid: string;
  name?: string;
}

export interface PartnerUsersResponse {
  success: boolean;
  data: PartnerUser[];
}

export interface CreatePartnerInboxInput {
  userId: number;
  title: string;
  description: string;
  status?: boolean;
  orderNum?: number;
}

export interface UpdatePartnerInboxInput {
  title?: string;
  description?: string;
  status?: boolean;
  orderNum?: number;
}

// Partner Inbox API functions
export const partnerInboxAPI = {
  // Get all partner inboxes with pagination and filters
  getInboxes: async (
    page: number = 1,
    perPage: number = 10,
    search?: string,
    status?: string
  ): Promise<PartnerInboxesResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      perPage: perPage.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    if (status !== undefined && status !== "") {
      params.append("status", status);
    }

    return api(`partner/inboxes/?${params.toString()}`, {
      method: "GET",
    });
  },

  // Create a new inbox
  createInbox: async (
    inbox: CreatePartnerInboxInput
  ): Promise<SinglePartnerInboxResponse> => {
    return api("partner/inboxes/create", {
      method: "POST",
      data: inbox,
    });
  },

  // Update an existing inbox
  updateInbox: async (
    id: number,
    inbox: UpdatePartnerInboxInput
  ): Promise<SinglePartnerInboxResponse> => {
    return api(`partner/inboxes/${id}/update`, {
      method: "PUT",
      data: inbox,
    });
  },

  // Delete an inbox
  deleteInbox: async (id: number): Promise<{ success: boolean; message: string }> => {
    return api(`partner/inboxes/${id}/delete`, {
      method: "DELETE",
    });
  },

  // Get users under partner for dropdown
  getPartnerUsers: async (search?: string): Promise<PartnerUsersResponse> => {
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    return api(`partner/inboxes/users${params}`, {
      method: "GET",
    });
  },
};

