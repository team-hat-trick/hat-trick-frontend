export interface Competition {
    id: number;
    name: string;
    logo: string;
    country: string;
    is_core: boolean;
    code?: string;
    country_flag?: string;
};

export interface Team {
    id: number;
    name: string;
    code: string;
    logo: string;
    league_id: number | null;
    venue_name: string;
    short_name?: string;
};

export interface FollowedTeam {
    user_id: string;
    team_id: number;
    created_at: string;
}

export interface Player {
    id: number;
    name: string;
    age: number;
    number: number;
    photo: string | null;
    team_id: number;
    position?: string;
    team_name?: string;
    team_logo?: string;
}

export interface FollowedPlayer {
    user_id: string;
    player_id: number;
    created_at: string;
}