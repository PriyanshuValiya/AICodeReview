"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  GitCommit,
  GitPullRequest,
  GitBranch,
  MessageSquare,
  Loader2,
  Clock10,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getMonthlyActivity,
} from "@/module/dashboard/actions";
import ContributionGraph from "@/module/dashboard/components/contribution-graph";
import type {
  DashboardStats,
  MonthlyActivity,
  StatCardProps,
} from "@/types/dashboard/types";
import { useSession } from "@/lib/auth-client";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good Morning";
  }
  if (hour < 18) {
    return "Good Afternoon";
  }
  return "Good Evening";
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor,
}) => (
  <Card className="shadow-md transition-all duration-300 hover:shadow-lg hover:border-blue-200">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-md font-medium text-gray-500">
        {title}
      </CardTitle>
      <Icon className={`h-4 w-4 ${iconColor}`} />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-gray-800">
        {value.toLocaleString()}
      </div>
    </CardContent>
  </Card>
);

function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const { data: stats, isLoading: isLoadingStats } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => getDashboardStats(),
    refetchOnWindowFocus: false,
  });

  const { data: monthlyActivity, isLoading: isLoadingActivity } = useQuery<
    MonthlyActivity[]
  >({
    queryKey: ["monthly-activity"],
    queryFn: async () => getMonthlyActivity(),
    refetchOnWindowFocus: false,
  });

  const loadingState = (
    <div className="min-h-[300px] flex items-center justify-center">
      <Loader2 className="mr-2 h-6 w-6 animate-spin text-blue-600" />
      <span className="text-lg text-gray-500">Loading Dashboard Data...</span>
    </div>
  );

  if (isLoadingStats) {
    return loadingState;
  }

  const dashboardStats = stats || {
    totalCommits: 0,
    totalPRs: 0,
    totalReviews: 0,
    totalRepos: 0,
  };
  const chartData = monthlyActivity || [];

  return (
    <div className="px-2 sm:px-6 lg:px-8 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {getGreeting()}, {user?.name || ""}
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Commits"
          value={dashboardStats.totalCommits}
          icon={GitCommit}
          iconColor="text-green-500"
        />
        <StatCard
          title="Pull Requests"
          value={dashboardStats.totalPRs}
          icon={GitPullRequest}
          iconColor="text-blue-500"
        />
        <StatCard
          title="AI Reviews Given"
          value={dashboardStats.totalReviews}
          icon={MessageSquare}
          iconColor="text-indigo-500"
        />
        <StatCard
          title="Monitored Repos"
          value={dashboardStats.totalRepos}
          icon={GitBranch}
          iconColor="text-yellow-500"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-12">
          <ContributionGraph />
        </div>

        <div className="lg:col-span-12">
          <Card className="shadow-lg transition-all duration-300 hover:shadow-xl p-4 sm:p-6 bg-white">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-xl font-semibold flex items-center">
                <Clock10 className="w-5 h-5 mr-2 text-blue-600" /> Last 6 Months Activities
              </CardTitle>
              <CardDescription>
                A breakdown of your coding and reviewing activity.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[300px]">
              {isLoadingActivity ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
                  Activity Chart...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      cursor={{ fill: "#f3f4f6" }}
                      contentStyle={{
                        borderRadius: "0.5rem",
                        border: "1px solid #e5e7eb",
                        fontSize: "14px",
                      }}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ paddingTop: "10px" }}
                    />

                    <Bar
                      dataKey="reviews"
                      fill="#3b82f6"
                      name="AI Reviews"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="commits"
                      fill="#10b981"
                      name="Commits"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="prs"
                      fill="#8b5cf6"
                      name="Pull Requests"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
