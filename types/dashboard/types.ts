export interface DashboardStats {
  totalCommits: number;
  totalPRs: number;
  totalReviews: number;
  totalRepos: number;
}

export interface MonthlyActivity {
  month: string;
  commits: number;
  prs: number;
  reviews: number;
}

export interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  iconColor: string;
}
