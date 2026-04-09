import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_SUPABASE_SERVICE_ROLE!
);

const API_BASE_URL = "https://v3.football.api-sports.io";

// 💡 딜레이를 주기 위한 유틸 함수
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const leagueParam = searchParams.get("league");
  const seasonParam = searchParams.get("season");

  if (!leagueParam || !seasonParam) {
    return NextResponse.json({ error: "리그 ID와 시즌 파라미터가 필요합니다." }, { status: 400 });
  }

  const LEAGUE_ID = parseInt(leagueParam);
  const SEASON = parseInt(seasonParam);
  const API_KEY = process.env.FOOTBALL_API_KEY || process.env.NEXT_PUBLIC_FOOTBALL_API_KEY;

  try {
    // 1. 첫 페이지 호출로 총 페이지 수 파악
    const firstPageRes = await fetch(
      `${API_BASE_URL}/players?league=${LEAGUE_ID}&season=${SEASON}&page=1`,
      { headers: { "x-apisports-key": API_KEY! } }
    );
    const firstPageData = await firstPageRes.json();

    if (!firstPageData.response || firstPageData.response.length === 0) {
      return NextResponse.json({ error: "API 데이터가 없습니다." }, { status: 404 });
    }

    const totalPages = firstPageData.paging.total;
    let allPlayers = [...firstPageData.response];

    // 💡 2. Rate Limit 방어 전술: 10개씩 묶어서 요청하고 1초 대기
    const BATCH_SIZE = 10; 
    
    for (let i = 2; i <= totalPages; i += BATCH_SIZE) {
      const fetchPromises = [];
      
      // BATCH_SIZE 만큼 프로미스 생성
      for (let j = i; j < i + BATCH_SIZE && j <= totalPages; j++) {
        fetchPromises.push(
          fetch(`${API_BASE_URL}/players?league=${LEAGUE_ID}&season=${SEASON}&page=${j}`, {
            headers: { "x-apisports-key": API_KEY! },
          }).then((res) => res.json())
        );
      }

      // 10개 동시 요청
      const batchResults = await Promise.all(fetchPromises);
      
      batchResults.forEach((pageData) => {
        if (pageData.response) {
          allPlayers.push(...pageData.response);
        } else {
          console.warn("데이터 누락 의심 (Rate Limit):", pageData);
        }
      });

      // Vercel 타임아웃(10초)을 피하면서 API 제한을 지키기 위해 1초 휴식
      if (i + BATCH_SIZE <= totalPages) {
        await delay(1000); 
      }
    }

    // 3. 800명 전체가 모였으니 이제 평점 정렬!
    const sortedPlayers = allPlayers
      .filter((p: any) => p.statistics[0]?.games?.rating)
      .sort((a: any, b: any) => {
        const ratingA = parseFloat(a.statistics[0].games.rating);
        const ratingB = parseFloat(b.statistics[0].games.rating);
        return ratingB - ratingA;
      })
      .slice(0, 10);

    const dbPayload = sortedPlayers.map((p: any) => ({
      league_id: LEAGUE_ID,
      season: SEASON,
      player_id: p.player.id,
      name: p.player.name,
      photo: p.player.photo,
      team_name: p.statistics[0].team.name,
      rating: parseFloat(p.statistics[0].games.rating),
      updated_at: new Date().toISOString()
    }));

    await supabaseAdmin
      .from("top_rated_players")
      .delete()
      .eq("league_id", LEAGUE_ID)
      .eq("season", SEASON);

    const { error } = await supabaseAdmin.from("top_rated_players").insert(dbPayload);
    if (error) throw error;

    return NextResponse.json({ 
      message: `${LEAGUE_ID} 리그 ${totalPages}페이지 동기화 완료!`, 
      updatedPlayers: dbPayload.length 
    });

  } catch (error) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: "서버 에러 발생" }, { status: 500 });
  }
}