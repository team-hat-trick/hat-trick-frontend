import { useQueries } from "@tanstack/react-query";
import type { ApiResopnse, MatchData } from "../types/dashboard";
import { dashboardService } from "../services/dashboardService";

export const useGetRecord = (teamIds: number[]) => {
  return useQueries<ApiResopnse[]>({
    queries: teamIds.map((id) => ({
      queryKey: ["record", id],
      queryFn: () => dashboardService.getRecord(id),
      staleTime: 1000 * 60 * 5,
    })),
  });
};
