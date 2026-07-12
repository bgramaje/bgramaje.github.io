export interface YamlResume {
  content: ResumeContent;
}

export interface ResumeContent {
  basics: {
    name: string;
    headline?: string;
    email?: string;
    phone?: string;
    url?: string;
    summary?: string;
  };
  location?: {
    address?: string;
    city?: string;
    region?: string;
    country?: string;
  };
  profiles?: Array<{ network: string; url: string; username?: string }>;
  education?: Array<{
    institution?: string;
    url?: string;
    degree?: string;
    area?: string;
    startDate?: string;
    endDate?: string | null;
    summary?: string;
  }>;
  work?: Array<{
    name?: string;
    url?: string;
    position?: string;
    startDate?: string;
    endDate?: string | null;
    summary?: string;
    keywords?: string[];
  }>;
  languages?: Array<{ language?: string; fluency?: string }>;
  skills?: Array<{ name?: string; level?: string; keywords?: string[] }>;
  publications?: Array<{
    name?: string;
    publisher?: string;
    url?: string;
    releaseDate?: string;
    summary?: string;
  }>;
}
