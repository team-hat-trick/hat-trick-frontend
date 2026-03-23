"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Team } from "../types";
import { Competition } from "../types";
import { createBrowserSupabaseClient } from "@/lib/utils/supabase/client";
import { FollowedTeam } from "../types";

interface Props {
  teams: Team[];
  competitions: Competition[];
  followedTeams: FollowedTeam[];
}

export function TeamFollowStep({ teams, competitions, followedTeams }: Props) {
  const router = useRouter();
  const [selectedTeams, setSelectedTeams] = useState<Set<number>>(
    new Set(followedTeams.map((item) => item.team_id)),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<
    number | null
  >(competitions.length > 0 ? competitions[0].id : null);

  const supabase = createBrowserSupabaseClient();

  const displayedTeams = selectedCompetitionId
    ? teams.filter((team) => team.league_id === selectedCompetitionId)
    : teams;

  const toggleTeam = (teamId: number) => {
    const newSelected = new Set(selectedTeams);
    if (newSelected.has(teamId)) {
      newSelected.delete(teamId);
    } else {
      newSelected.add(teamId);
    }
    setSelectedTeams(newSelected);
  };

  const handleNextStep = async () => {
    setIsLoading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not authenticated");

      const initialTeamIds = new Set(followedTeams.map((item) => item.team_id));
      const teamsToRemove = Array.from(initialTeamIds).filter(
        (id) => !selectedTeams.has(id)
      );

      for (const teamId of teamsToRemove) {
        await supabase
          .from("user_team_follows")
          .delete()
          .match({ user_id: user.id, team_id: teamId });
      }

      for (const team of Array.from(selectedTeams)) {
        await supabase.from("user_team_follows").upsert({
          user_id: user.id,
          team_id: team,
        });
      }

      router.push("/onboarding?step=3");
    } catch (error) {
      console.error("Failed to save teams:", error);
      alert("팀 저장에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/onboarding?step=3");
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
                Follow Teams
              </h2>
              <p className="text-[#90a1b9] text-[14px] font-bold tracking-[1.25px]">
                내가 응원할 팀을 선택해 볼까요?
              </p>
            </div>

            <div className="flex items-center">
              <span className="text-[#00bc7d] text-[20px] font-black italic tracking-[-0.45px]">
                02{" "}
              </span>
              <span className="text-[#45556c] text-[14px] font-black italic tracking-[-0.15px] ml-1">
                / 03
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-[4px] bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-[#00bc7d] rounded-full" />
          </div>
        </div>

        {/* Content Card */}
        <div className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[32px] p-5 sm:p-8 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col gap-6">
          {/* Categories */}
          <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
            {competitions.map((item) => {
              const isActive = selectedCompetitionId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedCompetitionId(item.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-[14px] font-bold transition-colors ${
                    isActive
                      ? "bg-[#00bc7d] text-black"
                      : "bg-[rgba(255,255,255,0.05)] text-[#90a1b9] hover:text-white hover:bg-[rgba(255,255,255,0.1)]"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {displayedTeams.map((team) => {
              const isSelected = selectedTeams.has(team.id);
              return (
                <button
                  key={team.id}
                  onClick={() => toggleTeam(team.id)}
                  className={`group relative flex flex-col items-center gap-3 p-3 sm:p-4 rounded-[16px] sm:rounded-[20px] border transition-all duration-200 ${
                    isSelected
                      ? "bg-[rgba(0,188,125,0.1)] border-[#00bc7d] shadow-[0px_0px_15px_rgba(0,188,125,0.2)]"
                      : "bg-[rgba(0,0,0,0.4)] border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.05)]"
                  }`}
                >
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center p-2">
                    {team.logo_url ? (
                      <Image
                        src={team.logo_url}
                        alt={team.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-[10px] text-[#62748e]">
                        No Image
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-[12px] font-bold text-center leading-tight min-h-[1.5rem] flex items-center ${isSelected ? "text-white" : "text-[#90a1b9] group-hover:text-white transition-colors"}`}
                  >
                    {team.name}
                  </span>

                  <div
                    className={`mt-auto w-full py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-colors text-center ${
                      isSelected
                        ? "bg-[#00bc7d] text-black"
                        : "bg-[rgba(255,255,255,0.05)] text-[#62748e] group-hover:bg-[rgba(255,255,255,0.1)] group-hover:text-white border border-[rgba(255,255,255,0.05)]"
                    }`}
                  >
                    {isSelected ? "팔로잉" : "팔로우"}
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-[#00bc7d] rounded-full flex items-center justify-center">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col w-full gap-4 mt-4">
          <button
            onClick={handleNextStep}
            disabled={isLoading || selectedTeams.size === 0}
            className="w-full h-[56px] bg-[#00bc7d] rounded-[16px] text-black text-[18px] font-black tracking-[-0.44px] shadow-[0px_20px_25px_0px_rgba(0,188,125,0.2),0px_8px_10px_0px_rgba(0,188,125,0.2)] hover:bg-[#00a36c] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-black" />
            ) : (
              <>
                다음 단계
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
