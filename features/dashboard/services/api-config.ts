export const DASHBOARD_API_ENDPOINTS = {
  matches: {
    list: (date: string, timezone: string) =>
      `/fixtures?date=${date}&timezone=${timezone}`,
    headToHead: (
      h2h: string,
      leagueId: number,
      season: number,
      timezone?: string,
    ) =>
      `/fixtures/headtohead?h2h=${h2h}&league=${leagueId}&season=${season}${timezone ? `&timezone=${timezone}` : ""}`,
  },
  sideBar: {
    record: (teamId: number) => `/fixtures?team=${teamId}&last=5`,
    standings: (leagueId: number, season: number) =>
      `/standings?league=${leagueId}&season=${season}`,
  },
} as const;
