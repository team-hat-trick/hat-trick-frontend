export interface League {
    id: number;
    name: string;
    type: string;
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
};

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