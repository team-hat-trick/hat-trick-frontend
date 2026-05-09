import { useQuery } from "@tanstack/react-query";
import { PlayerStatsDetail, type ApiResponse } from "../../../types/leagues";
import { leaguesService } from "../../../services/leaguesService";

export const useGetTopRedcards = (leagueId: number, season: number) => {
  return useQuery<ApiResponse<PlayerStatsDetail[]>>({
    queryKey: ["top-redcards", leagueId, season],
    queryFn: () => leaguesService.getTopRedcards(leagueId, season),
    enabled: !!leagueId && !!season,
    staleTime: 1000 * 60 * 5,
  });
};
