export const DASHBOARD_API_ENDPOINTS = {
  matches: {
    list: (date: string, timezone: string) =>
      `/fixtures?date=${date}&timezone=${timezone}`,
  },
  sideBar: {
    record: (teamId: number) => `/fixtures?team=${teamId}&last=5`,
    standings: (leagueId: number, season: number) =>
      `/standings?league=${leagueId}&season=${season}`,
  },
} as const;
