import type {
  Testimony,
  TestimonyWithReviewer,
  Program,
  Project,
  Book,
  Ad,
  AdFormat,
  AdBookingResponse,
  BookPurchaseResponse,
  Volunteer,
  Partner,
  Transaction,
  DonationInitiateResponse,
  Profile,
  AppSettings,
  AnalyticsDaily,
  PaginatedResponse,
  DashboardData,
  AnalyticsFinances,
  AnalyticsContent,
  AnalyticsModeration,
  PublicHubHome,
  PublicHubStats,
  LoginResponse,
  ProgramCategory,
  TestimonyStatus,
  TransactionStatus,
  UserRole,
} from "@/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-jetemoigne-458j.onrender.com";

// --- Token store (en memoire, alimente par useAuth) ---
let _authToken: string | null = null;

export function setAuthToken(token: string | null) {
  _authToken = token;
}

export function getAuthToken(): string | null {
  return _authToken;
}

// --- Fetch generique ---
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Injecter le token JWT si disponible
  const token = _authToken;
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Laisser le navigateur gerer le Content-Type pour FormData
  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const response = await fetch(`${API_URL}/api/v1${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `API Error: ${response.status} ${response.statusText}`
    );
  }

  // Certains endpoints retournent du texte brut
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return response.text() as unknown as T;
}

// ============================================================
// API Client
// ============================================================

export const api = {
  // ----- Auth -----
  auth: {
    login: (credentials: { email: string; password: string }) =>
      fetchAPI<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    getProfile: () => fetchAPI<Profile>("/auth/profile"),
  },

  // ----- Public Hub -----
  publicHub: {
    home: () => fetchAPI<PublicHubHome>("/public-hub/home"),
    stats: () => fetchAPI<PublicHubStats>("/public-hub/stats"),
    settings: () => fetchAPI<AppSettings | null>("/public-hub/settings"),
  },

  // ----- Testimonies (Public) -----
  testimonies: {
    create: (data: FormData) =>
      fetchAPI<Testimony>("/testimonies", { method: "POST", body: data }),
    findAll: (page = 1, limit = 10) =>
      fetchAPI<PaginatedResponse<Testimony>>(
        `/testimonies?page=${page}&limit=${limit}`
      ),
  },

  // ----- Programs (Public) -----
  programs: {
    findAll: (params: {
      page?: number;
      limit?: number;
      category?: ProgramCategory;
      format?: string;
      search?: string;
    } = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") query.set(k, String(v));
      });
      return fetchAPI<PaginatedResponse<Program>>(`/programs?${query}`);
    },
    getLive: () => fetchAPI<Program | null>("/programs/live"),
    findBySlug: (slug: string) => fetchAPI<Program>(`/programs/${slug}`),
    incrementViews: (id: string) =>
      fetchAPI<Program>(`/programs/${id}/view`, { method: "POST" }),
  },

  // ----- Projects (Public) -----
  projects: {
    findAll: () => fetchAPI<Project[]>("/projects"),
    findOne: (id: string) => fetchAPI<Project>(`/projects/${id}`),
  },

  // ----- Support (Public) -----
  support: {
    createDonation: (data: FormData) =>
      fetchAPI<Transaction>("/support/donations", {
        method: "POST",
        body: data,
      }),
    initiatePayment: (data: {
      donorName?: string;
      donorEmail?: string;
      donorPhone?: string;
      amount: number;
      currency?: string;
      projectId?: string;
    }) =>
      fetchAPI<DonationInitiateResponse>("/support/donations/initiate", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    createVolunteer: (data: {
      fullName: string;
      email?: string;
      phone?: string;
      skills?: string[];
      availability?: string;
    }) =>
      fetchAPI<Volunteer>("/support/volunteer", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    createPartner: (data: {
      name: string;
      activityDomain?: string;
      country?: string;
      logoUrl?: string;
      websiteUrl?: string;
    }) =>
      fetchAPI<Partner>("/support/partner", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // ----- Library (Public) -----
  library: {
    findAll: (page = 1, limit = 10) =>
      fetchAPI<PaginatedResponse<Book>>(
        `/library/books?page=${page}&limit=${limit}`
      ),
    findOne: (id: string) => fetchAPI<Book>(`/library/books/${id}`),
    recordDownload: (id: string) =>
      fetchAPI<Book>(`/library/books/${id}/download`, { method: "POST" }),
    purchase: (
      id: string,
      data: {
        buyerName?: string;
        buyerEmail: string;
        buyerPhone?: string;
        currency?: string;
        callbackUrl?: string;
      }
    ) =>
      fetchAPI<BookPurchaseResponse>(`/library/books/${id}/purchase`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // ----- Ads (Public) -----
  ads: {
    findActive: () => fetchAPI<Ad[]>("/ads/active"),
    getFormats: () => fetchAPI<AdFormat[]>("/ads/formats"),
    book: (data: {
      clientName?: string;
      clientEmail: string;
      clientPhone?: string;
      clientCompany?: string;
      format: string;
      startDate: string;
      endDate: string;
      redirectUrl?: string;
      mediaUrl?: string;
      currency?: string;
      callbackUrl?: string;
    }) =>
      fetchAPI<AdBookingResponse>("/ads/book", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    recordClick: (id: string) =>
      fetchAPI<Ad>(`/ads/${id}/click`, { method: "POST" }),
    recordView: (id: string) =>
      fetchAPI<Ad>(`/ads/${id}/view`, { method: "POST" }),
  },

  // ----- Payments -----
  payments: {
    initiate: (data: {
      amount: number;
      currency: string;
      email: string;
      description: string;
      callback_url?: string;
    }) =>
      fetchAPI<unknown>("/payments/initiate", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // ----- Storage -----
  storage: {
    upload: (file: FormData, bucket = "public-assets") =>
      fetchAPI<{ url: string }>(`/storage/upload?bucket=${bucket}`, {
        method: "POST",
        body: file,
      }),
  },

  // ============================================================
  // ADMIN Endpoints (tous necessitent JWT)
  // ============================================================
  admin: {
    // ----- Hub / Dashboard -----
    hub: {
      dashboard: () => fetchAPI<DashboardData>("/admin/hub/dashboard"),
      analyticsDaily: () =>
        fetchAPI<AnalyticsDaily[]>("/admin/hub/analytics/daily"),
      analyticsFinances: () =>
        fetchAPI<AnalyticsFinances>("/admin/hub/analytics/finances"),
      analyticsContent: () =>
        fetchAPI<AnalyticsContent>("/admin/hub/analytics/content"),
      analyticsModeration: () =>
        fetchAPI<AnalyticsModeration>("/admin/hub/analytics/moderation"),
      getSettings: () =>
        fetchAPI<AppSettings | null>("/admin/hub/settings"),
      updateSettings: (data: Partial<AppSettings>) =>
        fetchAPI<AppSettings>("/admin/hub/settings", {
          method: "PATCH",
          body: JSON.stringify(data),
        }),
    },

    // ----- Testimonies (Admin) -----
    testimonies: {
      findAll: (status?: TestimonyStatus) => {
        const query = status ? `?status=${status}` : "";
        return fetchAPI<TestimonyWithReviewer[]>(
          `/admin/testimonies${query}`
        );
      },
      markRead: (id: string) =>
        fetchAPI<Testimony>(`/admin/testimonies/${id}/read`, {
          method: "PATCH",
        }),
      validate: (
        id: string,
        data?: { contentText?: string; adminNotes?: string }
      ) =>
        fetchAPI<Testimony>(`/admin/testimonies/${id}/validate`, {
          method: "PATCH",
          body: JSON.stringify(data || {}),
        }),
      schedule: (id: string, data: { scheduledFor: string }) =>
        fetchAPI<Testimony>(`/admin/testimonies/${id}/schedule`, {
          method: "PATCH",
          body: JSON.stringify(data),
        }),
    },

    // ----- Finances (Admin) -----
    finances: {
      findAll: (status?: TransactionStatus) => {
        const query = status ? `?status=${status}` : "";
        return fetchAPI<Transaction[]>(
          `/admin/finances/transactions${query}`
        );
      },
      validate: (id: string) =>
        fetchAPI<Transaction>(
          `/admin/finances/transactions/${id}/validate`,
          { method: "PATCH" }
        ),
      reject: (id: string) =>
        fetchAPI<Transaction>(
          `/admin/finances/transactions/${id}/reject`,
          { method: "PATCH" }
        ),
    },

    // ----- Team (Admin) -----
    team: {
      getUsers: () => fetchAPI<Profile[]>("/admin/team/users"),
      updateRole: (id: string, role: UserRole) =>
        fetchAPI<Profile>(`/admin/team/users/${id}/role`, {
          method: "PATCH",
          body: JSON.stringify({ role }),
        }),
      getVolunteers: () =>
        fetchAPI<Volunteer[]>("/admin/team/volunteers"),
      getPartners: () => fetchAPI<Partner[]>("/admin/team/partners"),
    },

    // ----- Content (Admin) -----
    content: {
      getPrograms: (category?: ProgramCategory) => {
        const query = category ? `?category=${category}` : "";
        return fetchAPI<Program[]>(`/admin/content/programs${query}`);
      },
      createProgram: (data: FormData) =>
        fetchAPI<Program>("/admin/content/programs", {
          method: "POST",
          body: data,
        }),
      deleteProgram: (id: string) =>
        fetchAPI<Program>(`/admin/content/programs/${id}`, {
          method: "DELETE",
        }),
      createAd: (data: FormData) =>
        fetchAPI<Ad>("/admin/content/ads", {
          method: "POST",
          body: data,
        }),
      deleteAd: (id: string) =>
        fetchAPI<Ad>(`/admin/content/ads/${id}`, { method: "DELETE" }),
      getBooks: () => fetchAPI<Book[]>("/admin/content/books"),
      createBook: (data: FormData) =>
        fetchAPI<Book>("/admin/content/books", {
          method: "POST",
          body: data,
        }),
      deleteBook: (id: string) =>
        fetchAPI<Book>(`/admin/content/books/${id}`, { method: "DELETE" }),
    },
  },
};
