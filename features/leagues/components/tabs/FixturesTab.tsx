"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import ko from "dayjs/locale/ko";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

import { useGetCurrentRound } from "../../hooks/useGetCurrentRound";
import { useGetTeamsByLeague } from "../../hooks/useGetTeamsByLeague";
import { useGetRecord } from "../../hooks/useGetRecord";

interface Props {
  leagueId: number;
  season: number;
}

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(ko);

const FixturesTab = ({ leagueId, season }: Props) => {
  const localTimezone = dayjs.tz.guess();

  const { data: currentRoundData } = useGetCurrentRound(
    leagueId,
    season,
    localTimezone,
  );
  const { data: teamsData } = useGetTeamsByLeague(leagueId, season);
  const { data: leagueRecord, isLoading: isLoadingRecord } = useGetRecord(
    leagueId,
    season,
  );

  const [viewMode, setViewMode] = useState<"round" | "team">("round");
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [isRoundDropdownOpen, setIsRoundDropdownOpen] = useState(false);
  const roundDropdownRef = useRef<HTMLDivElement>(null);

  const [currentTeamPageIndex, setCurrentTeamPageIndex] = useState<number>(0);
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const teamDropdownRef = useRef<HTMLDivElement>(null);

  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  // Set first team as default when loaded
  useEffect(() => {
    if (teamsData?.response?.length && !selectedTeamId) {
      setSelectedTeamId(teamsData.response[0].team.id);
    }
  }, [teamsData, selectedTeamId]);

  // Dropdown click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        roundDropdownRef.current &&
        !roundDropdownRef.current.contains(event.target as Node)
      ) {
        setIsRoundDropdownOpen(false);
      }
      if (
        teamDropdownRef.current &&
        !teamDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTeamDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Process rounds data
  const { rounds, matchesByRound } = useMemo(() => {
    if (!leagueRecord?.response) return { rounds: [], matchesByRound: {} };

    const matches = leagueRecord.response;
    const grouped: Record<string, any[]> = {};
    const roundSet = new Set<string>();

    matches.forEach((match: any) => {
      const round = match.league.round;
      roundSet.add(round);
      if (!grouped[round]) grouped[round] = [];
      grouped[round].push(match);
    });

    const sortedRounds = Array.from(roundSet).sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || "0");
      const numB = parseInt(b.match(/\d+/)?.[0] || "0");
      return numA - numB;
    });

    return { rounds: sortedRounds, matchesByRound: grouped };
  }, [leagueRecord]);

  // Set initial current round (Find closest match by timestamp)
  useEffect(() => {
    if (rounds.length > 0 && leagueRecord?.response) {
      const now = Date.now();
      let closestRoundObj = rounds[0];
      let minDiff = Infinity;

      leagueRecord.response.forEach((match: any) => {
        const diff = Math.abs(match.fixture.timestamp * 1000 - now);
        if (diff < minDiff) {
          minDiff = diff;
          closestRoundObj = match.league.round;
        }
      });

      const index = rounds.indexOf(closestRoundObj);
      if (index !== -1) {
        setCurrentRoundIndex(index);
      }
    }
  }, [rounds, leagueRecord]);

  const handlePrevRound = () => {
    if (currentRoundIndex > 0) setCurrentRoundIndex((prev) => prev - 1);
  };
  const handleNextRound = () => {
    if (currentRoundIndex < rounds.length - 1)
      setCurrentRoundIndex((prev) => prev + 1);
  };

  const currentRoundName = rounds[currentRoundIndex] || "";
  const currentRoundMatches = matchesByRound[currentRoundName] || [];

  // Process team matches with simple pagination (Chunks of 5, chronological)
  const { teamPages, initialTeamPageIndex } = useMemo(() => {
    if (!leagueRecord?.response || !selectedTeamId) return { teamPages: [], initialTeamPageIndex: 0 };
    
    // 1. All matches for team, sorted chronologically (ascending)
    const teamMatches = leagueRecord.response
      .filter((match: any) => 
        match.teams.home.id === selectedTeamId || 
        match.teams.away.id === selectedTeamId
      )
      .sort((a: any, b: any) => a.fixture.timestamp - b.fixture.timestamp); // 먼저 끝난 경기(과거)가 위에

    // 2. Find the index of the match closest to current date
    const now = Date.now();
    let closestIndex = 0;
    let minDiff = Infinity;

    teamMatches.forEach((match: any, index: number) => {
      const diff = Math.abs(match.fixture.timestamp * 1000 - now);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = index;
      }
    });

    // 3. Chunk into pages of 5 matches
    const pages: any[][] = [];
    for (let i = 0; i < teamMatches.length; i += 5) {
      pages.push(teamMatches.slice(i, i + 5));
    }

    // Default page index corresponds to the chunk containing the closest match
    const defaultPage = Math.max(0, Math.floor(closestIndex / 5));

    return { teamPages: pages, initialTeamPageIndex: defaultPage };
  }, [leagueRecord, selectedTeamId]);

  // Reset page index when team changes
  useEffect(() => {
    setCurrentTeamPageIndex(initialTeamPageIndex);
  }, [selectedTeamId, initialTeamPageIndex]);

  const renderMatchCard = (match: any, mode: "round" | "team") => {
    const isFinished =
      match.fixture.status.short === "FT" ||
      match.fixture.status.short === "AET" ||
      match.fixture.status.short === "PEN";

    const dateDisplay = mode === "team" ? dayjs(match.fixture.date).format("MM.DD") : "";
    const timeDisplay = dayjs(match.fixture.date).format("HH:mm");

    return (
      <div
        key={match.fixture.id}
        className="group flex flex-col py-2 md:py-3 px-3 md:px-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 shadow-sm relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

        <div className="flex items-center justify-between w-full relative z-10">
          <div className="flex items-center gap-1.5 md:gap-3 w-[35%]">
            <Image
              src={match.teams.home.logo}
              alt={match.teams.home.name}
              width={24}
              height={24}
              className="w-5 h-5 md:w-6 md:h-6 object-contain shrink-0 group-hover:scale-110 transition-transform"
            />
            <span
              className={`font-bold text-[11px] md:text-sm truncate transition-colors ${match.teams.home.winner === true ? "text-white" : "text-white/70 group-hover:text-white"}`}
            >
              {match.teams.home.name}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center w-[30%] shrink-0 gap-0.5">
            {mode === "team" && (
              <span className="text-[9px] md:text-[10px] text-white/40 font-bold mb-0.5">{dateDisplay}</span>
            )}
            {isFinished ? (
              <div className="flex flex-col items-center gap-0.5">
                <div className="flex items-center gap-1.5 md:gap-2 text-lg md:text-2xl font-black tabular-nums tracking-tighter">
                  <span
                    className={
                      match.teams.home.winner
                        ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                        : "text-white/40"
                    }
                  >
                    {match.goals.home}
                  </span>
                  <span className="text-white/10 text-sm md:text-base font-medium">
                    -
                  </span>
                  <span
                    className={
                      match.teams.away.winner
                        ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                        : "text-white/40"
                    }
                  >
                    {match.goals.away}
                  </span>
                </div>
                <span className="text-[8px] md:text-[9px] font-bold text-white/30 uppercase tracking-widest leading-none">
                  {match.fixture.status.short}
                </span>
              </div>
            ) : (
              <span className="text-[11px] md:text-sm font-black text-white px-2 md:px-3 py-0.5 md:py-1 bg-white/5 rounded-lg tracking-tight tabular-nums border border-white/5">
                {timeDisplay}
              </span>
            )}
          </div>

          <div className="flex items-center justify-end gap-1.5 md:gap-3 w-[35%] text-right">
            <span
              className={`font-bold text-[11px] md:text-sm truncate transition-colors ${match.teams.away.winner === true ? "text-white" : "text-white/70 group-hover:text-white"}`}
            >
              {match.teams.away.name}
            </span>
            <Image
              src={match.teams.away.logo}
              alt={match.teams.away.name}
              width={24}
              height={24}
              className="w-5 h-5 md:w-6 md:h-6 object-contain shrink-0 group-hover:scale-110 transition-transform"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderMatchList = (matches: any[], mode: "round" | "team") => {
    const grouped = matches.reduce((acc: any, match: any) => {
      const key = mode === "round" 
         ? dayjs(match.fixture.date).format("YYYY. MM. DD (ddd)")
         : dayjs(match.fixture.date).format("YYYY년 M월");
      if (!acc[key]) acc[key] = [];
      acc[key].push(match);
      return acc;
    }, {});

    return Object.entries(grouped).map(([keyStr, dMatches]: [string, any]) => (
      <div key={keyStr} className="flex flex-col gap-3 mb-8 last:mb-0">
        <div className="flex items-center sticky top-0 z-20 bg-[#0f1115]/95 backdrop-blur-md py-2 -mx-4 px-4 mb-3">
          <div className="w-1 h-5 bg-[#2b7fff] rounded-full shadow-[0_0_8px_rgba(43,127,255,0.8)] mr-3" />
          <h3 className="text-base md:text-lg font-black text-white uppercase flex items-center gap-2">
            {mode === "round" ? (
              <>
                {keyStr.split(" ")[0]}
                <span className="text-[#2b7fff]">
                  {keyStr.split(" ").slice(1).join(" ")}
                </span>
              </>
            ) : (
              <span>{keyStr}</span>
            )}
          </h3>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent ml-4" />
        </div>
        <div className="flex flex-col gap-2">
          {dMatches.map((m: any) => renderMatchCard(m, mode))}
        </div>
      </div>
    ));
  };

  if (isLoadingRecord) {
    return (
      <div className="flex items-center justify-center py-24 w-full h-full">
        <div className="w-8 h-8 md:w-12 md:h-12 border-4 border-[#2b7fff]/20 border-t-[#2b7fff] rounded-full animate-spin" />
      </div>
    );
  }

  if (!leagueRecord?.response?.length) {
    return (
      <div className="flex items-center justify-center py-20 text-white/50 text-sm">
        일정 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full py-4">
      {/* 탭 버튼 영역 */}
      <div className="flex items-center gap-2 bg-[#0f1115]/80 p-1.5 rounded-2xl w-max border border-white/10 mx-auto xl:mx-0">
        <button
          onClick={() => setViewMode("round")}
          className={`px-5 py-2.5 rounded-xl text-sm md:text-base font-bold transition-all ${viewMode === "round" ? "bg-[#2b7fff] text-white shadow-[0_0_15px_rgba(43,127,255,0.4)]" : "text-white/50 hover:text-white"}`}
        >
          라운드별
        </button>
        <button
          onClick={() => setViewMode("team")}
          className={`px-5 py-2.5 rounded-xl text-sm md:text-base font-bold transition-all ${viewMode === "team" ? "bg-[#2b7fff] text-white shadow-[0_0_15px_rgba(43,127,255,0.4)]" : "text-white/50 hover:text-white"}`}
        >
          팀별
        </button>
      </div>

      <div className="bg-[#0f1115]/80 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-2xl relative overflow-hidden flex flex-col min-h-[500px]">
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#2b7fff]/10 rounded-full blur-[100px] pointer-events-none" />

        {viewMode === "round" ? (
          <>
            <div className="p-4 md:p-6 border-b border-white/5 relative z-50 w-full shrink-0">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base md:text-xl font-black flex items-center gap-2 tracking-tight shrink-0">
                  <span className="w-1.5 h-5 md:h-6 bg-gradient-to-b from-[#2b7fff] to-[#2b7fff]/20 rounded-full shadow-[0_0_15px_rgba(43,127,255,0.8)]"></span>
                  라운드별 일정
                </h2>

                <div
                  className="flex items-center gap-0.5 md:gap-1 bg-black/40 rounded-full p-0.5 md:p-1 border border-white/10 backdrop-blur-md shadow-inner relative"
                  ref={roundDropdownRef}
                >
                  <button
                    onClick={handlePrevRound}
                    disabled={currentRoundIndex === 0}
                    className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-[#90a1b9] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 md:w-5 md:h-5" />
                  </button>
                  <button
                    onClick={() => setIsRoundDropdownOpen(!isRoundDropdownOpen)}
                    className="flex items-center gap-1 px-2 md:px-3 min-w-[72px] md:min-w-[85px] justify-center hover:bg-white/5 rounded-full py-1 md:py-1.5 transition-colors group"
                  >
                    <span className="text-[11px] md:text-[13px] font-black text-white tracking-wider group-hover:text-[#2b7fff] transition-colors">
                      {currentRoundName.replace("Regular Season - ", "라운드 ")}
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 md:w-3.5 md:h-3.5 text-white/50 group-hover:text-[#2b7fff] transition-transform ${isRoundDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <button
                    onClick={handleNextRound}
                    disabled={currentRoundIndex === rounds.length - 1}
                    className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-[#90a1b9] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronRight className="w-3.5 h-3.5 md:w-5 md:h-5" />
                  </button>

                  {isRoundDropdownOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 max-h-60 overflow-y-auto bg-[#1a1d24] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 p-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                      {rounds.map((roundName, idx) => (
                        <button
                          key={roundName}
                          onClick={() => {
                            setCurrentRoundIndex(idx);
                            setIsRoundDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${currentRoundIndex === idx ? "bg-[#2b7fff]/20 text-[#2b7fff]" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
                        >
                          {roundName.replace("Regular Season - ", "라운드 ")}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-8 py-4 md:py-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
              {rounds.length > 0 ? renderMatchList(currentRoundMatches, "round") : null}
            </div>
          </>
        ) : (
          <>
            <div className="p-4 md:p-6 border-b border-white/5 relative z-40 w-full shrink-0 flex flex-col gap-4">
              <div className="flex overflow-x-auto gap-2 pb-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 snap-x">
                {teamsData?.response?.map((t: any) => (
                  <button
                    key={t.team.id}
                    onClick={() => setSelectedTeamId(t.team.id)}
                    className={`flex flex-col items-center justify-center gap-2 p-2 w-20 rounded-2xl transition-all shrink-0 snap-start border ${selectedTeamId === t.team.id ? "bg-white/10 border-[#2b7fff] shadow-[0_0_15px_rgba(43,127,255,0.2)]" : "border-transparent opacity-60 hover:opacity-100 hover:bg-white/5"}`}
                  >
                    <Image src={t.team.logo} alt={t.team.name} width={40} height={40} className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-lg" />
                    <span className="text-[10px] md:text-xs font-bold w-full truncate text-center text-white/90">
                      {t.team.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-8 py-4 md:py-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
              {teamPages.length > 0 && teamPages[currentTeamPageIndex] ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#90a1b9] font-bold text-sm md:text-base opacity-0">
                      팀별 일정
                    </h3>
                    <div
                      className="flex items-center gap-0.5 bg-black/40 rounded-full p-0.5 md:p-1 border border-white/10 backdrop-blur-md shadow-inner"
                    >
                      <button
                        onClick={() => setCurrentTeamPageIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentTeamPageIndex === 0}
                        className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-[#90a1b9] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      
                      <div className="w-[1px] h-4 bg-white/10 mx-1" />
                      
                      <button
                        onClick={() => setCurrentTeamPageIndex(prev => Math.min(teamPages.length - 1, prev + 1))}
                        disabled={currentTeamPageIndex === teamPages.length - 1}
                        className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-[#90a1b9] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                  {renderMatchList(teamPages[currentTeamPageIndex], "team")}
                </>
              ) : (
                <div className="text-center text-white/40 py-10 text-sm">경기 일정이 없습니다.</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FixturesTab;
