import { useQuery } from "@tanstack/react-query";
import type { ApiResponse, FixtureList } from "../types/dashboard";
import { dashboardService } from "../services/dashboardService";

export const useGetFixtures = (date: string, timezone: string, isToday: boolean) => {
  return useQuery<ApiResponse<FixtureList[]>>({
    queryKey: ["matches", date, timezone],
    queryFn: () => dashboardService.getFixtures(date, timezone),
    refetchInterval: isToday ? 60000 : false,
  });
};
