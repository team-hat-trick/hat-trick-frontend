import { useQueries } from "@tanstack/react-query";
import type { ApiResopnse, MatchData } from "../types/dashboard";
import { dashboardService } from "../services/dashboardService";

export const useGetMatchesByLeague = (
  codes: string[],
  startDate: string,
  endDate: string,
) => {
  return useQueries<ApiResopnse[]>({
    queries: codes.map((code) => ({
      queryKey: ["matches", code, startDate, endDate],
      queryFn: () =>
        dashboardService.getMatchesByLeague(code, startDate, endDate),
      staleTime: 1000 * 60 * 5,
    })),
  });
};
