// scripts/sync-football-data.ts
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const API_KEY = process.env.FOOTBALL_DATA_ORG_API_KEY;
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_SUPABASE_SERVICE_ROLE!,
);

async function syncLeagueData(leagueCode: string) {
  console.log(`[${leagueCode}] 데이터 스카우팅 시작...`);

  try {
    const response = await fetch(
      `https://api.football-data.org/v4/competitions/${leagueCode}/teams`,
      {
        headers: { "X-Auth-Token": API_KEY! },
      },
    );

    if (!response.ok) throw new Error(`API 호출 실패: ${response.statusText}`);
    const jsonData = await response.json();

    // 1. 리그 정보 저장 (부모의 부모)
    await supabase.from("competitions").upsert({
      id: jsonData.competition.id,
      name: jsonData.competition.name,
      code: jsonData.competition.code,
      emblem_url: jsonData.competition.emblem,
    });

    // 2. [전술 수정] 모든 팀 정보를 먼저 저장합니다.
    const teamsToSave = jsonData.teams.map((team: any) => ({
      id: team.id,
      name: team.name,
      short_name: team.shortName,
      tla: team.tla,
      logo_url: team.crest,
      venue: team.venue,
      league_id: jsonData.competition.id,
      club_colors: team.clubColors,
      address: team.address,
      website: team.website,
      founded: team.founded,
    }));

    const { error: teamError } = await supabase
      .from("teams")
      .upsert(teamsToSave);
    if (teamError)
      throw new Error(`팀 정보 일괄 저장 실패: ${teamError.message}`);
    console.log(`✅ ${teamsToSave.length}개 팀 등록 완료!`);

    // 3. [전술 수정] 이제 모든 팀이 존재하므로 선수들을 저장합니다.
    console.log("🏃 선수단 소집 중...");

    // 모든 팀의 선수들을 하나의 배열로 합칩니다.
    const allPlayers = jsonData.teams.flatMap((team: any) =>
      team.squad.map((p: any) => ({
        id: p.id,
        name: p.name,
        position: p.position || "Unknown",
        date_of_birth: p.dateOfBirth,
        nationality: p.nationality,
        team_id: team.id, // 이제 이 ID는 무조건 DB에 존재합니다.
      })),
    );

    // 선수 데이터가 많을 수 있으므로 100명씩 끊어서 저장하는 것이 안전합니다 (Batch)
    const chunkSize = 100;
    for (let i = 0; i < allPlayers.length; i += chunkSize) {
      const chunk = allPlayers.slice(i, i + chunkSize);
      const { error: playerError } = await supabase
        .from("players")
        .upsert(chunk);
      if (playerError) {
        console.error(
          `선수단 일부 저장 실패 (${i}번째부터):`,
          playerError.message,
        );
      }
    }

    console.log(
      `✅ 총 ${allPlayers.length}명의 선수 등록 완료! [${leagueCode}] 연동 종료.`,
    );
  } catch (error) {
    console.error("❌ 데이터 연동 중 사고 발생:", error);
  }
}

syncLeagueData("FL1");
