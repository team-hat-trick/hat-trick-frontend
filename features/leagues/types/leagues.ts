export interface League {
  id: number;
  name: string;
  type: "League" | "Cup";
  logo: string;
}

export interface Country {
  name: string;
  code: string;
  flag: string;
}

export interface Coverage {
  fixtures: {
    events: boolean;
    lineups: boolean;
    statistics_fixtures: boolean;
    statistics_players: boolean;
  };
  standings: boolean;
  top_scorers: boolean;
  top_assists: boolean;
  top_cards: boolean;
  injuries: boolean;
  predictions: boolean;
  odds: boolean;
}

export interface Season {
  year: number;
  start: string;
  end: string;
  current: boolean;
  coverage: Coverage;
}

export interface LeagueDetail {
  league: League;
  country: Country;
  seasons: Season[];
}

export interface Player {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  age: number;
  birth: {
    date: string;
    place: string;
    country: string;
  };
  nationality: string;
  height: string;
  weight: string;
  injured: boolean;
  photo: string;
}

export interface PlayerStatistics {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
  };
  games: {
    appearances: number;
    lineups: number;
    minutes: number;
    number: number;
    position: string;
    rating: string;
    captain: boolean;
  };
  substitutes: {
    in: number;
    out: number;
    bench: number;
  };
  shots: {
    total: number;
    on: number;
  };
  goals: {
    total: number;
    conceded: number;
    assists: number;
    saves: null | number;
  };
  passes: {
    total: number;
    key: number;
    accuracy: number;
  };
  tackles: {
    total: number;
    blocks: number;
    interceptions: number;
  };
  duels: {
    total: number;
    won: number;
  };
  dribbles: {
    attempts: number;
    success: number;
    past: null | number;
  };
  fouls: {
    drawn: number;
    committed: number;
  };
  cards: {
    yellow: number;
    yellowred: number;
    red: number;
  };
  penalty: {
    won: number;
    commited: number | null;
    scored: 0;
    missed: number;
    saved: number | null;
  };
}

export interface PlayerStatsDetail {
  player: Player;
  statistics: PlayerStatistics[];
}

export interface Team {
  id: number;
  name: string;
  code: string;
  country: string;
  founded: number;
  national: boolean;
  logo: string;
}

export interface Venue {
  id: number;
  name: string;
  address: string;
  city: string;
  capacity: number;
  surface: string;
  image: string;
}

export interface TeamsByLeagueData {
  team: Team;
  venue: Venue;
}

export interface TeamStatsHomeAndAway {
  home: number | string;
  away: number | string;
  total: number | string;
}

export interface TeamStatsTotalAndPercentage {
  total: number | null;
  percentage: string | null;
}

export interface TeamStatsMinute {
  "0-15": TeamStatsTotalAndPercentage;
  "16-30": TeamStatsTotalAndPercentage;
  "31-45": TeamStatsTotalAndPercentage;
  "46-60": TeamStatsTotalAndPercentage;
  "61-75": TeamStatsTotalAndPercentage;
  "76-90": TeamStatsTotalAndPercentage;
  "91-105": TeamStatsTotalAndPercentage;
  "106-120": TeamStatsTotalAndPercentage;
}

export interface TeamStatsUnderOverData {
  over: number;
  under: number;
}

export interface TeamStatsUnderOver {
  "0.5": TeamStatsUnderOverData;
  "1.5": TeamStatsUnderOverData;
  "2.5": TeamStatsUnderOverData;
  "3.5": TeamStatsUnderOverData;
  "4.5": TeamStatsUnderOverData;
}

export interface TeamStatsLineup {
  formation: string;
  played: number;
}

export interface TeamStatistics {
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
  };
  team: Team;
  form: string | null;
  fixtures: {
    played: TeamStatsHomeAndAway;
    wins: TeamStatsHomeAndAway;
    draws: TeamStatsHomeAndAway;
    loses: TeamStatsHomeAndAway;
  };
  goals: {
    for: {
      total: TeamStatsHomeAndAway;
      average: TeamStatsHomeAndAway;
      minute: TeamStatsMinute;
      under_over: TeamStatsUnderOver;
    };
    against: {
      total: TeamStatsHomeAndAway;
      average: TeamStatsHomeAndAway;
      minute: TeamStatsMinute;
      under_over: TeamStatsUnderOver;
    };
  };
  biggest: {
    streak: {
      wins: number;
      draws: number;
      loses: number;
    };
    wins: {
      home: string;
      away: string;
    };
    loses: {
      home: string;
      away: string;
    };
    goals: {
      for: {
        home: number;
        away: number;
      };
      against: {
        home: number;
        away: number;
      };
    };
  };
  clean_sheet: TeamStatsHomeAndAway;
  failed_to_score: TeamStatsHomeAndAway;
  penalty: {
    scored: {
      total: number;
      percentage: string;
    };
    missed: {
      total: number;
      percentage: string;
    };
    total: number;
  };
  lineups: TeamStatsLineup | TeamStatsLineup[];
  cards: {
    yellow: TeamStatsMinute;
    red: TeamStatsMinute;
  };
}

export interface ApiResponse<T> {
  get: string;
  parameters: {
    id: number;
    league: number;
    season: number;
  };
  errors: any[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: T;
}
