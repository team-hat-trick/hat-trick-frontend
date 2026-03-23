import { useQueries } from "@tanstack/react-query";
import type { ApiResopnse } from "../types/dashboard";
import { dashboardService } from "../services/dashboardService";

export const useGetStandings = (codes: string[]) => {
  return useQueries<ApiResopnse[]>({
    queries: codes.map((code) => ({
      queryKey: ["standings", code],
      queryFn: () => dashboardService.getStandings(code),
      staleTime: 1000 * 60 * 5,
    })),
  });
};
