export const DASHBOARD_API_ENDPOINTS = {
  matches: {
    list: `/v4/matches`,
    byLeague: (code: string) => `/v4/competitions/${code}/matches`,
    detail: (id: number) => `/v4/matches/${id}`,
  },
  sideBar: {
    record: (teamId: number) => `/v4/teams/${teamId}/matches?limit=5&status=FINISHED`,
    nextMatch: (teamId: number) => `/v4/teams/${teamId}/matches/limit=1&status=SCHEDULED`,
    standings: (code: string) => `/v4/competitions/${code}/standings`
  }
} as const;
