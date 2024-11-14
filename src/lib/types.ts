export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  created_at: string;
  stargazers_count: number;
  language: string | null;
  private: boolean;
}

export type SortField = "created_at" | "stargazers_count";
export type SortOrder = "asc" | "desc";

export interface SortOption {
  label: string;
  field: SortField;
  order: SortOrder;
}