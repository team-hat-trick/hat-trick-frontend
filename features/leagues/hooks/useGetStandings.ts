import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "../types/leagues";
import { StandingsData } from "@/features/dashboard/types/dashboard";
import { leaguesService } from "../services/leaguesService";

export const useGetStandings = (leagueId: number, season: number) => {
  return useQuery<ApiResponse<StandingsData[]>>({
    queryKey: ["standings", leagueId, season],
    queryFn: () => leaguesService.getStandings(leagueId, season),
    enabled: !!leagueId && !!season,
    staleTime: 1000 * 60 * 5,
  });
};
