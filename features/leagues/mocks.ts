export const MOCK_LEAGUE_INFO = {
  id: "PL",
  name: "프리미어리그",
  country: "🇬🇧 잉글랜드",
  logo: "https://crests.football-data.org/PL.png",
  season: "2023/24",
};

export const MOCK_STANDINGS = [
  { position: 1, team: { name: "아스널", crest: "https://crests.football-data.org/57.png", shortName: "아스널" }, playedGames: 28, won: 20, draw: 4, lost: 4, points: 64, goalDifference: 46 },
  { position: 2, team: { name: "리버풀", crest: "https://crests.football-data.org/64.png", shortName: "리버풀" }, playedGames: 28, won: 19, draw: 7, lost: 2, points: 64, goalDifference: 39 },
  { position: 3, team: { name: "맨체스터 시티", crest: "https://crests.football-data.org/65.png", shortName: "맨시티" }, playedGames: 28, won: 19, draw: 6, lost: 3, points: 63, goalDifference: 35 },
  { position: 4, team: { name: "아스톤 빌라", crest: "https://crests.football-data.org/58.png", shortName: "아스톤 빌라" }, playedGames: 28, won: 17, draw: 4, lost: 7, points: 55, goalDifference: 18 },
  { position: 5, team: { name: "토트넘 홋스퍼", crest: "https://crests.football-data.org/73.png", shortName: "토트넘" }, playedGames: 27, won: 16, draw: 5, lost: 6, points: 53, goalDifference: 20 },
];

export const MOCK_MATCHES = [
  { id: 1, homeTeam: "리버풀", homeLogo: "https://crests.football-data.org/64.png", awayTeam: "맨체스터 시티", awayLogo: "https://crests.football-data.org/65.png", homeScore: 1, awayScore: 1, status: "FINISHED", time: "FT" },
  { id: 2, homeTeam: "아스널", homeLogo: "https://crests.football-data.org/57.png", awayTeam: "브렌트퍼드", awayLogo: "https://crests.football-data.org/402.png", homeScore: 2, awayScore: 1, status: "FINISHED", time: "FT" },
  { id: 3, homeTeam: "아스톤 빌라", homeLogo: "https://crests.football-data.org/58.png", awayTeam: "토트넘 홋스퍼", awayLogo: "https://crests.football-data.org/73.png", homeScore: 0, awayScore: 4, status: "FINISHED", time: "FT" },
];

export const MOCK_PLAYER_GOALS = [
  { rank: 1, name: "엘링 홀란드", team: "맨체스터 시티", goals: 18, matches: 23, photo: "https://randomuser.me/api/portraits/men/1.jpg" },
  { rank: 2, name: "올리 왓킨스", team: "아스톤 빌라", goals: 16, matches: 28, photo: "https://randomuser.me/api/portraits/men/2.jpg" },
  { rank: 3, name: "모하메드 살라", team: "리버풀", goals: 15, matches: 22, photo: "https://randomuser.me/api/portraits/men/3.jpg" },
  { rank: 4, name: "손흥민", team: "토트넘 홋스퍼", goals: 14, matches: 24, photo: "https://randomuser.me/api/portraits/men/4.jpg" },
  { rank: 5, name: "자로드 보웬", team: "웨스트햄", goals: 14, matches: 28, photo: "https://randomuser.me/api/portraits/men/5.jpg" },
];

export const MOCK_PLAYER_ASSISTS = [
  { rank: 1, name: "파스칼 그로스", team: "브라이튼", assists: 10, matches: 27, photo: "https://randomuser.me/api/portraits/men/6.jpg" },
  { rank: 2, name: "키어런 트리피어", team: "뉴캐슬", assists: 10, matches: 25, photo: "https://randomuser.me/api/portraits/men/7.jpg" },
  { rank: 3, name: "올리 왓킨스", team: "아스톤 빌라", assists: 10, matches: 28, photo: "https://randomuser.me/api/portraits/men/2.jpg" },
  { rank: 4, name: "페드로 네투", team: "울버햄튼", assists: 9, matches: 19, photo: "https://randomuser.me/api/portraits/men/8.jpg" },
  { rank: 5, name: "모하메드 살라", team: "리버풀", assists: 9, matches: 22, photo: "https://randomuser.me/api/portraits/men/3.jpg" },
];

export const MOCK_YELLOW_CARDS = [
  { rank: 1, name: "주앙 팔리냐", team: "풀럼", value: 12, matches: 26, photo: "https://randomuser.me/api/portraits/men/9.jpg" },
  { rank: 2, name: "에드손 알바레즈", team: "웨스트햄", value: 10, matches: 24, photo: "https://randomuser.me/api/portraits/men/10.jpg" },
  { rank: 3, name: "니콜라 작송", team: "첼시", value: 9, matches: 24, photo: "https://randomuser.me/api/portraits/men/11.jpg" },
];

