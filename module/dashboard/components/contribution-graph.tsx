"use client";

import { useQuery } from "@tanstack/react-query";
import { ActivityCalendar } from "react-activity-calendar";
import { getUserContributionStats } from "../actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Zap } from "lucide-react";

// Define the expected data structure for the calendar
interface ContributionData {
  date: string;
  count: number;
  level: number;
}

function ContributionGraph() {
  const { data, isLoading } = useQuery({
    queryKey: ["contribution-graph"],
    queryFn: async () => {
      return await getUserContributionStats();
    },
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold flex items-center">
            <Zap className="w-5 h-5 mr-2 text-blue-600" /> Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center text-gray-500">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading Activity
          Graph...
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.contributions.length) {
    return (
      <Card className="shadow-lg p-6 bg-white">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-xl font-semibold flex items-center">
            <Zap className="w-5 h-5 mr-2 text-blue-600" /> Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="text-center text-gray-500 py-10">
            No contribution data available.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-4 p-4">
      <div className="w-full overflow-x-auto">
        <div className="flex justify-center min-w-max px-4">
          <ActivityCalendar
            data={data.contributions}
            colorScheme="light"
            blockSize={11}
            blockMargin={4}
            fontSize={14}
            showWeekdayLabels
            showMonthLabels
            theme={{
              light: ["hsl(0, 0%, 92%)", "hsl(142, 71%, 45%)"],
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ContributionGraph;
