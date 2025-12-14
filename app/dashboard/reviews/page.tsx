"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getReviews } from "@/module/review/actions";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

// --- Data Structures ---

interface Review {
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
  // FIX: Changed to Date type to match Prisma's return type and fix build error
  createdAt: Date;
}

// --- Helper Components ---

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const statusConfig = {
    completed: {
      icon: CheckCircle2,
      color: "bg-green-500 hover:bg-green-600",
      text: "Completed",
    },
    pending: {
      icon: Clock,
      color: "bg-yellow-500 hover:bg-yellow-600",
      text: "In Progress",
    },
    failed: {
      icon: XCircle,
      color: "bg-red-500 hover:bg-red-600",
      text: "Failed",
    },
    default: {
      icon: Clock,
      color: "bg-gray-500 hover:bg-gray-600",
      text: review.status,
    },
  };

  const config =
    statusConfig[review.status as keyof typeof statusConfig] ||
    statusConfig.default;
  const Icon = config.icon;

  // Calculate time elapsed
  const timeAgo = formatDistanceToNow(new Date(review.createdAt), {
    addSuffix: true,
  });

  return (
    <Card className="shadow-lg transition-all duration-300 hover:shadow-xl hover:border-blue-200">
      <CardHeader className="p-4 sm:p-6 pb-3 border-b border-gray-100">
        <div className="flex justify-between items-start">
          {/* PR Title and Link */}
          <CardTitle className="text-xl font-bold text-gray-900 pr-4">
            <Link
              href={review.prUrl}
              target="_blank"
              className="hover:text-blue-600 transition-colors"
            >
              {review.prTitle}
            </Link>
          </CardTitle>

          {/* Status Badge */}
          <Badge
            className={`text-white font-semibold flex items-center flex-shrink-0 ${config.color}`}
          >
            <Icon className="w-4 h-4 mr-1" />
            {config.text}
          </Badge>
        </div>

        {/* Repo and Time */}
        <CardDescription className="flex items-center justify-between text-sm text-gray-500 mt-1">
          <span className="font-medium text-gray-600">
            {review.repository.fullName}
          </span>
          <span className="flex items-center text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Reviewed {timeAgo}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-4">
        {/* AI Review Header */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-gray-100 pb-1">
          AI Analysis
        </h3>

        {/* AI Review in Code Block Format (Scrollable) */}
        <div className="max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3 shadow-inner">
          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
            {review.review}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href={`/dashboard/reviews/${review.id}`}>
              View Full Analysis
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="text-gray-700 hover:bg-gray-100"
          >
            <a href={review.prUrl} target="_blank">
              View Pull Request <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Main Page Component ---
function ReviewPage() {
  const { data: reviews, isLoading } = useQuery<Review[] | null>({
    queryKey: ["reviews"],
    queryFn: async () => {
      return await getReviews();
    },
  });

  const reviewsArray = reviews || [];
  const isEmpty = !isLoading && reviewsArray.length === 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-blue-600" />
        <span className="text-lg">Loading AI reviews...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
        AI Code Review History
      </h1>
      <p className="text-gray-600 mb-8">
        See all automated pull request analyses performed by the AI Code
        Reviewer.
      </p>

      {/* List or Empty State */}
      {isEmpty ? (
        <Card className="shadow-lg p-12 bg-white border-dashed border-2 border-gray-300 flex flex-col items-center justify-center text-center">
          <XCircle className="h-10 w-10 text-red-500 mb-4" />
          <CardTitle className="text-xl font-semibold text-gray-800 mb-2">
            No Reviews Found
          </CardTitle>
          <CardDescription className="text-gray-600">
            The AI Reviewer hasn not completed any reviews yet. Push a new PR to
            a connected repository to get started!
          </CardDescription>
        </Card>
      ) : (
        <div className="space-y-6">
          {reviewsArray.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewPage;
