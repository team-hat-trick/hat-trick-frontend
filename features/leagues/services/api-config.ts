export const LEAGUES_API_ENDPOINTS = {
  leagues: {
    detail: (leagueId: number) => `/leagues?id=${leagueId}`,
    standings: (leagueId: number, season: number) =>
      `/standings?league=${leagueId}&season=${season}`,
    getRecord: (leagueId: number, season: number) =>
      `/fixtures?league=${leagueId}&season=${season}`,
    getCurrentRound: (leagueId: number, season: number, timezone: string) =>
      `/fixtures/rounds?league=${leagueId}&season=${season}&current=true&timezone=${timezone}`,
  },
  players: {
    getTopScorers: (leagueId: number, season: number) =>
      `/players/topscorers?league=${leagueId}&season=${season}`,
    getTopAssists: (leagueId: number, season: number) =>
      `/players/topassists?league=${leagueId}&season=${season}`,
  },
} as const;
