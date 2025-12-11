"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Star, Search, Loader2, Zap } from "lucide-react";
import { useState, useRef, useCallback } from "react"; // Added useCallback
import { useRepositories } from "@/module/repository/hooks/use-repositories";
import { useConnectRepository } from "@/module/repository/hooks/use-connect-repository";

// Re-defining the Repository interface for clarity
interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics?: string[];
  isConnected: boolean; // Indicates if the AI Code Reviewer is monitoring it
}

// --- Component to render a single Repository Card ---
interface RepositoryCardProps {
  repo: Repository;
  onRegister: (repo: Repository) => void;
  connectingId: number | null;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repo,
  onRegister,
  connectingId,
}) => {
  // Determine if the current repo is in the process of being connected
  const isConnecting = connectingId === repo.id;

  return (
    <Card
      className={`
                flex flex-col justify-between p-5 transition-all duration-300 border 
                ${
                  repo.isConnected
                    ? "border-blue-400 shadow-md"
                    : "hover:shadow-lg hover:border-gray-200"
                }
            `}
    >
      {/* Header and Link */}
      <CardHeader className="p-0 mb-3 space-y-1">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold text-gray-900 truncate pr-4">
            {repo.name}
          </CardTitle>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            <ExternalLink className="w-5 h-5 flex-shrink-0" />
          </a>
        </div>
        <CardDescription className="text-sm text-gray-500 line-clamp-2">
          {repo.description || ""}
        </CardDescription>
      </CardHeader>

      {/* Stats and Tags */}
      <CardContent className="p-0 mb-4 space-y-2">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          {/* Language Badge */}
          {repo.language && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
              {repo.language}
            </Badge>
          )}
          {/* Stars */}
          <span className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
            {repo.stargazers_count.toLocaleString()}
          </span>
        </div>

        {/* Topics (if available) */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {repo.topics.slice(0, 3).map((topic, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs text-blue-600 border-blue-100 bg-blue-50"
              >
                {topic}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      {/* Action Button */}
      <div className="pt-3 border-t border-gray-100">
        <Button
          onClick={() => onRegister(repo)}
          disabled={repo.isConnected || isConnecting}
          className={`w-full font-semibold transition-colors duration-200 ${
            repo.isConnected
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : repo.isConnected ? (
            "Connected (AI Reviewing)"
          ) : (
            "Connect to AI Reviewer"
          )}
        </Button>
      </div>
    </Card>
  );
};

// --- Main Repository Page Component ---
function RepositoryPage() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRepositories();

  const { mutate: connectRepo } = useConnectRepository();

  const [searchQuery, setSearchQuery] = useState("");
  // Local state to manage the temporary loading state of the connecting button
  const [localConnectingId, setLocalConnectingId] = useState<number | null>(
    null
  );

  // Flatten all pages into a single array
  const allRepositories: Repository[] =
    data?.pages.flatMap((page) => page) || [];

  // Filter the repositories based on search query
  const filteredRepositories = allRepositories.filter(
    (repo: Repository) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Use a ref to track the observer element for infinite scrolling (optional, but good practice)
  const observerRef = useRef<HTMLDivElement | null>(null);

  const handleRegister = async (repo: Repository) => {
    setLocalConnectingId(repo.id);
    connectRepo(
      {
        owner: repo.full_name.split("/")[0],
        repo: repo.name,
        githubId: repo.id,
      },
      {
        onSettled: () => {
          setLocalConnectingId(null);
        },
      }
    );
  };

  // --- UI Rendering ---

  // Loading State
  if (isLoading && allRepositories.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-blue-600" />
        <span className="text-lg">Loading repositories...</span>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <Card className="shadow-xl p-6 bg-red-50 border-red-300">
        <h2 className="text-xl font-bold text-red-700">
          Error Loading Repositories
        </h2>
        <p className="text-red-600">
          Failed to fetch data from GitHub. Please try again later or check your
          connection/permissions.
        </p>
      </Card>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white min-h-screen">
      {/* Header and Search */}
      <div className="space-y-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              <Zap className="inline w-6 h-6 mr-2 text-blue-600" />
              Connect Repositories
            </h1>
            <p className="text-gray-500 mt-1">
              Select repositories you want the AI Code Reviewer to monitor.
            </p>
          </div>
          {/* Optional: Add a button to sync/refresh repos from GitHub */}
          <Button
            variant="outline"
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            Sync GitHub Repos
          </Button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder={`Search ${allRepositories.length} repositories...`}
            className="pl-10 pr-4 py-6 text-base rounded-xl shadow-inner border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Repository Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredRepositories.length > 0 ? (
          filteredRepositories.map((repo) => (
            <RepositoryCard
              key={repo.id}
              repo={repo}
              onRegister={handleRegister}
              connectingId={localConnectingId}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-16 text-gray-500">
            {searchQuery
              ? `No repositories match "${searchQuery}".`
              : "No repositories found. Ensure your GitHub account is linked correctly."}
          </div>
        )}
      </div>

      {/* Infinite Scroll / Load More Button */}
      <div className="mt-10 text-center">
        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading More...
              </>
            ) : (
              "Load More Repositories"
            )}
          </Button>
        )}

        {!hasNextPage && allRepositories.length > 0 && (
          <p className="text-sm text-gray-500 mt-4">
            You have reached the end of your repository list.
          </p>
        )}
      </div>
    </div>
  );
}

export default RepositoryPage;
