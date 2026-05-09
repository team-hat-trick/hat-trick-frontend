import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ApiResponse, TeamStatistics } from "@/features/leagues/types/leagues";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_SUPABASE_SERVICE_ROLE!,
);

const API_BASE_URL = "https://v3.football.api-sports.io";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const leagueParam = searchParams.get("league");
  const seasonParam = searchParams.get("season");

  if (!leagueParam || !seasonParam) {
    return NextResponse.json({ error: "파라미터 누락" }, { status: 400 });
  }

  const LEAGUE_ID = parseInt(leagueParam);
  const SEASON = parseInt(seasonParam);
  const API_KEY =
    process.env.FOOTBALL_API_KEY || process.env.NEXT_PUBLIC_FOOTBALL_API_KEY;
  const headers = { "x-apisports-key": API_KEY! };

  try {
    // 💡 STEP 1: 팀 목록 가져오기 (여기서는 간단히 any 배열로 처리)
    const teamsRes = await fetch(
      `${API_BASE_URL}/teams?league=${LEAGUE_ID}&season=${SEASON}`,
      { headers },
    );
    const teamsData = await teamsRes.json();

    if (!teamsData.response) throw new Error("팀 목록 호출 실패");

    const teamIds = teamsData.response.map((item: any) => item.team.id);

    const allTeamStats = [];

    // 💡 STEP 2: 팀 통계 긁어오기
    for (let i = 0; i < teamIds.length; i++) {
      const teamId = teamIds[i];

      const statRes = await fetch(
        `${API_BASE_URL}/teams/statistics?league=${LEAGUE_ID}&season=${SEASON}&team=${teamId}`,
        { headers },
      );

      const statData = (await statRes.json()) as ApiResponse<TeamStatistics>;

      if (statData.response) {
        const stats = statData.response;

        allTeamStats.push({
          league_id: LEAGUE_ID,
          season: SEASON,
          team_id: teamId,
          team_name: stats.team.name,
          team_logo: stats.team.logo,

          form: stats.form || "",
          matches_played: stats.fixtures.played.total, // 👈 자동완성 꿀맛!
          wins: stats.fixtures.wins.total,
          draws: stats.fixtures.draws.total,
          loses: stats.fixtures.loses.total,

          goals_for: stats.goals.for.total.total || 0,
          goals_against: stats.goals.against.total.total || 0,

          avg_goals_for: parseFloat(stats.goals.for.average.total as string) || 0,
          avg_goals_against: parseFloat(stats.goals.against.average.total as string) || 0,

          clean_sheets: stats.clean_sheet.total || 0,
          failed_to_score: stats.failed_to_score.total || 0,

          updated_at: new Date().toISOString(),
        });
      }

      await delay(600);
    }

    // 💡 STEP 3: DB에 Upsert
    const { error } = await supabaseAdmin
      .from("statistics_teams")
      .upsert(allTeamStats, { onConflict: "team_id, season, league_id" });

    if (error) throw error;

    return NextResponse.json({
      message: `성공! 총 ${allTeamStats.length}개 팀 통계 동기화 완료!`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "팀 통계 동기화 실패" }, { status: 500 });
  }
}
