import { useQuery } from "@tanstack/react-query";
import { FixtureList, type ApiResponse } from "../types/dashboard";
import { dashboardService } from "../services/dashboardService";

export const useGetHeadToHead = (
  h2h: string,
  leagueId: number,
  season: number,
  timezone?: string,
  enabled: boolean = true,
) => {
  return useQuery<ApiResponse<FixtureList[]>>({
    queryKey: [
      "head-to-head",
      h2h,
      leagueId,
      season,
      timezone ? timezone : null,
    ],
    queryFn: () =>
      dashboardService.getHeadToHead(h2h, leagueId, season, timezone),
    enabled: !!h2h && !!leagueId && !!season && enabled,
  });
};
