"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Search, Check, User } from "lucide-react";
import { Team, Player, FollowedPlayer } from "../types";
import { createBrowserSupabaseClient } from "@/lib/utils/supabase/client";
import { INITIAL_PLAYER_ID_LIST } from "../constants";

interface Props {
  teams: Team[];
  players: Player[];
  followedPlayers: FollowedPlayer[];
}

export function PlayerFollowStep({
  teams,
  players: initialPlayers,
  followedPlayers,
}: Props) {
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  // Map 구조로 선택된 선수들의 전체 객체 정보를 보관
  const [selectedPlayers, setSelectedPlayers] = useState<Map<number, any>>(
    () => {
      const map = new Map<number, any>();
      if (followedPlayers) {
        // 검색 속도 최적화를 위해 임시 Map 생성
        const playerLookup = new Map(initialPlayers.map((p) => [p.id, p]));
        followedPlayers.forEach((fp) => {
          const playerData = playerLookup.get(fp.player_id);
          map.set(fp.player_id, playerData || ({ id: fp.player_id } as any));
        });
      }
      return map;
    },
  );

  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [apiPlayers, setApiPlayers] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 🔍 하이브리드 검색 (DB + API)
  useEffect(() => {
    const search = async () => {
      if (searchQuery.length < 3) {
        setApiPlayers([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await fetch(
          `/api/external/search?type=players&q=${encodeURIComponent(searchQuery)}`,
        );
        const data = await res.json();

        // 💡 [수정] API Route에서 이미 평탄화(Flatten)된 배열을 주므로 바로 넣습니다.
        if (data.response) {
          setApiPlayers(data.response);
        }
      } catch (e) {
        console.error("선수 검색 실패:", e);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(search, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 🖥️ 화면에 보여줄 선수 리스트 필터링 및 병합
  const { followedGroup, recommendedGroup, searchResults } = useMemo(() => {
    const normalize = (s: string) =>
      s
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    const query = normalize(searchQuery);

    const followed = Array.from(selectedPlayers.values());
    const followedIds = new Set(followed.map((p) => p.id));

    const recommended = initialPlayers.filter(
      (p) => INITIAL_PLAYER_ID_LIST.includes(p.id) && !followedIds.has(p.id),
    );

    if (!query) {
      return {
        followedGroup: followed,
        recommendedGroup: recommended,
        searchResults: null,
      };
    }

    const dbResults = initialPlayers.filter((p) =>
      normalize(p.name).includes(query),
    );
    const combined = [...dbResults];

    apiPlayers.forEach((ap) => {
      if (!combined.find((cp) => cp?.id === ap?.id)) combined.push(ap);
    });

    return {
      followedGroup: followed,
      recommendedGroup: recommended,
      searchResults: combined,
    };
  }, [searchQuery, initialPlayers, apiPlayers, selectedPlayers]);

  const teamMap = useMemo(() => {
    const map = new Map<number, Team>();
    teams.forEach((t) => map.set(t.id, t));
    return map;
  }, [teams]);

  const togglePlayer = (player: any) => {
    const newSelected = new Map(selectedPlayers);
    if (newSelected.has(player.id)) {
      newSelected.delete(player.id);
    } else {
      newSelected.set(player.id, player);
    }
    setSelectedPlayers(newSelected);
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const selectedArray = Array.from(selectedPlayers.values());

      // 💡 [전술] 소속팀 정보를 먼저 DB에 확보 (외래키 제약조건 방어)
      const teamsToUpsert = selectedArray
        .filter((p) => p.team_id && p.team_name)
        .map((p) => ({
          id: p.team_id,
          name: p.team_name,
          logo: p.team_logo,
        }));

      if (teamsToUpsert.length > 0) {
        await supabase.from("teams").upsert(teamsToUpsert);
      }

      // 선수 정보 Upsert
      const playersToUpsert = selectedArray
        .filter((p) => p.name)
        .map((p) => ({
          id: p.id,
          name: p.name,
          photo: p.photo,
          team_id: p.team_id,
          position: p.position,
          age: p.age,
        }));

      if (playersToUpsert.length > 0) {
        const { error: pErr } = await supabase
          .from("players")
          .upsert(playersToUpsert);
        if (pErr) throw pErr;
      }

      // 팔로우 관계 동기화 로직 (Diff 기반)
      const oldFollowedIds = new Set(
        followedPlayers?.map((f) => f.player_id) || [],
      );
      const newFollowedIds = new Set(selectedPlayers.keys());

      const addedIds = Array.from(newFollowedIds).filter(
        (id) => !oldFollowedIds.has(id),
      );
      const removedIds = Array.from(oldFollowedIds).filter(
        (id) => !newFollowedIds.has(id),
      );

      if (removedIds.length > 0) {
        const { error: delErr } = await supabase
          .from("user_follows_players")
          .delete()
          .eq("user_id", user.id)
          .in("player_id", removedIds);
        if (delErr) throw delErr;
      }

      if (addedIds.length > 0) {
        const followInserts = addedIds.map((id) => ({
          user_id: user.id,
          player_id: id,
        }));
        const { error: insErr } = await supabase
          .from("user_follows_players")
          .insert(followInserts);
        if (insErr) throw insErr;
      }

      router.push("/dashboard");
    } catch (e) {
      console.error(e);
      alert("선수 저장에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 선수 카드 렌더링 헬퍼 함수
  const renderPlayerCard = (player: any) => {
    const isSelected = selectedPlayers.has(player.id);
    const dbTeam = teamMap.get(player.team_id!);
    const teamName = dbTeam ? dbTeam.name : player.team_name || "Other Team";

    return (
      <div
        key={`${player.id}-${player.name}`}
        onClick={() => togglePlayer(player)}
        className={`group relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-[20px] border transition-all duration-200 cursor-pointer ${
          isSelected
            ? "bg-[#00bc7d]/10 border-[#00bc7d]"
            : "bg-black/40 border-white/5 hover:border-white/20"
        }`}
      >
        <div className="w-12 h-12 flex-shrink-0 rounded-full bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden">
          {player.photo ? (
            <Image
              src={player.photo}
              alt={player.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-[#62748e]" />
          )}
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <span
            className={`text-[16px] font-bold truncate ${isSelected ? "text-white" : "text-[#90a1b9] group-hover:text-white"}`}
          >
            {player.name}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[12px] text-[#00bc7d] font-semibold">
              {player.position || "Unknown"}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#45556c]" />
            <span className="text-[12px] text-[#62748e] truncate">
              {teamName}
            </span>
          </div>
        </div>

        <div
          className={`px-4 py-2 rounded-full text-[12px] font-bold transition-colors flex-shrink-0 ${
            isSelected
              ? "bg-[#00bc7d] text-black"
              : "bg-white/5 text-[#62748e] group-hover:text-white border border-white/5"
          }`}
        >
          {isSelected ? "팔로잉" : "팔로우"}
        </div>

        {isSelected && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-[#00bc7d] rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 text-black stroke-[3]" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-[#050505] overflow-hidden flex justify-center items-center">
      <div className="absolute top-[-69px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[rgba(0,188,125,0.05)] rounded-full blur-[150px] pointer-events-none" />

      <div className="relative w-full max-w-[672px] px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-6 sm:gap-8 z-10">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end w-full">
            <div className="flex flex-col gap-1">
              <h2 className="text-[24px] sm:text-[30px] font-black italic text-white uppercase tracking-[-1.1px] leading-[36px]">
                Follow Players
              </h2>
              <p className="text-[#90a1b9] text-[14px] font-bold tracking-[1.25px]">
                가장 좋아하는 선수를 검색해 볼까요?
              </p>
            </div>
            <div className="flex items-center">
              <span className="text-[#00bc7d] text-[20px] font-black italic">
                03
              </span>
              <span className="text-[#45556c] text-[14px] font-black italic ml-1">
                / 03
              </span>
            </div>
          </div>
          <div className="w-full h-[4px] bg-white/10 rounded-full overflow-hidden">
            <div className="w-full h-full bg-[#00bc7d] rounded-full transition-all duration-500" />
          </div>
        </div>

        {/* Content Card */}
        <div className="w-full bg-white/[0.05] border border-white/10 rounded-[32px] p-5 sm:p-8 flex flex-col gap-6 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
          {/* Search Bar */}
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#62748e]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="선수 이름 검색 (예: Haaland, Son, Messi)..."
              className="w-full h-[52px] bg-white/5 border border-white/10 rounded-[16px] pl-12 pr-4 text-white text-[15px] placeholder-[#62748e] focus:outline-none focus:border-[#00bc7d] transition-all"
            />
            {isSearching && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00bc7d] animate-spin" />
            )}
          </div>

          {/* Player List */}
          <div className="flex flex-col gap-3 h-[320px] overflow-y-auto pr-2 custom-scrollbar">
            {searchResults ? (
              searchResults.length > 0 ? (
                searchResults.map(renderPlayerCard)
              ) : (
                !isSearching && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-10 gap-2">
                    <Search className="w-8 h-8 text-[#45556c]" />
                    <span className="text-[#62748e] text-sm">
                      검색 결과가 없습니다.
                    </span>
                  </div>
                )
              )
            ) : (
              <>
                {followedGroup && followedGroup.length > 0 && (
                  <div className="flex flex-col gap-3 mb-2">
                    <div className="sticky top-0 bg-[#0c1116] z-10 py-1 border-b border-white/10">
                      <span className="text-[#00bc7d] text-[13px] font-bold px-1 uppercase tracking-wider">
                        🌟 내 팔로잉 선수
                      </span>
                    </div>
                    {followedGroup.map(renderPlayerCard)}
                  </div>
                )}

                {recommendedGroup && recommendedGroup.length > 0 && (
                  <div className="flex flex-col gap-3 mt-1">
                    <div className="sticky top-0 bg-[#0c1116] z-10 py-1 border-b border-white/10">
                      <span className="text-[#90a1b9] text-[13px] font-bold px-1 uppercase tracking-wider">
                        🔥 추천 인기 선수
                      </span>
                    </div>
                    {recommendedGroup.map(renderPlayerCard)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col w-full gap-4 mt-4">
          <button
            onClick={handleFinish}
            disabled={isLoading || selectedPlayers.size === 0}
            className="w-full h-[56px] bg-[#00bc7d] rounded-[16px] text-black text-[18px] font-black flex items-center justify-center gap-2 hover:bg-[#00d492] transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                시작하기 <Check className="w-5 h-5" />
              </>
            )}
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-2 text-[#62748e] text-[12px] font-bold uppercase hover:text-white transition-colors"
          >
            나중에 하기
          </button>
        </div>
      </div>
    </div>
  );
}
