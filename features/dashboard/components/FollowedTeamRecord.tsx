import { ChevronDown, Star, Activity } from "lucide-react";
import { useGetRecord } from "../hooks/useGetRecord";
import { ApiResponse, FixtureList } from "../types/dashboard";
import { useEffect, useRef, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/utils/supabase/client";
import { Team } from "@/features/onboarding/types";
import { useClickOutside } from "@/lib/hooks/useClickOutside";

interface Props {
  teamIds: number[];
}

const FollowedTeamRecord = ({ teamIds }: Props) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => {
    if (dropdownRef) setIsDropdownOpen(false);
  });

  const results = useGetRecord(teamIds);
  const recordData = results.reduce((acc, result) => {
    const data = result.data as ApiResponse<FixtureList[]>;

    if (data?.response) {
      return [...acc, ...data.response];
    }
    return acc;
  }, [] as FixtureList[]);

  useEffect(() => {
    const fetchFollowedTeams = async () => {
      if (teamIds.length === 0) return;

      const supabase = createBrowserSupabaseClient();

      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .in("id", teamIds);

      if (error) {
        console.error("팔로잉 팀 불러오기 실패");
        return;
      }

      if (data) {
        setTeams(data as Team[]);

        if (data.length > 0) {
          setSelectedTeam(data[0]);
        }
      }
    };

    fetchFollowedTeams();
  }, [teamIds]);

  console.log(teams);

  const filteredRecord = recordData
    .filter(
      (item) =>
        item.teams.home.id === selectedTeam?.id ||
        item.teams.away.id === selectedTeam?.id
    )
    .sort((a, b) => new Date(b.fixture.date).getTime() - new Date(a.fixture.date).getTime());

  const getMatchResult = (match: FixtureList, teamId: number) => {
    const isHome = match.teams.home.id === teamId;
    const homeScore = match.score.fulltime.home ?? 0;
    const awayScore = match.score.fulltime.away ?? 0;
    
    if (homeScore === awayScore) {
      return { type: "D", bg: "bg-[#45556c]", text: "text-white" };
    }
    
    const isWin = isHome ? homeScore > awayScore : awayScore > homeScore;
    return isWin
      ? { type: "W", bg: "bg-[#00bc7d]", text: "text-black" }
      : { type: "L", bg: "bg-[#fb2c36]", text: "text-white" };
  };

  const isLoading = results.some((r) => r.isLoading);

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Header */}
      <div className="w-full flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#00bc7d] to-[#00a36c] flex items-center justify-center p-1 shadow-[0_0_10px_rgba(0,188,125,0.4)]">
            <Star className="w-4 h-4 text-black" fill="currentColor" />
          </div>
          <span className="text-white font-black tracking-tight text-sm">최근 전적</span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[#f8fafc] text-xs font-bold hover:bg-white/10 transition-colors justify-between shadow-sm"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="flex items-center gap-1.5">
              {selectedTeam?.name || "팀 선택"}
            </div>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full mt-2 right-0 w-[140px] bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => {
                    setSelectedTeam(team);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-xs font-bold transition-colors hover:bg-white/5 ${
                    selectedTeam?.id === team.id ? "text-[#00bc7d] bg-[#00bc7d]/5" : "text-[#cad5e2]"
                  }`}
                >
                  {team.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-2 border-[#00bc7d] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredRecord.length > 0 && selectedTeam ? (
          <>
            {/* Form Indicators (Recent 5 Matches) */}
            <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-xl p-3">
              <span className="text-[10px] font-black text-[#62748e] tracking-widest uppercase">5경기</span>
              <div className="flex items-center gap-1.5">
                {filteredRecord.slice(0, 5).map((match, idx) => {
                  const res = getMatchResult(match, selectedTeam.id);
                  return (
                    <div
                      key={`${match.fixture.id}-${idx}`}
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${res.bg} ${res.text} shadow-sm`}
                      title={`${match.teams.home.name} vs ${match.teams.away.name}`}
                    >
                      {res.type}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Match List */}
            <div className="flex flex-col gap-2">
              {filteredRecord.slice(0, 5).map((match) => {
                const isHomeSelected = match.teams.home.id === selectedTeam.id;
                const homeScore = match.score.fulltime.home ?? 0;
                const awayScore = match.score.fulltime.away ?? 0;
                const res = getMatchResult(match, selectedTeam.id);

                return (
                  <div key={match.fixture.id} className="group relative flex items-center justify-between p-2.5 rounded-[14px] bg-gradient-to-r from-[rgba(255,255,255,0.02)] to-transparent border border-white/5 hover:border-white/10 transition-all mb-1 overflow-hidden">
                    {/* Left border indicator based on result */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${res.bg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                    
                    {/* Home Team */}
                    <div className="flex items-center gap-2 flex-1 justify-end min-w-0 pr-2">
                      <span className={`text-xs font-bold truncate max-w-[70px] ${isHomeSelected ? "text-white" : "text-[#62748e]"}`}>
                        {match.teams.home.name}
                      </span>
                      <img src={match.teams.home.logo} alt="" className="w-5 h-5 object-contain shrink-0 drop-shadow-md" />
                    </div>

                    {/* Score */}
                    <div className="px-2 shrink-0 flex items-center justify-center bg-white/5 rounded-lg py-1 border border-white/5 min-w-[50px]">
                      <span className={`text-sm font-black italic tracking-tighter ${res.text === "text-black" ? "text-[#00bc7d]" : "text-white"}`}>
                        {homeScore} <span className="text-white/30 px-0.5">-</span> {awayScore}
                      </span>
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center gap-2 flex-1 justify-start min-w-0 pl-2">
                      <img src={match.teams.away.logo} alt="" className="w-5 h-5 object-contain shrink-0 drop-shadow-md" />
                      <span className={`text-xs font-bold truncate max-w-[70px] ${!isHomeSelected ? "text-white" : "text-[#62748e]"}`}>
                        {match.teams.away.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 opacity-50">
            <Activity className="w-8 h-8 text-[#62748e] mb-2" />
            <p className="text-xs font-bold text-[#62748e]">최근 경기 기록이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowedTeamRecord;