export const MOCK_CLEAN_SHEETS = [
  { rank: 1, name: "다비드 라야", team: "아스널", value: 10, matches: 23, photo: "https://randomuser.me/api/portraits/men/12.jpg" },
  { rank: 2, name: "조던 픽포드", team: "에버턴", value: 8, matches: 28, photo: "https://randomuser.me/api/portraits/men/13.jpg" },
  { rank: 3, name: "에데르송", team: "맨체스터 시티", value: 8, matches: 27, photo: "https://randomuser.me/api/portraits/men/14.jpg" },
];

export const MOCK_TEAM_POSSESSION = [
  { rank: 1, team: { name: "맨체스터 시티", crest: "https://crests.football-data.org/65.png" }, value: "65.4%" },
  { rank: 2, team: { name: "브라이튼", crest: "https://crests.football-data.org/397.png" }, value: "61.8%" },
  { rank: 3, team: { name: "토트넘 홋스퍼", crest: "https://crests.football-data.org/73.png" }, value: "60.2%" },
];

export const MOCK_TEAM_GOALS = [
  { rank: 1, team: { name: "아스널", crest: "https://crests.football-data.org/57.png" }, value: 70 },
  { rank: 2, team: { name: "리버풀", crest: "https://crests.football-data.org/64.png" }, value: 65 },
  { rank: 3, team: { name: "맨체스터 시티", crest: "https://crests.football-data.org/65.png" }, value: 63 },
];

export const MOCK_CLUBS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `클럽 ${i + 1}`,
  logo: `https://crests.football-data.org/${57 + i}.png`,
  manager: `감독 ${i + 1}`,
  stadium: `스타디움 ${i + 1}`,
  city: `도시 ${i + 1}`
}));
MOCK_CLUBS[0] = { id: 57, name: "아스널", logo: "https://crests.football-data.org/57.png", manager: "미켈 아르테타", stadium: "에미레이츠 스타디움", city: "London" };
MOCK_CLUBS[1] = { id: 64, name: "리버풀", logo: "https://crests.football-data.org/64.png", manager: "위르겐 클롭", stadium: "안필드", city: "Liverpool" };
MOCK_CLUBS[2] = { id: 65, name: "맨체스터 시티", logo: "https://crests.football-data.org/65.png", manager: "펩 과르디올라", stadium: "에티하드 스타디움", city: "Manchester" };
MOCK_CLUBS[3] = { id: 73, name: "토트넘 홋스퍼", logo: "https://crests.football-data.org/73.png", manager: "엔제 포스테코글루", stadium: "토트넘 홋스퍼 스타디움", city: "London" };

export const MOCK_TRANSFERS = [
  { id: 1, player: "데클란 라이스", from: "웨스트햄", to: "아스널", fee: "£105m", date: "2023.07.15", type: "IN", isOfficial: true },
  { id: 2, player: "모이세스 카이세도", from: "브라이튼", to: "첼시", fee: "£115m", date: "2023.08.14", type: "IN", isOfficial: true },
  { id: 3, player: "해리 케인", from: "토트넘 홋스퍼", to: "바이에른 뮌헨", fee: "£100m", date: "2023.08.12", type: "OUT", isOfficial: true },
  { id: 4, player: "소피안 암라바트", from: "피오렌티나", to: "맨체스터 유나이티드", fee: "임대 (£8.5m)", date: "2023.09.01", type: "IN", isOfficial: true },
];

export const MOCK_HISTORY_WINNERS = [
  { year: "2022/23", team: "맨체스터 시티", logo: "https://crests.football-data.org/65.png" },
  { year: "2021/22", team: "맨체스터 시티", logo: "https://crests.football-data.org/65.png" },
  { year: "2020/21", team: "맨체스터 시티", logo: "https://crests.football-data.org/65.png" },
  { year: "2019/20", team: "리버풀", logo: "https://crests.football-data.org/64.png" },
  { year: "2018/19", team: "맨체스터 시티", logo: "https://crests.football-data.org/65.png" },
];

export const MOCK_HISTORY_TITLES = [
  { rank: 1, team: "맨체스터 유나이티드", titles: 20, logo: "https://crests.football-data.org/66.png" },
  { rank: 2, team: "리버풀", titles: 19, logo: "https://crests.football-data.org/64.png" },
  { rank: 3, team: "아스널", titles: 13, logo: "https://crests.football-data.org/57.png" },
];

export const MOCK_HISTORY_SCORERS = [
  { rank: 1, name: "앨런 시어러", goals: 260, matches: 441 },
  { rank: 2, name: "해리 케인", goals: 213, matches: 320 },
  { rank: 3, name: "웨인 루니", goals: 208, matches: 491 },
];
