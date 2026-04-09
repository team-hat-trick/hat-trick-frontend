import { apiClient } from "@/lib/api";
import { ApiResponse, LeagueDetail, PlayerStatsDetail } from "../types/leagues";
import { LEAGUES_API_ENDPOINTS } from "./api-config";
import {
  FixtureList,
  StandingsData,
} from "@/features/dashboard/types/dashboard";

export const leaguesService = {
  getDetail: async (leagueId: number): Promise<ApiResponse<LeagueDetail[]>> => {
    const response = await apiClient.get(
      LEAGUES_API_ENDPOINTS.leagues.detail(leagueId),
    );

    return response.data;
  },

  getStandings: async (
    leagueId: number,
    season: number,
  ): Promise<ApiResponse<StandingsData[]>> => {
    const response = await apiClient.get(
      LEAGUES_API_ENDPOINTS.leagues.standings(leagueId, season),
    );

    return response.data;
  },

  getRecord: async (
    leagueId: number,
    season: number,
  ): Promise<ApiResponse<FixtureList[]>> => {
    const response = await apiClient.get(
      LEAGUES_API_ENDPOINTS.leagues.getRecord(leagueId, season),
    );

    return response.data;
  },

  getCurrentRound: async (
    leagueId: number,
    season: number,
    timezone: string,
  ): Promise<ApiResponse<string[]>> => {
    const response = await apiClient.get(
      LEAGUES_API_ENDPOINTS.leagues.getCurrentRound(leagueId, season, timezone),
    );

    return response.data;
  },

  getTopScorers: async (
    leagueId: number,
    season: number,
  ): Promise<ApiResponse<PlayerStatsDetail[]>> => {
    const response = await apiClient.get(
      LEAGUES_API_ENDPOINTS.players.getTopScorers(leagueId, season),
    );

    return response.data;
  },

  getTopAssists: async (
    leagueId: number,
    season: number,
  ): Promise<ApiResponse<PlayerStatsDetail[]>> => {
    const response = await apiClient.get(
      LEAGUES_API_ENDPOINTS.players.getTopAssists(leagueId, season),
    );

    return response.data;
  },
};
