"use client";

import { useQuery } from "@tanstack/react-query";
import { ActivityCalendar } from "react-activity-calendar";
import { getUserContributionStats } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function ContributionGraph() {
  const [graphHeight, setGraphHeight] = useState(200);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["contribution-graph"],
    queryFn: async () => {
      return await getUserContributionStats();
    },
    staleTime: 1000 * 60 * 5,
  });

  // Adjust graph height based on container width to maintain aspect ratio
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        // Maintain a good aspect ratio for the graph
        const height = Math.min(Math.max(width * 0.4, 120), 200);
        setGraphHeight(height);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

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
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold flex items-center">
            <Zap className="w-5 h-5 mr-2 text-blue-600" /> Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center text-gray-500">
          No contribution data available.
        </CardContent>
      </Card>
    );
  }

  return (
    <div ref={containerRef} className="w-full">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold flex items-center">
            <Zap className="w-5 h-5 mr-2 text-blue-600" /> Activity
          </CardTitle>
        </CardHeader>
        <CardContent
          className="flex justify-center items-center p-4"
          style={{ minHeight: `${graphHeight}px` }}
        >
          <div className="w-full overflow-x-auto">
            <div className="flex justify-center min-w-max">
              <ActivityCalendar
                data={data.contributions}
                colorScheme="light"
                blockSize={14} 
                blockMargin={5} 
                fontSize={14}
                showWeekdayLabels
                showMonthLabels
                theme={{
                  light: ["hsl(0, 0%, 92%)", "hsl(142, 71%, 45%)"],
                }}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ContributionGraph;
