import { useQuery } from "@tanstack/react-query";
import type { ApiResponse, PlayerStatsDetail } from "../types/leagues";
import { leaguesService } from "../services/leaguesService";

export const useGetTopScorers = (leagueId: number, season: number) => {
  return useQuery<ApiResponse<PlayerStatsDetail[]>>({
    queryKey: ["top-scorers", leagueId, season],
    queryFn: () => leaguesService.getTopScorers(leagueId, season),
    enabled: !!leagueId && !!season,
    staleTime: 1000 * 60 * 60 * 24,
  });
};
