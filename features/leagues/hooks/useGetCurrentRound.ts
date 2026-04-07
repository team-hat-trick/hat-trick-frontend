import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "../types/leagues";
import { leaguesService } from "../services/leaguesService";

export const useGetCurrentRound = (leagueId: number, season: number, timezone: string) => {
  return useQuery<ApiResponse<string[]>>({
    queryKey: ["current-round", leagueId, season, timezone],
    queryFn: () => leaguesService.getCurrentRound(leagueId, season, timezone),
    enabled: !!leagueId && !!season,
    staleTime: 1000 * 60 * 5,
  });
}