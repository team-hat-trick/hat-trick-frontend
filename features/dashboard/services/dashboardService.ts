import { apiClient } from "@/lib/api";
import type { ApiResopnse, MatchData } from "../types/dashboard";
import { DASHBOARD_API_ENDPOINTS } from "./api-config";

export const dashboardService = {
  getMatches: async (
    startDate: string,
    endDate: string,
    codes: string,
  ): Promise<ApiResopnse> => {
    const response = await apiClient.get(
      `${DASHBOARD_API_ENDPOINTS.matches.list}?dateFrom=${startDate}&dateTo=${endDate}&competitions=${codes}`,
    );

    return response.data;
  },

  getMatchesByLeague: async (
    code: string,
    startDate: string,
    endDate: string,
  ): Promise<ApiResopnse> => {
    const response = await apiClient.get(
      `${DASHBOARD_API_ENDPOINTS.matches.byLeague(code)}?dateFrom=${startDate}&dateTo=${endDate}`,
    );

    return response.data;
  },

  getMatchDetail: async (id: number): Promise<MatchData> => {
    const response = await apiClient.get(
      `${DASHBOARD_API_ENDPOINTS.matches.detail(id)}`,
    );

    return response.data;
  },

  getRecord: async (teamId: number): Promise<ApiResopnse> => {
    const response = await apiClient.get(
      `${DASHBOARD_API_ENDPOINTS.sideBar.record(teamId)}`,
    );

    return response.data;
  },

  getNextMatch: async (teamId: number): Promise<ApiResopnse> => {
    const response = await apiClient.get(
      `${DASHBOARD_API_ENDPOINTS.sideBar.nextMatch(teamId)}`,
    );

    return response.data;
  },

  getStandings: async (leagueCode: string): Promise<ApiResopnse> => {
    const response = await apiClient.get(
      DASHBOARD_API_ENDPOINTS.sideBar.standings(leagueCode),
    );

    return response.data;
  },
};
