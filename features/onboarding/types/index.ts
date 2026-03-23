export interface Competition {
    id: number;
    name: string;
    emblem_url: string;
    code: string;
    created_at: string;
    country: string;
};

export interface Team {
    id: number;
    name: string;
    short_name: string;
    tla: string;
    logo_url: string;
    address: string;
    website: string;
    club_colors: string;
    founded: number;
    venue: string;
    league_id: number;
    last_updated: string;
};

export interface FollowedTeam {
    user_id: string;
    team_id: number;
    created_at: string;
}

export interface Player {
    id: number;
    name: string;
    position: string;
    date_of_birth: string;
    nationality: string;
    team_id: number;
    created_at: string;
}

export interface FollowedPlayer {
    user_id: string;
    player_id: number;
    created_at: string;
}