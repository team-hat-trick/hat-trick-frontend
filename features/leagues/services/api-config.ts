export const LEAGUES_API_ENDPOINTS = {
  leagues: {
    detail: (leagueId: number) => `/leagues?id=${leagueId}`,
    standings: (leagueId: number, season: number) =>
      `/standings?league=${leagueId}&season=${season}`,
    record: (leagueId: number, season: number) =>
      `/fixtures?league=${leagueId}&season=${season}`,
    currentRound: (leagueId: number, season: number, timezone: string) =>
      `/fixtures/rounds?league=${leagueId}&season=${season}&current=true&timezone=${timezone}`,
  },
  players: {
    topScorers: (leagueId: number, season: number) =>
      `/players/topscorers?league=${leagueId}&season=${season}`,
    topAssists: (leagueId: number, season: number) =>
      `/players/topassists?league=${leagueId}&season=${season}`,
    topYellowcards: (leagueId: number, season: number) =>
      `/players/topyellowcards?league=${leagueId}&season=${season}`,
    topRedcards: (leagueId: number, season: number) =>
      `/players/topredcards?league=${leagueId}&season=${season}`,
  },
  teams: {
    teamsByLeague: (leagueId: number, season: number) =>
      `/teams?league=${leagueId}&season=${season}`,
  },
} as const;
