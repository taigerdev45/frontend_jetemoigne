// Testimonies
export type TestimonyType = "video" | "audio" | "text";

export interface Testimony {
  id: string;
  type: TestimonyType;
  author: {
    name: string;
    avatar?: string;
    role?: string;
  };
  title: string;
  content: string; // URL for video/audio, text content for text
  thumbnail?: string; // For video
  duration?: string; // For video/audio
  date: string;
  category: string;
  status?: "pending" | "approved" | "rejected" | "scheduled"; // For admin
}

export interface FinanceTransaction {
  id: string;
  date: string;
  type: "financier" | "materiel";
  category: "don" | "ouvrage" | "pub";
  amount: number;
  sender: string;
  status: "verified" | "pending" | "rejected";
  proofUrl?: string;
}

// Projects
export interface ProjectMilestone {
  title: string;
  date: string;
  completed: boolean;
}

export interface ProjectTeamMember {
  userId: string;
  role: string;
  name: string;
  avatar?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  goal: number;
  raised: number;
  donorsCount: number;
  endDate: string;
  status: "active" | "completed" | "upcoming";
  milestones?: ProjectMilestone[];
  objectives?: string[];
  team?: ProjectTeamMember[];
  budget?: number;
}

// Personnel & Users
export type UserRole = "Super Admin" | "Admin" | "Gestionnaire" | "Comptable" | "Observateur";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: "active" | "inactive";
  lastLogin?: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[]; // Domaine de compétence
  status: "active" | "pending";
  dateJoined: string;
}

export interface Partner {
  id: string;
  name: string;
  activityDomain: string;
  country: string;
  contactEmail: string;
  website?: string;
  logo?: string;
  status: "active" | "pending";
}

// Ads & Books
export interface Advertisement {
  id: string;
  title: string;
  type: "video" | "image";
  mediaUrl: string;
  redirectUrl: string;
  startDate: string;
  endDate: string;
  status: "active" | "scheduled" | "ended";
  views?: number;
  clicks?: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number; // 0 for free
  coverUrl: string;
  pdfUrl: string;
  description?: string;
  publishedDate: string;
  status: "published" | "draft";
}

// Programs (Placeholder)
export interface Program {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl?: string;
  category: string;
  date: string;
  duration?: string;
  externalUrl?: string; // YouTube/FB/TikTok
  format?: string;
  status: "published" | "draft" | "archived";
}
