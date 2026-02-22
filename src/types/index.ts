// ============================================================
// Types aligns avec le schema Prisma du backend NestJS
// ============================================================

// --- Enums ---

export type UserRole = "super_admin" | "admin" | "manager" | "accountant" | "observer";

export type ProgramCategory =
  | "info"
  | "jeunesse_cinema"
  | "divertissement"
  | "podcast"
  | "evangelisation"
  | "concert"
  | "temoignage_live"
  | "autre";

export type ContentFormat = "video" | "audio" | "ecrit" | "image";

export type TestimonyStatus = "recu" | "en_lecture" | "valide" | "rejete" | "programme";

export type SupportType =
  | "don_financier"
  | "don_materiel"
  | "benevolat"
  | "partenariat"
  | "achat_ouvrage"
  | "paiement_pub";

export type TransactionStatus = "en_attente" | "verifie" | "rejete";

// --- Models ---

export interface Profile {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: ProgramCategory;
  format: ContentFormat;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  audioUrl: string | null;
  contentText: string | null;
  isFeatured: boolean;
  isLive: boolean;
  viewsCount: string; // BigInt serialise en string par Prisma
  createdBy: string | null;
  publishedAt: string | null;
  createdAt: string;
}

export interface Testimony {
  id: string;
  authorName: string | null;
  authorEmail: string | null;
  title: string | null;
  contentText: string | null;
  mediaUrl: string | null;
  mediaType: ContentFormat;
  status: TestimonyStatus;
  adminNotes: string | null;
  reviewedBy: string | null;
  scheduledFor: string | null;
  createdAt: string;
}

export interface TestimonyWithReviewer extends Testimony {
  reviewer: Profile | null;
}

export interface Project {
  id: string;
  title: string;
  vision: string | null;
  values: string | null;
  needs: string | null;
  goalAmount: string | null; // Decimal serialise en string
  currentAmount: string | null; // Decimal serialise en string
  progressPercent: number | null;
  status: string | null;
  coverImageUrl: string | null;
  createdAt: string;
  milestones?: ProjectMilestone[];
  team?: ProjectTeamMember[];
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  isCompleted: boolean;
  dueDate: string | null;
}

export interface ProjectTeamMember {
  projectId: string;
  userId: string;
  roleInProject: string | null;
  user?: Profile;
}

export interface Transaction {
  id: string;
  donorName: string | null;
  donorEmail: string | null;
  donorPhone: string | null;
  amount: string; // Decimal serialise en string
  currency: string | null;
  transactionType: SupportType;
  paymentMethod: string | null;
  proofScreenshotUrl: string | null;
  transactionRefId: string | null;
  status: TransactionStatus;
  validatedBy: string | null;
  projectId: string | null;
  createdAt: string;
  // Relations optionnelles
  validator?: Profile | null;
  project?: Project | null;
}

export interface Volunteer {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  skills: string[];
  availability: string | null;
  status: string | null;
  createdAt: string;
}

export interface Partner {
  id: string;
  name: string;
  activityDomain: string | null;
  country: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  price: string | null; // Decimal serialise en string
  isFree: boolean;
  pdfUrl: string;
  coverUrl: string | null;
  downloadsCount: number | null;
  createdAt: string;
}

export interface Ad {
  id: string;
  clientName: string;
  mediaUrl: string;
  mediaType: ContentFormat;
  redirectUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  clicksCount: number | null;
  viewsCount: number | null;
  createdAt: string;
}

export interface AppSettings {
  id: number;
  airtelNumber: string | null;
  moovNumber: string | null;
  maintenanceMode: boolean;
  contactEmail: string | null;
  donationRules: string | null;
  updatedAt: string;
}

export interface AnalyticsDaily {
  date: string;
  totalVisits: number | null;
  pageViews: Record<string, unknown> | null;
  deviceStats: Record<string, unknown> | null;
}

// --- API Response Types ---

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    fullName: string | null;
    role: UserRole;
  };
}

export interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
}

export interface PublicHubHome {
  featuredPrograms: Program[];
  latestNews: Program[];
  activeAds: Ad[];
  urgentProjects: (Project & { milestones: ProjectMilestone[] })[];
  latestTestimonies: Testimony[];
  newBooks: Book[];
  liveInfo: Program | null;
}

export interface PublicHubStats {
  donorsCount: number;
  volunteersCount: number;
  testimoniesCount: number;
}

export interface DashboardData {
  audience: {
    totalVisits: number;
  };
  finances: {
    totalDonations: string; // Decimal
    donorsCount: number;
  };
  content: {
    totalPrograms: number;
    totalTestimonies: number;
    pendingTestimonies: number;
    activeAds: number;
  };
}

export interface AnalyticsFinances {
  monthlyRevenue: {
    createdAt: string;
    _sum: { amount: string | null };
  }[];
  revenueByProject: {
    projectId: string | null;
    _sum: { amount: string | null };
  }[];
}

export interface AnalyticsContent {
  topPrograms: {
    title: string;
    viewsCount: string;
    category: ProgramCategory;
  }[];
  categoryDistribution: {
    category: ProgramCategory;
    _count: { id: number };
  }[];
}

export interface AnalyticsModeration {
  statusDistribution: {
    status: TestimonyStatus;
    _count: { id: number };
  }[];
}

export interface AdFormat {
  format: string;
  label: string;
  dailyRate: number;
  description: string;
  currency: string;
  example: string;
}

export interface BookPurchaseResponse {
  isFree: boolean;
  pdfUrl?: string;
  message?: string;
  transactionId?: string;
  payment_url?: string;
  reference?: string;
  book?: {
    id: string;
    title: string;
    price: string;
    currency: string;
  };
}

export interface AdBookingResponse {
  transactionId: string;
  payment_url: string;
  reference: string;
  summary: {
    format: string;
    formatLabel: string;
    startDate: string;
    endDate: string;
    durationDays: number;
    dailyRate: number;
    totalPrice: number;
    currency: string;
  };
}

export interface DonationInitiateResponse extends Transaction {
  payment_url?: string;
  reference?: string;
  notchpay_error?: string;
  notchpay_details?: unknown;
}

// --- Deprecated (retrocompat) ---

/** @deprecated Use Transaction instead */
export type Donation = Transaction;

/** @deprecated Use Ad instead */
export type Advertisement = Ad;

/** @deprecated Use Profile instead */
export type User = Profile;
