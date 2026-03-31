import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY;
const API_BASE_URL = "https://v3.football.api-sports.io";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_SUPABASE_SERVICE_ROLE!,
);

const CORE_LEAGUES = [
  { id: 39, name: "Premier League" },
  { id: 140, name: "La Liga" },
  { id: 78, name: "Bundesliga" },
  { id: 135, name: "Serie A" },
  { id: 61, name: "Ligue 1" },
  { id: 292, name: "K League 1" },
];

const CURRENT_SEASON = 2025;

async function fetchFromApi(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    headers: {
      "x-apisports-key": API_KEY!,
    },
  });
  if (!response.ok) throw new Error(`API 호출 실패: ${response.statusText}`);
  return await response.json();
}

async function syncLeagueData(leagueId: number) {
  console.log(`\n[League ID: ${leagueId}] 데이터 마이그레이션 시작...`);

  try {
    const leagueRes = await fetchFromApi(
      `leagues?id=${leagueId}&season=${leagueId === 292 ? 2026 : CURRENT_SEASON}`,
    );
    const leagueData = leagueRes.response[0];

    await supabase.from("competitions").upsert({
      id: leagueData.league.id,
      name: leagueData.league.name,
      logo: leagueData.league.logo,
      country: leagueData.country.name,
      is_core: true,
    });

    console.log(`🏃 팀 목록 스카우팅 중...`);
    const teamRes = await fetchFromApi(
      `teams?league=${leagueId}&season=${CURRENT_SEASON}`,
    );

    const teamsToSave = teamRes.response.map((item: any) => ({
      id: item.team.id,
      name: item.team.name,
      code: item.team.code,
      logo: item.team.logo,
      league_id: leagueId,
      venue_name: item.venue.name,
    }));

    const { error: teamError } = await supabase
      .from("teams")
      .upsert(teamsToSave);
    if (teamError) throw teamError;
    console.log(`✅ ${teamsToSave.length}개 팀 등록 완료!`);

    console.log("🏃 선수단 소집 시작 (팀별 순차 진행)...");

    for (const teamItem of teamRes.response) {
      const teamId = teamItem.team.id;
      const teamName = teamItem.team.name;

      const squadRes = await fetchFromApi(`players/squads?team=${teamId}`);

      if (squadRes.response.length > 0) {
        const playersToSave = squadRes.response[0].players.map((p: any) => ({
          id: p.id,
          name: p.name,
          age: p.age,
          photo: p.photo,
          number: p.number,
          team_id: teamId,
          position: p.position,
        }));

        const { error: playerError } = await supabase
          .from("players")
          .upsert(playersToSave);
        if (playerError) {
          console.error(
            `❌ ${teamName} 선수단 저장 실패:`,
            playerError.message,
          );
        } else {
          console.log(`   - ${teamName}: ${playersToSave.length}명 완료`);
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    console.log(`\n🎉 [League ID: ${leagueId}] 모든 데이터 연동 성공!`);
  } catch (error) {
    console.error(`❌ [League ID: ${leagueId}] 연동 중 사고 발생:`, error);
  }
}

async function run() {
  for (const league of CORE_LEAGUES) {
    await syncLeagueData(league.id);
  }
}

run();
