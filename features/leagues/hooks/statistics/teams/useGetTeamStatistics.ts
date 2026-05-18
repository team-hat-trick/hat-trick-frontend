import { createBrowserSupabaseClient } from "@/lib/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

// 💡 훅 이름을 더 범용적인 useGetTeamStats로 변경!
export const useGetTeamStats = (leagueId: number, season: number) => {
  const supabase = createBrowserSupabaseClient();

  return useQuery({
    // 💡 쿼리 키도 변경해서 이전 캐시와 꼬이는 것을 방지합니다.
    queryKey: ["team-stats", leagueId, season],
    enabled: !!leagueId && !!season && !isNaN(season),
    queryFn: async () => {
      let { data, error } = await supabase
        .from("statistics_teams")
        .select("*")
        .eq("league_id", leagueId)
        .eq("season", season); 
        // 🚨 1. order와 limit을 완전히 제거했습니다! (해당 리그 20개 팀 전부 가져옴)

      if (error) throw error;

      if (!data || data.length === 0) {
        console.log(
          `[${leagueId} 리그] 팀 통계 DB가 비어있어 API 동기화를 시작합니다... ⏳`
        );

        const syncRes = await fetch(
          `/api/sync/cron/team-stats?league=${leagueId}&season=${season}`
        );

        if (!syncRes.ok) throw new Error("팀 통계 데이터 동기화 실패");

        console.log(`[${leagueId} 리그] 동기화 완료! DB에서 다시 꺼내옵니다. ✅`);

        const { data: newData, error: newError } = await supabase
          .from("statistics_teams")
          .select("*")
          .eq("league_id", leagueId)
          .eq("season", season);
          // 🚨 2. 동기화 후 다시 꺼내올 때도 order와 limit 제거!

        if (newError) throw newError;
        data = newData;
      }
      return data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24시간 캐싱 유지
  });
};