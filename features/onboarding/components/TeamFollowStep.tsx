"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Search, Check } from "lucide-react";
import { Team, Competition, FollowedTeam } from "../types";
import { createBrowserSupabaseClient } from "@/lib/utils/supabase/client";

interface Props {
  teams: Team[];
  competitions: Competition[];
  followedTeams: FollowedTeam[];
}

export function TeamFollowStep({
  teams: initialTeams,
  competitions,
  followedTeams,
}: Props) {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  // 1. [핵심] Map 구조 유지 (ID와 팀 정보 통째로 저장)
  const [selectedTeams, setSelectedTeams] = useState<Map<number, Team>>(() => {
    const map = new Map<number, Team>();
    if (followedTeams) {
      followedTeams.forEach((ft) => {
        const teamData = initialTeams.find((t) => t.id === ft.team_id);
        map.set(ft.team_id, teamData || ({ id: ft.team_id } as Team));
      });
    }
    return map;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [apiTeams, setApiTeams] = useState<Team[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<
    number | null
  >(
    followedTeams && followedTeams.length > 0
      ? -1
      : competitions.length > 0
        ? competitions[0].id
        : null,
  );

  // 🔍 하이브리드 검색 (생략 없이 로직 유지)
  useEffect(() => {
    const searchTeams = async () => {
      if (searchQuery.length < 3) {
        setApiTeams([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await fetch(
          `/api/external/search?type=teams&q=${searchQuery}`,
        );
        const data = await res.json();
        const mappedTeams = data.response.map((item: any) => ({
          id: item.team.id,
          name: item.team.name,
          code: item.team.code,
          logo: item.team.logo,
          league_id: null,
          venue_name: item.venue.name || "",
        }));
        setApiTeams(mappedTeams);
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    };
    const timer = setTimeout(searchTeams, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const displayedTeams = useMemo(() => {
    if (!searchQuery) {
      if (selectedCompetitionId === -1) {
        return Array.from(selectedTeams.values());
      }
      return initialTeams.filter((t) => t.league_id === selectedCompetitionId);
    }
    const dbResults = initialTeams.filter((t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    const combined = [...dbResults];
    apiTeams.forEach((at) => {
      if (!combined.find((ct) => ct.id === at.id)) combined.push(at);
    });
    return combined;
  }, [searchQuery, initialTeams, apiTeams, selectedCompetitionId]);

  const toggleTeam = (team: Team) => {
    const newSelected = new Map(selectedTeams);
    if (newSelected.has(team.id)) {
      newSelected.delete(team.id);
    } else {
      newSelected.set(team.id, team);
    }
    setSelectedTeams(newSelected);
  };

  const handleNextStep = async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const selectedTeamsArray = Array.from(selectedTeams.values());

      // 💡 [전술] 소속팀 정보를 먼저 DB에 확보 (추가된 팀만 해도 되지만, 안전을 위해 선택된 팀 중 필요한 정보 upsert)
      const teamsToUpsert = selectedTeamsArray
        .filter((t) => t.name)
        .map((t) => ({
          id: t.id,
          name: t.name,
          code: t.code,
          logo: t.logo,
          league_id: t.league_id || null,
          venue_name: t.venue_name,
        }));

      if (teamsToUpsert.length > 0) {
        const { error: teamErr } = await supabase
          .from("teams")
          .upsert(teamsToUpsert);
        if (teamErr) throw teamErr;
      }

      // 기존 팔로우 목록과 현재 선택 목록 비교
      const oldFollowedIds = new Set(
        followedTeams?.map((f) => f.team_id) || [],
      );
      const newFollowedIds = new Set(selectedTeams.keys());

      const addedIds = Array.from(newFollowedIds).filter(
        (id) => !oldFollowedIds.has(id),
      );
      const removedIds = Array.from(oldFollowedIds).filter(
        (id) => !newFollowedIds.has(id),
      );

      // 언팔로우된 팀 삭제
      if (removedIds.length > 0) {
        const { error: delErr } = await supabase
          .from("user_follows_teams")
          .delete()
          .eq("user_id", user.id)
          .in("team_id", removedIds);
        if (delErr) throw delErr;
      }

      // 새로 팔로우된 팀 삽입
      if (addedIds.length > 0) {
        const followInserts = addedIds.map((id) => ({
          user_id: user.id,
          team_id: id,
        }));
        const { error: insErr } = await supabase
          .from("user_follows_teams")
          .insert(followInserts);
        if (insErr) throw insErr;
      }

      router.push("/onboarding?step=3");
    } catch (error) {
      alert("저장 실패");
    } finally {
      setIsLoading(false);
    }
  };

  console.log(displayedTeams);

  return (
    <div className="relative w-full h-full min-h-screen bg-[#050505] overflow-hidden flex justify-center items-center">
      <div className="absolute top-[-69px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[rgba(0,188,125,0.05)] rounded-full blur-[150px] pointer-events-none" />

      <div className="relative w-full max-w-[672px] px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-6 sm:gap-8 z-10">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end w-full">
            <div className="flex flex-col gap-1">
              <h2 className="text-[24px] sm:text-[30px] font-black italic text-white uppercase tracking-[-1.1px] leading-[36px]">
                Follow Teams
              </h2>
              <p className="text-[#90a1b9] text-[14px] font-bold tracking-[1.25px]">
                내가 응원할 팀을 선택해 볼까요?
              </p>
            </div>
            <div className="flex items-center">
              <span className="text-[#00bc7d] text-[20px] font-black italic">
                02
              </span>
              <span className="text-[#45556c] text-[14px] font-black italic ml-1">
                / 03
              </span>
            </div>
          </div>
          <div className="w-full h-[4px] bg-white/10 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-[#00bc7d] rounded-full" />
          </div>
        </div>

        <div className="w-full bg-white/[0.05] border border-white/10 rounded-[32px] p-4 sm:p-8 flex flex-col gap-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#62748e]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="리그 외 팀 검색 (예: Inter Miami, PSG)..."
              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white focus:border-[#00bc7d] outline-none transition-all"
            />
            {isSearching && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00bc7d] animate-spin" />
            )}
          </div>

          {!searchQuery && (
            <div className="flex flex-col gap-2">
              <span className="text-[#90a1b9] text-[14px] font-bold">
                인기 리그
              </span>
              <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
                {followedTeams.length > 0 && (
                  <button
                    key="my-following"
                    onClick={() => setSelectedCompetitionId(-1)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-[14px] font-bold transition-colors ${
                      selectedCompetitionId === -1
                        ? "bg-[#00bc7d] text-black"
                        : "bg-white/5 text-[#90a1b9] hover:text-white"
                    }`}
                  >
                    🌟 내 팔로잉
                  </button>
                )}
                {competitions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedCompetitionId(item.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-[14px] font-bold transition-colors ${selectedCompetitionId === item.id ? "bg-[#00bc7d] text-black" : "bg-white/5 text-[#90a1b9] hover:text-white"}`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 🏟️ Teams Grid: 팔로우 버튼 다시 추가됨 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[350px] sm:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {displayedTeams.map((team) => {
              const isSelected = selectedTeams.has(team.id);
              return (
                <div
                  key={team.id}
                  onClick={() => toggleTeam(team)}
                  className={`group relative flex flex-col items-center gap-3 p-3 sm:p-4 rounded-[16px] sm:rounded-[20px] border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[rgba(0,188,125,0.1)] border-[#00bc7d] shadow-[0px_0px_15px_rgba(0,188,125,0.2)]"
                      : "bg-[rgba(0,0,0,0.4)] border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.2)]"
                  }`}
                >
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center p-2">
                    {team.logo ? (
                      <Image
                        src={team.logo}
                        alt={team.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-[10px] text-[#62748e]">No Logo</div>
                    )}
                  </div>

                  <span
                    className={`text-[12px] font-bold text-center leading-tight min-h-[1.5rem] flex items-center ${isSelected ? "text-white" : "text-[#90a1b9] group-hover:text-white"}`}
                  >
                    {team.name}
                  </span>

                  {/* 🌟 버튼 부활! */}
                  <div
                    className={`mt-auto w-full py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-colors text-center ${
                      isSelected
                        ? "bg-[#00bc7d] text-black"
                        : "bg-[rgba(255,255,255,0.05)] text-[#62748e] group-hover:bg-[rgba(255,255,255,0.1)] group-hover:text-white border border-[rgba(255,255,255,0.05)]"
                    }`}
                  >
                    {isSelected ? "팔로잉" : "팔로우"}
                  </div>

                  {/* 체크 표시 아이콘 */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-[#00bc7d] rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-black stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="flex flex-col w-full gap-4 mt-4">
          <button
            onClick={handleNextStep}
            disabled={isLoading || selectedTeams.size === 0}
            className="w-full h-[56px] bg-[#00bc7d] rounded-[16px] text-black text-[18px] font-black flex items-center justify-center gap-2 hover:bg-[#00d492] transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                다음 단계 <Check className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
