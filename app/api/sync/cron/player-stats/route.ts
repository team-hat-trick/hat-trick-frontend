import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_SUPABASE_SERVICE_ROLE!,
);

const API_BASE_URL = "https://v3.football.api-sports.io";

// 💡 딜레이를 주기 위한 유틸 함수
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const leagueParam = searchParams.get("league");
  const seasonParam = searchParams.get("season");

  if (!leagueParam || !seasonParam) {
    return NextResponse.json(
      { error: "리그 ID와 시즌 파라미터가 필요합니다." },
      { status: 400 },
    );
  }

  const LEAGUE_ID = parseInt(leagueParam);
  const SEASON = parseInt(seasonParam);
  const API_KEY =
    process.env.FOOTBALL_API_KEY || process.env.NEXT_PUBLIC_FOOTBALL_API_KEY;

  try {
    const firstPageRes = await fetch(
      `${API_BASE_URL}/players?league=${LEAGUE_ID}&season=${SEASON}&page=1`,
      { headers: { "x-apisports-key": API_KEY! } },
    );
    const firstPageData = await firstPageRes.json();

    if (!firstPageData.response || firstPageData.response.length === 0) {
      return NextResponse.json(
        { error: "API 데이터가 없습니다." },
        { status: 404 },
      );
    }

    const totalPages = firstPageData.paging.total;
    let allPlayers = [...firstPageData.response];

    // Rate Limit 방어 전술
    const BATCH_SIZE = 10;
    for (let i = 2; i <= totalPages; i += BATCH_SIZE) {
      const fetchPromises = [];
      for (let j = i; j < i + BATCH_SIZE && j <= totalPages; j++) {
        fetchPromises.push(
          fetch(
            `${API_BASE_URL}/players?league=${LEAGUE_ID}&season=${SEASON}&page=${j}`,
            { headers: { "x-apisports-key": API_KEY! } },
          ).then((res) => res.json()),
        );
      }
      const batchResults = await Promise.all(fetchPromises);
      batchResults.forEach((pageData) => {
        if (pageData.response) allPlayers.push(...pageData.response);
      });
      if (i + BATCH_SIZE <= totalPages) await delay(1000);
    }

    // 💡 3. 데이터 정제: 10명 자르기 로직(slice) 제거!
    // 리그에서 1분이라도 뛴 기록이 있는 '모든 활성 선수'를 필터링합니다. (보통 500~600명)
    const activePlayers = allPlayers.filter(
      (p: any) => p.statistics[0]?.games?.minutes > 0,
    );

    const dbPayload = activePlayers.map((p: any) => {
      const stats = p.statistics[0]; // 코드 길이를 줄이기 위한 변수화

      // 💡 1. 계산에 필요한 드리블 데이터를 안전하게 빼냅니다. (옵셔널 체이닝 `?.` 사용)
      const dribbleAttempts = stats.dribbles?.attempts || 0;
      const dribbleSuccess = stats.dribbles?.success || 0;

      const MIN_ATTEMPTS = 15;
      const MIN_PK_ATTEMPTS = 2;

      const penaltyScored = stats.penalty?.scored || 0;
      const penaltyMissed = stats.penalty?.missed || 0;
      const penaltyAttempts = penaltyScored + penaltyMissed;

      const shotsFaced =
        (stats.goals?.saves || 0) + (stats.goals?.conceded || 0);

      // 💡 2. 시도가 0보다 클 때만 계산하고, 아니면 무조건 0을 넣습니다. (0으로 나누기 방지)
      const dribbleSuccessRate =
        dribbleAttempts >= MIN_ATTEMPTS
          ? parseFloat(((dribbleSuccess / dribbleAttempts) * 100).toFixed(2))
          : 0;

      const penaltySuccessRate =
        penaltyAttempts >= MIN_PK_ATTEMPTS
          ? parseFloat(((penaltyScored / penaltyAttempts) * 100).toFixed(2))
          : 0;

      const savedRate =
        shotsFaced >= 30
          ? parseFloat(((stats.goals?.saves / shotsFaced) * 100).toFixed(2))
          : 0;

      return {
        league_id: LEAGUE_ID,
        season: SEASON,
        player_id: p.player.id,
        name: p.player.name,
        photo: p.player.photo,
        team_name: stats.team.name,
        rating: parseFloat(stats.games.rating) || 0,
        game_minutes: stats.games.minutes || 0,
        total_shots: stats.shots.total || 0,
        shots_on_target: stats.shots.on || 0,
        key_passes: stats.passes.key || 0,
        passes_accuracy: stats.passes.accuracy || 0,
        dribble_success_rate: dribbleSuccessRate,
        penalty_success_rate: penaltySuccessRate,
        fouls_drawn: stats.fouls.drawn || 0,
        tackle_success: stats.tackles.total || 0,
        blocks: stats.tackles.blocks || 0,
        interceptions: stats.tackles.interceptions || 0,
        duels_won: stats.duels.won || 0,
        fouls_committed: stats.fouls.committed || 0,
        penalty_committed: stats.penalty.commited || 0,
        penalty_saved: stats.penalty.saved || null,
        saved_rate: savedRate || null,
        updated_at: new Date().toISOString(),
      };
    });

    console.log(dbPayload);

    // 💡 4. Upsert 처리: Delete 할 필요 없이 데이터가 있으면 덮어쓰고, 없으면 넣습니다.
    const { error } = await supabaseAdmin
      .from("statistics_players")
      .upsert(dbPayload, {
        onConflict: "player_id, season, league_id",
      });

    if (error) throw error;

    return NextResponse.json({
      message: `${LEAGUE_ID} 리그 ${totalPages}페이지(총 ${dbPayload.length}명) 동기화 및 Upsert 완료!`,
    });
  } catch (error) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: "서버 에러 발생" }, { status: 500 });
  }
}
