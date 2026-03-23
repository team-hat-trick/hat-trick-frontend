export interface Area {
    id: number;
    name: string;
    code: string;
    flag: number;
};

export interface Competition {
    id: number;
    name: string;
    code: string;
    type: string;
    emblem: string;
};

export interface Season {
    id: number;
    startDate: string;
    endDate: string;
    currentMatchday: number;
    winner: string | null;
};

export interface HomeAwayTeam {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
};

export interface Score {
    winner: "HOME_TEAM" | "DRAW" | "AWAY_TEAM";
    duration: string;
    fullTime: {
        home: number;
        away: number;
    }
    halfTime: {
        home: number;
        away: number;
    };
}

export interface Referee {
    id: number;
    name: string;
    type: string;
    nationality: string;
}

export interface MatchData {
    area: Area;
    competition: Competition;
    season: Season;
    id: number;
    utcDate: string;
    status: "SCHEDULED" | "LIVE" | "IN_PLAY" | "PAUSED" | "FINISHED" | "POSTPONED" | "CANCELLED" | "SUSPENDED";
    matchday: number;
    stage: string;
    group: null;
    lastUpdated: string;
    homeTeam: HomeAwayTeam;
    awayTeam: HomeAwayTeam;
    score: Score;
    odds: {
        msg: string;
    }
    referees: Referee[];
};

export interface Table {
    position: number;
    team: HomeAwayTeam;
    playedGames: number;
    form: null;
    won: number;
    draw: number;
    lost: number;
    points: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
}

export interface Standings {
    stage: string;
    type: string;
    group: string | null;
    table: Table[];
}

export interface ApiResopnse {
    filters: {
        season: string;
    };
    resultSet: {
        count: number;
        competitions: string;
        first: string;
        last: string;
        played: number;
        wins: number;
        draw: number;
        losses: number;
    };
    competition: Competition;
    matches?: MatchData[];
    standings?: Standings[];
}