import { useQuery } from "@tanstack/react-query";
import type { ApiResopnse, MatchData } from "../types/dashboard";
import { dashboardService } from "../services/dashboardService";

export const useGetMatches = (
  startDate: string,
  endDate: string,
  codes: string,
) => {
  return useQuery<ApiResopnse>({
    queryKey: ["matches", startDate, endDate, codes],
    queryFn: () =>
      dashboardService.getMatches(startDate, endDate, codes),
  });
};
