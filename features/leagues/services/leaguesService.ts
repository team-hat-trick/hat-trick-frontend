import { apiClient } from "@/lib/api";
import {
  ApiResponse,
  LeagueDetail,
  PlayerStatsDetail,
  TeamsByLeagueData,
} from "../types/leagues";
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
      LEAGUES_API_ENDPOINTS.leagues.record(leagueId, season),
    );

    return response.data;
  },

  getCurrentRound: async (
    leagueId: number,
    season: number,
    timezone: string,
  ): Promise<ApiResponse<string[]>> => {
    const response = await apiClient.get(
      LEAGUES_API_ENDPOINTS.leagues.currentRound(leagueId, season, timezone),
    );

    return response.data;
  },

  getTopScorers: async (
    leagueId: number,
    season: number,
  ): Promise<ApiResponse<PlayerStatsDetail[]>> => {
    const response = await apiClient.get(
      LEAGUES_API_ENDPOINTS.players.topScorers(leagueId, season),
    );

    return response.data;
  },

  getTopAssists: async (
    leagueId: number,
    season: number,
  ): Promise<ApiResponse<PlayerStatsDetail[]>> => {
    const response = await apiClient.get(
      LEAGUES_API_ENDPOINTS.players.topAssists(leagueId, season),
    );

    return response.data;
  },

  getTeamsByLeague: async (
    leagueId: number,
    season: number,
  ): Promise<ApiResponse<TeamsByLeagueData[]>> => {
    const response = await apiClient.get(
      LEAGUES_API_ENDPOINTS.teams.teamsByLeague(leagueId, season),
    );

    return response.data;
  },

  getTopYellowcards: async (
    leagueId: number,
    season: number,
  ): Promise<ApiResponse<PlayerStatsDetail[]>> => {
    const response = await apiClient.get(
      LEAGUES_API_ENDPOINTS.players.topYellowcards(leagueId, season),
    );

    return response.data;
  },

  getTopRedcards: async (
    leagueId: number,
    season: number,
  ): Promise<ApiResponse<PlayerStatsDetail[]>> => {
    const response = await apiClient.get(
      LEAGUES_API_ENDPOINTS.players.topRedcards(leagueId, season),
    );

    return response.data;
  },
};
