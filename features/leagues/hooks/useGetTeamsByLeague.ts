import { useQuery } from "@tanstack/react-query";
import { TeamsByLeagueData, type ApiResponse } from "../types/leagues";
import { leaguesService } from "../services/leaguesService";

export const useGetTeamsByLeague = (leagueId: number, season: number) => {
  return useQuery<ApiResponse<TeamsByLeagueData[]>>({
    queryKey: ["teams-by-league", leagueId, season],
    queryFn: () => leaguesService.getTeamsByLeague(leagueId, season),
    enabled: !!leagueId && !!season,
    staleTime: 1000 * 60 * 5,
  });
};
