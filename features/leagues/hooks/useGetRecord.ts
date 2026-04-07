import { useQuery } from "@tanstack/react-query"
import type { ApiResponse } from "../types/leagues"
import { leaguesService } from "../services/leaguesService"
import { FixtureList } from "@/features/dashboard/types/dashboard"

export const useGetRecord = (leagueId: number, season: number) => {
    return useQuery<ApiResponse<FixtureList[]>>({
        queryKey: ["record", leagueId, season],
        queryFn: () => leaguesService.getRecord(leagueId, season),
        staleTime: 1000 * 60 * 5,
    })
}