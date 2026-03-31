export interface Parameters {
  id: number;
  ids: string; // ex: "id-id-id"
  live: string; // ex: "all" / "id-id"
  date: string;
  league: number;
  season: string;
  team: number;
  last: number;
  from: string;
  to: string;
  round: string;
  status: string;
  venue: number;
  timezone: string;
}

export interface Paging {
  current: number;
  total: number;
}

export interface Venue {
  id: number | null;
  name: string | null;
  city: string | null;
}

export interface Status {
  long:
    | "Time To Be Defined"
    | "Not Started"
    | "First Half, Kick Off"
    | "Halftime"
    | "Second Half, 2nd Half Started"
    | "Extra Time"
    | "Break Time"
    | "Penalty In Progress"
    | "Match Suspended"
    | "Match Interrupted"
    | "Match Finished"
    | "Match Postponed"
    | "Match Cancelled"
    | "Match Abandoned"
    | "Technical Loss"
    | "WalkOver"
    | "In Progress";
  short:
    | "TBD"
    | "NS"
    | "1H"
    | "HT"
    | "2H"
    | "ET"
    | "BT"
    | "P"
    | "SUSP"
    | "INT"
    | "FT"
    | "AET"
    | "PEN"
    | "PST"
    | "CANC"
    | "ABD"
    | "AWD"
    | "WO"
    | "LIVE";
  elapsed: number | null;
  extra: number | null;
}

export interface Fixture {
  id: number;
  referee: string | null;
  timezone: string;
  date: string;
  timestamp: number;
  periods: {
    first: number;
    second: number;
  };
  venue: Venue;
  status: Status;
}

export interface League {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    round: string;
    standings: boolean | null | Standings[][];
}

export interface HomeAwayTeam {
    id: number;
    name: string;
    logo: string;
    winner: boolean | null;
}

export interface Teams {
    home: HomeAwayTeam;
    away: HomeAwayTeam;
}

export interface Goals {
    home: number | null;
    away: number | null;
}

export interface Score {
    halftime: Goals;
    fulltime: Goals;
    extratime: Goals | null;
    penalty: Goals | null;
}

export interface FixtureList {
  fixture: Fixture;
  league: League;
  teams: Teams;
  goals: Goals;
  score: Score;
}

export interface StandingsData {
  league: League;
}

export interface StandingsAll {
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals: {
    for: number;
    against: number;
  }
}

export interface Standings {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  group: string;
  form: string;
  description: string | null;
  all: StandingsAll;
  home: StandingsAll;
  away: StandingsAll;
  update: string;
}

export interface ApiResponse<T> {
  get: string;
  parameters: Parameters;
  errors: any;
  results: number;
  paing: Paging;
  response: T;
}
