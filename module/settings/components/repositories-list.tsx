/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  getConnectedRepositories,
  disconnectRepository,
  dissconnectAllRepository,
} from "../actions";
import { toast } from "sonner";
import { ExternalLink, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

// 🟢 UPDATED: Interface to strictly match the Prisma select statement in getConnectedRepositories
interface Repository {
  id: string;
  name: string; // The repository name (e.g., "ai-reviewer")
  fullName: string; // The owner/repo name (e.g., "user/ai-reviewer")
  url: string; // The direct URL (Prisma field)
  // description and language are NOT available from the current server action select
}

// --- Component to render a single Repository Card ---
interface RepoCardProps {
  repo: Repository;
  disconnectMutation: UseMutationResult<MutationResult, Error, string, unknown>;
  isDisconnecting: boolean;
}

type MutationResult = { success: boolean; error?: string };

const RepoCard: React.FC<RepoCardProps> = ({
  repo,
  disconnectMutation,
  isDisconnecting,
}) => {
  const isThisRepoDisconnecting =
    isDisconnecting && disconnectMutation.variables === repo.id;

  return (
    <Card className="flex flex-col p-5 shadow-lg border-2 border-blue-100 transition-all duration-300 hover:shadow-xl hover:border-blue-300">
      {/* Header and Link */}
      <CardHeader className="p-0 mb-3 space-y-1">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 truncate pr-4">
            {/* 🟢 FIX: Use repo.fullName */}
            {repo.fullName}
          </CardTitle>
          <a
            // 🟢 FIX: Use repo.url
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 transition-colors flex-shrink-0"
            title="View on GitHub"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
        <CardDescription className="text-sm text-gray-500 line-clamp-2">
          {/* Default description since actual description is not fetched */}
          AI Reviewer is active on this repository.
        </CardDescription>
      </CardHeader>

      {/* Language Badge and Disconnect Button */}
      <CardContent className="p-0 mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
        {/* Language Badge (Removed as language is not fetched, use a simple status badge) */}
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-700 font-medium"
        >
          Active
        </Badge>

        {/* Individual Disconnect Dialog */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="bg-red-500 hover:bg-red-600 ml-auto"
              disabled={isThisRepoDisconnecting}
            >
              {isThisRepoDisconnecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center text-red-600">
                <AlertTriangle className="h-6 w-6 mr-2" />
                Confirm Disconnection
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to stop the AI Code Reviewer from
                monitoring **{repo.fullName}**? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => disconnectMutation.mutate(repo.id)}
                disabled={isThisRepoDisconnecting}
                className="bg-red-500 hover:bg-red-600"
              >
                {isThisRepoDisconnecting ? "Disconnecting..." : "Disconnect"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

// --- Main Repository List Component ---
function RepositoryList() {
  const queryClient = useQueryClient();
  const [disconnectAllOpen, setDisconnectAllOpen] = useState(false);

  // 🟢 FIX: Define the expected return type
  const { data: repositories, isLoading } = useQuery<Repository[] | null>({
    queryKey: ["connected-repositories"],
    queryFn: async () => await getConnectedRepositories(),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  // --- Mutations ---

  const disconnectMutation = useMutation({
    mutationFn: async (repositoryId: string) => {
      // Assuming disconnectRepository returns { success: boolean, error?: string }
      return await disconnectRepository(repositoryId);
    },
    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({ queryKey: ["connected-repositories"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        toast.success("Repository disconnected successfully");
      } else {
        toast.error(result?.error || "Failed to disconnect repository.");
      }
    },
  });

  const disconnectAllMutation = useMutation({
    mutationFn: async () => {
      // Assuming dissconnectAllRepository returns { success: boolean, result?: any, error?: string }
      return await dissconnectAllRepository();
    },
    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({ queryKey: ["connected-repositories"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        toast.success(`All repositories disconnected successfully.`);
        setDisconnectAllOpen(false);
      } else {
        toast.error(result?.error || "Failed to disconnect all repositories.");
      }
    },
  });

  const repoArray = repositories || [];
  const isEmpty = !isLoading && repoArray.length === 0;

  // --- Render Logic ---

  if (isLoading) {
    return (
      <Card className="shadow-lg p-6 flex justify-center items-center h-64">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-blue-600" />
        <span className="text-lg text-gray-500">
          Loading connected repositories...
        </span>
      </Card>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 bg-white min-h-[500px]">
      {/* Page Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Connected Repositories
          </h1>
          <p className="text-gray-500 mt-1">
            These repositories are actively being monitored by the AI Code
            Reviewer.
          </p>
        </div>

        {/* Disconnect All Button/Dialog */}
        {!isEmpty && (
          <AlertDialog
            open={disconnectAllOpen}
            onOpenChange={setDisconnectAllOpen}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="bg-red-500 hover:bg-red-600"
                disabled={disconnectAllMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Disconnect All (
                {repoArray.length})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center text-red-600">
                  <AlertTriangle className="h-6 w-6 mr-2" />
                  ARE YOU ABSOLUTELY SURE?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will **permanently disconnect** the AI Reviewer from all
                  **{repoArray.length}** connected repositories. All active
                  webhooks will be removed. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={disconnectAllMutation.isPending}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => disconnectAllMutation.mutate()}
                  disabled={disconnectAllMutation.isPending}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {disconnectAllMutation.isPending
                    ? "Processing..."
                    : "Disconnect All"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Repository Grid or Empty State */}
      {isEmpty ? (
        <Card className="shadow-lg p-12 bg-gray-50 border-dashed border-2 border-gray-300 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="h-10 w-10 text-yellow-500 mb-4" />
          <CardTitle className="text-xl font-semibold text-gray-800 mb-2">
            No Repositories Connected
          </CardTitle>
          <CardDescription className="text-gray-600 mb-4">
            Visit the Repositories page to connect new projects and enable AI
            code reviews.
          </CardDescription>
          <Button className="bg-blue-600 hover:bg-blue-700 mt-4">
            Connect Repositories Now
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {repoArray.map((repo) => (
            <RepoCard
              key={repo.id}
              repo={repo}
              disconnectMutation={disconnectMutation}
              isDisconnecting={disconnectMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Note for the user */}
      <p className="pt-6 text-sm text-gray-400 border-t border-gray-100 mt-10">
        * Disconnecting a repository removes the associated webhook and stops
        all future AI review activity.
      </p>
    </div>
  );
}

export default RepositoryList;
