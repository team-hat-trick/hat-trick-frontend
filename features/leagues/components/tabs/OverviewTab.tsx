import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useGetStandings } from "../../hooks/useGetStandings";
import { useGetRecord } from "../../hooks/useGetRecord";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useGetCurrentRound } from "../../hooks/useGetCurrentRound";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import ko from "dayjs/locale/ko";

interface Props {
  leagueId: number;
  season: number;
}

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.locale(ko);

export default function OverviewTab({ leagueId, season }: Props) {
  const localTimezone = dayjs.tz.guess();

  const { data: standings, isLoading: isLoadingStandings } = useGetStandings(
    leagueId,
    season,
  );
  const { data: leagueRecord, isLoading: isLoadingRecord } = useGetRecord(
    leagueId,
    season,
  );
  const { data: currentRoundData } = useGetCurrentRound(
    leagueId,
    season,
    localTimezone,
  );

  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isLoading = isLoadingStandings || isLoadingRecord;

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

  useEffect(() => {
    if (rounds.length > 0 && currentRoundData?.response) {
      const officialRound = currentRoundData.response[0];
      const index = rounds.indexOf(officialRound);
      if (index !== -1) {
        setCurrentRoundIndex(index);
      }
    }
  }, [rounds, currentRoundData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 w-full h-full">
        <div className="w-10 h-10 md:w-14 md:h-14 border-4 border-[#00bc7d]/20 border-t-[#00bc7d] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (
    !standings ||
    !standings.response ||
    standings.response.length === 0 ||
    !leagueRecord ||
    !leagueRecord.response ||
    leagueRecord.response.length === 0
  )
    return (
      <div className="flex items-center justify-center h-full py-10 text-white/50 text-sm font-medium">
        데이터가 없습니다.
      </div>
    );

  const rawStandings = standings.response[0].league.standings;
  const standingsData =
    Array.isArray(rawStandings) && Array.isArray(rawStandings[0])
      ? rawStandings[0]
      : [];

  const teamRecordByLeague = (teamId: number) => {
    // 1. 해당 팀의 경기이면서 현재 시간 이전에 치러진 경기만 필터링 (과거 경기)
    const pastMatches = leagueRecord.response.filter((match) => {
      const isTeamMatch =
        match.teams.home.id === teamId || match.teams.away.id === teamId;
      const isPastMatch = match.fixture.timestamp * 1000 <= Date.now();

      // 경기 결과가 나온 것만 보고 싶다면 상태 추가 필터링 옵션 (ex: && match.fixture.status.short === "FT") 도 가능하지만,
      // 현재 날짜 기준이라면 timestamp가 가장 깔끔합니다.
      return isTeamMatch && isPastMatch;
    });

    // 2. 과거 경기들 중 timestamp 기준 내림차순 (가장 최근 경기가 첫 번째) 정렬 후 5개 추출
    return pastMatches
      .sort((a, b) => b.fixture.timestamp - a.fixture.timestamp)
      .slice(0, 5);
  };

  const renderRecentForm = (teamId: number) => {
    const recentMatches = teamRecordByLeague(teamId);

    return (
      <div className="flex items-center justify-center gap-1">
        {recentMatches
          .map((match) => {
            const isHome = match.teams.home.id === teamId;
            const team = isHome ? match.teams.home : match.teams.away;
            const opponent = isHome ? match.teams.away : match.teams.home;

            let result = "무";
            let bgColor = "bg-[#90a1b9]"; // Draw

            if (team.winner === true) {
              result = "승";
              bgColor = "bg-[#00bc7d]";
            } else if (opponent.winner === true) {
              result = "패";
              bgColor = "bg-[#ff3b30]";
            }

            return (
              <div
                key={match.fixture.id}
                className={`w-10 h-10 md:w-6 md:h-6 flex items-center justify-center rounded-[5px] text-white text-[9px] md:text-[10px] font-bold ${bgColor}`}
                title={`${match.teams.home.name} ${match.goals.home ?? "-"} : ${match.goals.away ?? "-"} ${match.teams.away.name}`}
              >
                {result}
              </div>
            );
          })
          .reverse()}
      </div>
    );
  };

  const handlePrevRound = () => {
    if (currentRoundIndex > 0) setCurrentRoundIndex((prev) => prev - 1);
  };
  const handleNextRound = () => {
    if (currentRoundIndex < rounds.length - 1)
      setCurrentRoundIndex((prev) => prev + 1);
  };

  const currentRoundName = rounds[currentRoundIndex] || "";
  const currentRoundMatches = matchesByRound[currentRoundName] || [];

  return (
    <div className="flex flex-col w-full pb-8 pt-4">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Standings */}
        <div className="xl:col-span-7 flex flex-col gap-6 w-full">
          {/* STANDINGS */}
          <div className="bg-[#0f1115]/80 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-2xl relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#00bc7d]/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="p-6 md:p-8 pb-0">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3 relative z-10 tracking-tight">
                <span className="w-1.5 h-7 bg-gradient-to-b from-[#00bc7d] to-[#00bc7d]/20 rounded-full shadow-[0_0_15px_rgba(0,188,125,0.8)]"></span>
                리그 순위
              </h2>
            </div>

            <div className="overflow-x-auto relative z-10 px-6 md:px-8 pb-8 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
              <table className="w-full text-sm text-left whitespace-nowrap min-w-[650px]">
                <thead className="text-[11px] text-[#90a1b9] font-bold border-b border-white/10 uppercase tracking-wider bg-white/[0.02]">
                  <tr>
                    <th className="px-4 py-4 text-center w-12 rounded-tl-xl">
                      #
                    </th>
                    <th className="px-4 py-4">클럽</th>
                    <th className="px-3 py-4 text-center">경기</th>
                    <th className="px-3 py-4 text-center">승</th>
                    <th className="px-3 py-4 text-center">무</th>
                    <th className="px-3 py-4 text-center">패</th>
                    <th className="px-3 py-4 text-center">득실</th>
                    <th className="px-6 py-4 text-center">최근 5경기</th>
                    <th className="px-4 py-4 text-center rounded-tr-xl">
                      승점
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {standingsData.map((row, idx) => (
                    <tr
                      key={row.team.id}
                      className="border-b border-white/5 hover:bg-white/[0.03] transition-all duration-300 group"
                    >
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`font-black text-base ${idx < 4 ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "text-white/40"}`}
                        >
                          {row.rank}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-bold">
                        <div className="flex items-center gap-4">
                          {/* Logo container with hover effect */}
                          <div className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center p-1.5 border border-white/5 group-hover:scale-110 transition-transform shadow-sm">
                            <Image
                              src={row.team.logo}
                              alt={row.team.name}
                              width={24}
                              height={24}
                              className="object-contain"
                            />
                          </div>
                          <span className="group-hover:text-white transition-colors text-white/90">
                            {row.team.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-center text-white/60 font-semibold">
                        {row.all.played}
                      </td>
                      <td className="px-3 py-4 text-center text-white/60 font-semibold">
                        {row.all.win}
                      </td>
                      <td className="px-3 py-4 text-center text-white/60 font-semibold">
                        {row.all.draw}
                      </td>
                      <td className="px-3 py-4 text-center text-white/60 font-semibold">
                        {row.all.lose}
                      </td>
                      <td className="px-3 py-4 text-center font-bold text-[#90a1b9]">
                        {row.goalsDiff > 0
                          ? `+${row.goalsDiff}`
                          : row.goalsDiff}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {renderRecentForm(row.team.id)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="font-black text-lg text-[#00bc7d]">
                          {row.points}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Round Schedule & Matches */}
        <div className="xl:col-span-5 flex flex-col gap-6 w-full">
          {rounds.length > 0 && (
            <div className="bg-[#0f1115]/80 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-2xl relative overflow-hidden flex flex-col h-full">
              {/* Background Accent */}
              <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#2b7fff]/10 rounded-full blur-[100px] pointer-events-none" />

              <div className="p-6 md:p-8 border-b border-white/5 relative z-50 w-full shrink-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                    <span className="w-1.5 h-7 bg-gradient-to-b from-[#2b7fff] to-[#2b7fff]/20 rounded-full shadow-[0_0_15px_rgba(43,127,255,0.8)]"></span>
                    라운드 일정
                  </h2>

                  {/* 컨트롤러 */}
                  <div
                    className="flex items-center gap-1 bg-black/40 rounded-full p-1 border border-white/10 backdrop-blur-md shadow-inner relative"
                    ref={dropdownRef}
                  >
                    <button
                      onClick={handlePrevRound}
                      disabled={currentRoundIndex === 0}
                      className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-[#90a1b9] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-1.5 px-3 min-w-[85px] justify-center hover:bg-white/5 rounded-full py-1.5 transition-colors group"
                    >
                      <span className="text-[13px] font-black text-white tracking-wider group-hover:text-[#2b7fff] transition-colors">
                        {currentRoundName.replace(
                          "Regular Season - ",
                          "라운드 ",
                        )}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-white/50 group-hover:text-[#2b7fff] transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <button
                      onClick={handleNextRound}
                      disabled={currentRoundIndex === rounds.length - 1}
                      className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-[#90a1b9] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 max-h-60 overflow-y-auto bg-[#1a1d24] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 p-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                        {rounds.map((roundName, idx) => (
                          <button
                            key={roundName}
                            onClick={() => {
                              setCurrentRoundIndex(idx);
                              setIsDropdownOpen(false);
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

              {/* Added flex-1 and min-h-0 to perfectly constraint height to the sibling grid column */}
              <div className="flex-1 min-h-0 overflow-y-auto p-6 md:p-8 py-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                {(() => {
                  const groupedByDate = currentRoundMatches.reduce(
                    (acc: any, match: any) => {
                      const dateStr = dayjs(match.fixture.date).format(
                        "YYYY. MM. DD (ddd)",
                      );
                      if (!acc[dateStr]) acc[dateStr] = [];
                      acc[dateStr].push(match);
                      return acc;
                    },
                    {},
                  );

                  return Object.entries(groupedByDate).map(
                    ([dateStr, matches]: [string, any]) => (
                      <div
                        key={dateStr}
                        className="flex flex-col gap-3 mb-8 last:mb-0"
                      >
                        {/* Date Section Header */}
                        <div className="flex items-center sticky top-0 z-20 bg-[#0f1115]/95 backdrop-blur-md py-2 -mx-4 px-4 mb-3">
                          {/* 왼쪽 포인트 바 */}
                          <div className="w-1 h-5 bg-[#2b7fff] rounded-full shadow-[0_0_8px_rgba(43,127,255,0.8)] mr-3" />

                          {/* 날짜 텍스트 */}
                          <h3 className="text-base md:text-lg font-black text-white uppercase flex items-center gap-2">
                            {dateStr.split(" ")[0]} {/* 연도 */}
                            <span className="text-[#2b7fff]">
                              {dateStr.split(" ").slice(1).join(" ")}
                            </span>{" "}
                            {/* 월/일 (요일) */}
                          </h3>

                          {/* 구분선 */}
                          <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent ml-4" />
                        </div>

                        <div className="flex flex-col gap-2.5">
                          {matches.map((match: any) => {
                            const isFinished =
                              match.fixture.status.short === "FT" ||
                              match.fixture.status.short === "AET" ||
                              match.fixture.status.short === "PEN";

                            return (
                              <div
                                key={match.fixture.id}
                                className="group flex flex-col py-3 px-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 shadow-sm relative overflow-hidden"
                              >
                                {/* Subtly highlight finished matches on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                                <div className="flex items-center justify-between w-full relative z-10">
                                  {/* Home Team */}
                                  <div className="flex items-center gap-3 w-[35%]">
                                    <Image
                                      src={match.teams.home.logo}
                                      alt={match.teams.home.name}
                                      width={18}
                                      height={18}
                                      className="object-contain shrink-0 group-hover:scale-110 transition-transform"
                                    />
                                    <span
                                      className={`font-bold text-sm truncate transition-colors ${match.teams.home.winner === true ? "text-white" : "text-white/70 group-hover:text-white"}`}
                                    >
                                      {match.teams.home.name}
                                    </span>
                                  </div>

                                  {/* Center Status / Score */}
                                  <div className="flex flex-col items-center justify-center w-[30%] shrink-0">
                                    {isFinished ? (
                                      <div className="flex flex-col items-center gap-1">
                                        <div className="flex items-center gap-2 text-2xl font-black tabular-nums tracking-tighter">
                                          <span
                                            className={
                                              match.teams.home.winner
                                                ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                                                : "text-white/40"
                                            }
                                          >
                                            {match.goals.home}
                                          </span>
                                          <span className="text-white/10 text-base font-medium">
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
                                        <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest leading-none">
                                          {match.fixture.status.short}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-sm md:text-base font-black text-white px-3 py-1 bg-white/5 rounded-lg tracking-tight tabular-nums border border-white/5">
                                        {dayjs(match.fixture.date).format(
                                          "HH:mm",
                                        )}
                                      </span>
                                    )}
                                  </div>

                                  {/* Away Team */}
                                  <div className="flex items-center justify-end gap-3 w-[35%] text-right">
                                    <span
                                      className={`font-bold text-sm truncate transition-colors ${match.teams.away.winner === true ? "text-white" : "text-white/70 group-hover:text-white"}`}
                                    >
                                      {match.teams.away.name}
                                    </span>
                                    <Image
                                      src={match.teams.away.logo}
                                      alt={match.teams.away.name}
                                      width={24}
                                      height={24}
                                      className="object-contain shrink-0 group-hover:scale-110 transition-transform"
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ),
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
