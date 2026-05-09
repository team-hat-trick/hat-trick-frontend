import { createBrowserSupabaseClient } from "@/lib/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useGetShotsOnTarget = (leagueId: number, season: number) => {
  const supabase = createBrowserSupabaseClient();

  return useQuery({
    queryKey: ["shots-on-target", leagueId, season],
    enabled: !!leagueId && !!season && !isNaN(season),
    queryFn: async () => {
      let { data, error } = await supabase
        .from("statistics_players")
        .select("*")
        .eq("league_id", leagueId)
        .eq("season", season)
        .order("shots_on_target", { ascending: false })
        .limit(5);

      if (error) throw error;

      if (!data || data.length === 0) {
        console.log(
          `[${leagueId} 리그] DB가 비어있어 API 동기화를 시작합니다... ⏳`,
        );

        const syncRes = await fetch(
          `/api/sync/cron/player-stats?league=${leagueId}&season=${season}`,
        );

        if (!syncRes.ok) throw new Error("유효 슛팅 횟수 데이터 동기화 실패");

        console.log(
          `[${leagueId} 리그] 동기화 완료! DB에서 다시 꺼내옵니다. ✅`,
        );

        const { data: newData, error: newError } = await supabase
          .from("statistics_players")
          .select("*")
          .eq("league_id", leagueId)
          .eq("season", season)
          .order("shots_on_target", { ascending: false })
          .limit(5);

        if (newError) throw newError;
        data = newData;
      }
      return data;
    },
    staleTime: 1000 * 60 * 60,
  });
};
