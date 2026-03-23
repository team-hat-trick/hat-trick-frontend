// features/dashboard/constants/mockData.ts

export interface League {
  id: string;
  name: string;
  country: string;
  flagEmoji: string;
  logoUrl?: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logoUrl: string;
}

export type MatchStatus = "PRE_MATCH" | "LIVE" | "END";

export interface Match {
  id: string;
  leagueId: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore?: number;
  awayScore?: number;
  time: string; // "22:30"
  status: MatchStatus;
  liveMinute?: number; // e.g. 85 for "85' LIVE"
  broadcasters: { name: string; logoUrl?: string }[];
}

export interface FavoritePlayer {
  id: string;
  name: string;
  number: number;
  teamName: string;
  position: string;
  imageUrl: string;
  rating?: number;
}

// -------------------------------------------------------------
// MOCK DATA
// -------------------------------------------------------------

export const MOCK_LEAGUES: Record<string, League> = {
  PL: {
    id: "PL",
    name: "프리미어리그",
    country: "잉글랜드",
    flagEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  },
  PD: {
    id: "PD",
    name: "라리가",
    country: "스페인",
    flagEmoji: "🇪🇸",
  },
  CL: {
    id: "CL",
    name: "Champions League",
    country: "Europe",
    flagEmoji: "🇪🇺",
  },
};

export const MOCK_MATCHES: Match[] = [
  {
    id: "m_1",
    leagueId: "PL",
    homeTeam: {
      id: "t_tot",
      name: "토트넘",
      shortName: "TOT",
      logoUrl: "https://crests.football-data.org/73.svg", // Using some public svgs if available or let it fallback
    },
    awayTeam: {
      id: "t_ars",
      name: "아스날",
      shortName: "ARS",
      logoUrl: "https://crests.football-data.org/57.png",
    },
    homeScore: 2,
    awayScore: 1,
    time: "20:00",
    status: "END",
    broadcasters: [{ name: "SPOTV" }],
  },
  {
    id: "m_2",
    leagueId: "PL",
    homeTeam: {
      id: "t_mci",
      name: "맨시티",
      shortName: "MCI",
      logoUrl: "https://crests.football-data.org/65.png",
    },
    awayTeam: {
      id: "t_liv",
      name: "리버풀",
      shortName: "LIV",
      logoUrl: "https://crests.football-data.org/64.png",
    },
    time: "22:30",
    status: "PRE_MATCH",
    broadcasters: [{ name: "SPOTV NOW" }],
  },
  {
    id: "m_3",
    leagueId: "PD",
    homeTeam: {
      id: "t_rma",
      name: "Real Madrid",
      shortName: "RMA",
      logoUrl: "https://crests.football-data.org/86.png",
    },
    awayTeam: {
      id: "t_fcb",
      name: "Barcelona",
      shortName: "FCB",
      logoUrl: "https://crests.football-data.org/81.svg",
    },
    homeScore: 3,
    awayScore: 3,
    time: "04:00",
    status: "LIVE",
    liveMinute: 85,
    broadcasters: [{ name: "쿠팡플레이" }],
  },
];

export const MOCK_FAVORITE_PLAYERS: FavoritePlayer[] = [
  {
    id: "p_1",
    name: "브루노 페르난데스",
    number: 8,
    teamName: "맨체스터 유나이티드",
    position: "공격형 미드필더",
    imageUrl: "https://avatars.githubusercontent.com/u/123456?v=4", // Placeholder
  },
  {
    id: "p_2",
    name: "손흥민",
    number: 7,
    teamName: "토트넘 홋스퍼",
    position: "좌측 윙어",
    imageUrl: "https://avatars.githubusercontent.com/u/123457?v=4", // Placeholder
  },
];

export const MOCK_DATES = [
  { dayName: "금", date: 27, fullDate: "2026-02-27" },
  { dayName: "토", date: 28, fullDate: "2026-02-28" },
  { dayName: "일", date: 1, fullDate: "2026-03-01" },
  { dayName: "월", date: 2, fullDate: "2026-03-02" },
  { dayName: "화", date: 3, fullDate: "2026-03-03", isToday: true },
  { dayName: "수", date: 4, fullDate: "2026-03-04" },
  { dayName: "목", date: 5, fullDate: "2026-03-05" },
  { dayName: "금", date: 6, fullDate: "2026-03-06" },
  { dayName: "토", date: 7, fullDate: "2026-03-07" },
  { dayName: "일", date: 8, fullDate: "2026-03-08" },
  { dayName: "월", date: 9, fullDate: "2026-03-09" },
  { dayName: "화", date: 10, fullDate: "2026-03-10" },
];
