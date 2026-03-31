import { apiClient } from "@/lib/api";
import type { ApiResponse, FixtureList, StandingsData } from "../types/dashboard";
import { DASHBOARD_API_ENDPOINTS } from "./api-config";

export const dashboardService = {
  getFixtures: async (
    date: string,
    timezone: string,
  ): Promise<ApiResponse<FixtureList[]>> => {
    const response = await apiClient.get(
      `${DASHBOARD_API_ENDPOINTS.matches.list(date, timezone)}`,
    );

    return response.data;
  },

  getRecord: async (teamId: number): Promise<ApiResponse<FixtureList[]>> => {
    const response = await apiClient.get(
      `${DASHBOARD_API_ENDPOINTS.sideBar.record(teamId)}`,
    );

    return response.data;
  },

  getStandings: async (leagueId: number, season: number): Promise<ApiResponse<StandingsData[]>> => {
    const response = await apiClient.get(
      DASHBOARD_API_ENDPOINTS.sideBar.standings(leagueId, season),
    );

    return response.data;
  },
};
