import { NextResponse } from "next/server";

const API_BASE_URL = "https://v3.football.api-sports.io";
const CURRENT_SEASON = 2025; // 현재 대부분 리그의 활성 시즌

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const query = searchParams.get("q");
  const API_KEY = process.env.FOOTBALL_API_KEY || process.env.NEXT_PUBLIC_FOOTBALL_API_KEY;

  if (!query || query.length < 3) return NextResponse.json({ response: [] });

  const headers = { "x-apisports-key": API_KEY! };

  try {
    // 1️⃣ 팀 검색일 경우 (기존 로직 유지 - 얘는 search만으로 잘 됨)
    if (type === "teams") {
      const res = await fetch(`${API_BASE_URL}/teams?search=${encodeURIComponent(query)}`, { headers });
      const data = await res.json();
      return NextResponse.json(data);
    }

    // 2️⃣ 선수 검색일 경우 (2단계 전술 시작)
    if (type === "players") {
      // Step A: 프로필 검색 (ID를 따오기 위함)
      const profileRes = await fetch(`${API_BASE_URL}/players/profiles?search=${encodeURIComponent(query)}`, { headers });
      const profileData = await profileRes.json();

      // 쿼터와 성능을 고려하여 상위 20명까지만 상세 정보 조회 (활동 중인 선수 필터링 목적)
      const topResults = profileData.response.slice(0, 20);

      const playersWithFullInfo = await Promise.all(
        topResults.map(async (p: any) => {
          const playerObj = p.player || p;
          try {
            // Step B: 각 선수의 상세 정보(팀, 포지션) 요청
            // Next.js 캐싱을 방지하기 위해 cache: 'no-store' 추가
            const squadRes = await fetch(`${API_BASE_URL}/players/squads?player=${playerObj.id}`, { 
              headers,
              cache: 'no-store' 
            });
            const squadData = await squadRes.json();
            const teamInfo = squadData.response?.[0]?.team;
            const playerInfo = squadData.response?.[0]?.players?.[0];

            // 💡 [핵심] 소속팀이 없는 은퇴/무소속/비인기 선수는 검색 결과에서 제외하여 "Unknown" 방지
            if (!teamInfo || !playerInfo) return null;

            return {
              id: playerObj.id,
              name: playerObj.name,
              photo: playerObj.photo,
              age: playerObj.age,
              nationality: playerObj.nationality,
              // ⚽️ 여기서 팀 정보와 포지션 주입!
              team_id: teamInfo.id,
              team_name: teamInfo.name,
              team_logo: teamInfo.logo,
              position: playerInfo.position,
            };
          } catch (err) {
            return null;
          }
        })
      );

      // null인 항목 제거 후, 상위 8명만 반환
      const validPlayers = playersWithFullInfo.filter(Boolean).slice(0, 8);
      
      return NextResponse.json({ response: validPlayers });
    }

    return NextResponse.json({ response: [] });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ response: [] }, { status: 500 });
  }
}