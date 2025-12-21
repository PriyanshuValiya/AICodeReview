export interface Review {
  id: string;
  repositoryId: string;
  repository: {
    id: string;
    fullName: string;
    url: string;
  };
  prNumber: number;
  prTitle: string;
  prUrl: string;
  review: string;
  status: "completed" | "pending" | "failed" | string;
  createdAt: Date;
}

export interface ReviewCardProps {
  review: Review;
}

export type ASTSymbolContext = {
  path: string;
  symbolName?: string;
  symbolType?: string;
  startLine?: number;
  endLine?: number;
};