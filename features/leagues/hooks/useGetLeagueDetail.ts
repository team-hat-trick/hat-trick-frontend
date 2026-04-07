import { useQuery } from "@tanstack/react-query";
import { LeagueDetail, type ApiResponse } from "../types/leagues";
import { leaguesService } from "../services/leaguesService";

export const useGetLeagueDetail = (leagueId: number) => {
  return useQuery<ApiResponse<LeagueDetail[]>>({
    queryKey: ["league-detail", leagueId],
    queryFn: () => leaguesService.getDetail(leagueId),
    staleTime: 1000 * 60 * 5,
  });
};
