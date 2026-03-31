import { useQueries } from "@tanstack/react-query";
import type { ApiResponse, StandingsData } from "../types/dashboard";
import { dashboardService } from "../services/dashboardService";

export const useGetStandings = (leagueIds: number[], defaultSeason: number) => {
  return useQueries<ApiResponse<StandingsData>[]>({
    queries: leagueIds.map((leagueId) => {
      const targetSeason = leagueId === 292 ? 2026 : defaultSeason;
      return {
        queryKey: ["standings", leagueId, targetSeason],
        queryFn: () => dashboardService.getStandings(leagueId, targetSeason),
        staleTime: 1000 * 60 * 5,
      };
    }),
  });
};
