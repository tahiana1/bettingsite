import api from "./index";

export interface PartnerQna {
  id: number;
  userId: number;
  user?: {
    id: number;
    userid: string;
    profile?: {
      level: number;
      nickname: string;
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
  domainId?: number;
  type?: string;
  questionTitle: string;
  question: string;
  answerTitle?: string;
  answer?: string;
  status: string;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface PartnerQnasResponse {
  success: boolean;
  data: PartnerQna[];
  pagination: {
    current_page: number;
    from: number;
    to: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface SinglePartnerQnaResponse {
  success: boolean;
  data: PartnerQna;
  message: string;
}

export interface ReplyQnaInput {
  answer: string;
}

export interface UpdateQnaStatusInput {
  status: string;
}

// Partner QNA API functions
export const partnerQnaAPI = {
  // Get all partner QNAs with pagination and filters
  getQnas: async (
    page: number = 1,
    perPage: number = 25,
    status?: string,
    type?: string,
    search?: string
  ): Promise<PartnerQnasResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      perPage: perPage.toString(),
    });

    if (status) {
      params.append("status", status);
    }

    if (type) {
      params.append("type", type);
    }

    if (search) {
      params.append("search", search);
    }

    return api(`partner/qnas?${params.toString()}`, {
      method: "GET",
    });
  },

  // Reply to a QNA
  replyQna: async (
    id: number,
    input: ReplyQnaInput
  ): Promise<SinglePartnerQnaResponse> => {
    return api(`partner/qnas/${id}/reply`, {
      method: "POST",
      data: input,
    });
  },

  // Update QNA status
  updateQnaStatus: async (
    id: number,
    input: UpdateQnaStatusInput
  ): Promise<SinglePartnerQnaResponse> => {
    return api(`partner/qnas/${id}/status`, {
      method: "PUT",
      data: input,
    });
  },

  // Complete a QNA
  completeQna: async (id: number): Promise<{ success: boolean; message: string }> => {
    return api(`partner/qnas/${id}/complete`, {
      method: "POST",
    });
  },

  // Delete a QNA
  deleteQna: async (id: number): Promise<{ success: boolean; message: string }> => {
    return api(`partner/qnas/${id}/delete`, {
      method: "DELETE",
    });
  },
};

