import { useQuery } from "@tanstack/react-query";

export const useGetLeagueNews = (leagueName: string | undefined) => {
  return useQuery({
    queryKey: ["league-news", leagueName],
    queryFn: async () => {
      const res = await fetch(`/api/news?q=${encodeURIComponent(leagueName!)}`);
      if (!res.ok) throw new Error("뉴스 패치 실패");
      return res.json();
    },
    enabled: !!leagueName,
    staleTime: 1000 * 60 * 10,
  });
};
