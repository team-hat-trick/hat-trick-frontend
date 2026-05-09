import { createBrowserSupabaseClient } from "@/lib/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useGetAvgGoals = (leagueId: number, season: number) => {
  const supabase = createBrowserSupabaseClient();

  return useQuery({
    queryKey: ["team-avg-goals", leagueId, season],
    enabled: !!leagueId && !!season && !isNaN(season),
    queryFn: async () => {
      // 💡 1. 선수 테이블(statistics_players)이 아닌 팀 테이블(statistics_teams)을 조회합니다!
      let { data, error } = await supabase
        .from("statistics_teams")
        .select("*")
        .eq("league_id", leagueId)
        .eq("season", season)
        // 💡 2. 평균 득점이 가장 높은 팀 순서대로 내림차순 정렬
        .order("avg_goals_for", { ascending: false })
        .limit(5);

      if (error) throw error;

      if (!data || data.length === 0) {
        console.log(
          `[${leagueId} 리그] 팀 통계 DB가 비어있어 API 동기화를 시작합니다... ⏳`
        );

        // 🚨 3. 팀 통계 동기화 API 경로로 호출!
        const syncRes = await fetch(
          `/api/sync/cron/team-stats?league=${leagueId}&season=${season}`
        );

        if (!syncRes.ok) throw new Error("팀 통계 데이터 동기화 실패");

        console.log(`[${leagueId} 리그] 동기화 완료! DB에서 다시 꺼내옵니다. ✅`);

        // 동기화 후 다시 쿼리
        const { data: newData, error: newError } = await supabase
          .from("statistics_teams")
          .select("*")
          .eq("league_id", leagueId)
          .eq("season", season)
          .order("avg_goals_for", { ascending: false })
          .limit(5);

        if (newError) throw newError;
        data = newData;
      }
      return data;
    },
    // 팀 통계는 시즌 중에 선수 스탯처럼 분 단위로 휙휙 바뀌지 않으니 StaleTime을 길게 줘도 좋습니다.
    staleTime: 1000 * 60 * 60 * 24, // 24시간
  });
};