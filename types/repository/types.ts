export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics?: string[];
  isConnected: boolean; 
}

export interface RepositoryCardProps {
  repo: Repository;
  onRegister: (repo: Repository) => void;
  connectingId: number | null;
}