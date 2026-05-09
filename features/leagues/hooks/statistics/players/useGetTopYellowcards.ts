import { useQuery } from "@tanstack/react-query";
import { PlayerStatsDetail, type ApiResponse } from "../../../types/leagues";
import { leaguesService } from "../../../services/leaguesService";

export const useGetTopYellowcards = (leagueId: number, season: number) => {
  return useQuery<ApiResponse<PlayerStatsDetail[]>>({
    queryKey: ["top-yellowcards", leagueId, season],
    queryFn: () => leaguesService.getTopYellowcards(leagueId, season),
    enabled: !!leagueId && !!season,
    staleTime: 1000 * 60 * 5,
  });
};
