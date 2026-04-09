import type { ApiResponse, PlayerStatsDetail } from "../types/leagues";
import { useQuery } from "@tanstack/react-query";
import { leaguesService } from "../services/leaguesService";

export const useGetTopAssists = (leagueId: number, season: number) => {
  return useQuery<ApiResponse<PlayerStatsDetail[]>>({
    queryKey: ["top-assists", leagueId, season],
    queryFn: () => leaguesService.getTopAssists(leagueId, season),
    enabled: !!leagueId && !!season,
    staleTime: 1000 * 60 * 60 * 24,
  });
};