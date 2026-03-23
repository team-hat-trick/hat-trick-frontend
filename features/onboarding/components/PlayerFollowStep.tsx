"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Search } from "lucide-react";
import { Team, Player, FollowedPlayer } from "../types";
import { createBrowserSupabaseClient } from "@/lib/utils/supabase/client";
import { INITIAL_PLAYER_ID_LIST } from "../constants";

interface Props {
  teams: Team[];
  players: Player[];
  followedPlayers: FollowedPlayer[];
}

export function PlayerFollowStep({ teams, players, followedPlayers }: Props) {
  const router = useRouter();
  const [selectedPlayers, setSelectedPlayers] = useState<Set<number>>(
    new Set(followedPlayers.map((item) => item.player_id)),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const supabase = createBrowserSupabaseClient();

  // Filter players based on search query, and limit to 4
  const displayedPlayers = useMemo(() => {
    if (!searchQuery.trim()) {
      return players.filter((item) => INITIAL_PLAYER_ID_LIST.includes(item.id));
    }
    const lowerQuery = searchQuery.toLowerCase();
    return players.filter((p) => p.name.toLowerCase().includes(lowerQuery));
  }, [players, searchQuery]);

  // Create a map for quick team lookups
  const teamMap = useMemo(() => {
    const map = new Map<number, Team>();
    teams.forEach((t) => map.set(t.id, t));
    return map;
  }, [teams]);

  const togglePlayer = (playerId: number) => {
    const newSelected = new Set(selectedPlayers);
    if (newSelected.has(playerId)) {
      newSelected.delete(playerId);
    } else {
      newSelected.add(playerId);
    }
    setSelectedPlayers(newSelected);
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not authenticated");

      // Identify players to remove (initially followed but now unselected)
      const initialPlayerIds = new Set(
        followedPlayers.map((item) => item.player_id),
      );
      const playersToRemove = Array.from(initialPlayerIds).filter(
        (id) => !selectedPlayers.has(id),
      );

      // Delete unselected players
      for (const playerId of playersToRemove) {
        await supabase
          .from("user_player_follows")
          .delete()
          .match({ user_id: user.id, player_id: playerId });
      }

      // Upsert selected players
      for (const playerId of Array.from(selectedPlayers)) {
        await supabase.from("user_player_follows").upsert({
          user_id: user.id,
          player_id: playerId,
        });
      }

      // Navigate to home or main app
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to save players:", error);
      alert("선수 저장에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-[#050505] overflow-hidden flex justify-center items-center">
      {/* Background Effect */}
      <div className="absolute top-[-69px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[rgba(0,188,125,0.05)] rounded-full blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-[672px] px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-6 sm:gap-8 h-full min-h-[682px] justify-center z-10">
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
              <span className="text-[#00bc7d] text-[20px] font-black italic tracking-[-0.45px]">
                03{" "}
              </span>
              <span className="text-[#45556c] text-[14px] font-black italic tracking-[-0.15px] ml-1">
                / 03
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-[4px] bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
            <div className="w-full h-full bg-[#00bc7d] rounded-full" />
          </div>
        </div>

        {/* Content Card */}
        <div className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[32px] p-5 sm:p-8 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col gap-6">
          {/* Search Bar */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-[#62748e]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="선수 이름 검색..."
              className="w-full h-[52px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[16px] pl-12 pr-4 text-white text-[15px] placeholder-[#62748e] focus:outline-none focus:border-[#00bc7d] focus:bg-[rgba(0,188,125,0.05)] transition-all"
            />
          </div>

          {/* Player List */}
          <div className="flex flex-col gap-3 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {displayedPlayers.map((player) => {
              const isSelected = selectedPlayers.has(player.id);
              const team = teamMap.get(player.team_id);

              return (
                <button
                  key={player.id}
                  onClick={() => togglePlayer(player.id)}
                  className={`group relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-[16px] sm:rounded-[20px] border transition-all duration-200 text-left ${
                    isSelected
                      ? "bg-[rgba(0,188,125,0.1)] border-[#00bc7d] shadow-[0px_0px_15px_rgba(0,188,125,0.2)]"
                      : "bg-[rgba(0,0,0,0.4)] border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.05)]"
                  }`}
                >
                  {/* Left: Avatar */}
                  <div className="w-12 h-12 flex-shrink-0 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center border border-[rgba(255,255,255,0.1)]">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                        fill={isSelected ? "#00bc7d" : "#62748e"}
                      />
                    </svg>
                  </div>

                  {/* Middle: Info */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <span
                      className={`text-[16px] font-bold truncate ${isSelected ? "text-white" : "text-[#90a1b9] group-hover:text-white"}`}
                    >
                      {player.name}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[12px] text-[#00bc7d] font-semibold">
                        {player.position}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-[#45556c]" />
                      <span className="text-[12px] text-[#62748e] truncate">
                        {team ? team.short_name || team.name : "Unknown Team"}
                      </span>
                    </div>
                  </div>

                  {/* Right: Status/Follow Button */}
                  <div
                    className={`px-4 py-2 rounded-full text-[12px] font-bold tracking-wider transition-colors flex-shrink-0 ${
                      isSelected
                        ? "bg-[#00bc7d] text-black"
                        : "bg-[rgba(255,255,255,0.05)] text-[#62748e] group-hover:bg-[rgba(255,255,255,0.1)] group-hover:text-white border border-[rgba(255,255,255,0.05)]"
                    }`}
                  >
                    {isSelected ? "팔로잉" : "팔로우"}
                  </div>
                </button>
              );
            })}

            {displayedPlayers.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
                <Search className="w-8 h-8 text-[#45556c]" />
                <span className="text-[#62748e] text-sm">
                  해당하는 선수를 찾을 수 없습니다.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col w-full gap-4 mt-4">
          <button
            onClick={handleFinish}
            disabled={isLoading || selectedPlayers.size === 0}
            className="w-full h-[56px] bg-[#00bc7d] rounded-[16px] text-black text-[18px] font-black tracking-[-0.44px] shadow-[0px_20px_25px_0px_rgba(0,188,125,0.2),0px_8px_10px_0px_rgba(0,188,125,0.2)] hover:bg-[#00a36c] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-black" />
            ) : (
              <>
                시작하기
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5 15L12.5 10L7.5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </button>

          <button
            onClick={handleSkip}
            className="w-full py-2 text-[#62748e] text-[12px] font-bold tracking-[1.2px] uppercase hover:text-white transition-colors"
          >
            건너뛰기
          </button>
        </div>
      </div>
    </div>
  );
}
