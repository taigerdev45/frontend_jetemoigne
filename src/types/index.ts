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
