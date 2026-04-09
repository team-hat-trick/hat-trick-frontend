"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useGetStandings } from "../../hooks/useGetStandings";
import { useGetRecord } from "../../hooks/useGetRecord";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useGetCurrentRound } from "../../hooks/useGetCurrentRound";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Star,
  Target,
  TrendingUp,
  Newspaper, // 💡 뉴스 아이콘 추가
} from "lucide-react";
import ko from "dayjs/locale/ko";
import { useGetTopScorers } from "../../hooks/useGetTopScorers";
import { useGetTopAssists } from "../../hooks/useGetTopAssists";
import { useGetTopRating } from "../../hooks/useGetTopRating";
import { useGetLeagueNews } from "../../hooks/useGetLeagueNews";

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
  const leagueName = standings?.response?.[0]?.league?.name;

  const { data: leagueRecord, isLoading: isLoadingRecord } = useGetRecord(
    leagueId,
    season,
  );
  const { data: currentRoundData } = useGetCurrentRound(
    leagueId,
    season,
    localTimezone,
  );
  const { data: topScorersData } = useGetTopScorers(leagueId, season);
  const { data: topAssistsData } = useGetTopAssists(leagueId, season);
  const { data: topRated } = useGetTopRating(leagueId, season);

  const { data: newsData, isLoading: isLoadingNews } =
    useGetLeagueNews(leagueName);

  // 💡 뉴스 기사 데이터 (없을 경우 빈 배열)
  const articles = newsData?.articles || [];

  const topScorers = topScorersData?.response?.slice(0, 5) || [];
  const topAssists = topAssistsData?.response?.slice(0, 5) || [];

  const unifiedTopRated = useMemo(() => {
    return (
      topRated?.map((p: any) => ({
        id: p.player_id,
        name: p.name,
        photo: p.photo,
        team: p.team_name,
        value: parseFloat(p.rating).toFixed(2),
      })) || []
    );
  }, [topRated]);

  const unifiedTopScorers = useMemo(() => {
    return (
      topScorers?.map((p: any) => ({
        id: p.player.id,
        name: p.player.name,
        photo: p.player.photo,
        team: p.statistics[0]?.team.name,
        value: p.statistics[0]?.goals.total || 0,
      })) || []
    );
  }, [topScorers]);

  const unifiedTopAssists = useMemo(() => {
    return (
      topAssists?.map((p: any) => ({
        id: p.player.id,
        name: p.player.name,
        photo: p.player.photo,
        team: p.statistics[0]?.team.name,
        value: p.statistics[0]?.goals.assists || 0,
      })) || []
    );
  }, [topAssists]);

  const renderStatBox = (
    title: string,
    players: any[],
    valueColor: string | ((val: any) => string),
    icon: React.ReactNode,
  ) => {
    if (!players || players.length === 0) {
      return (
        <div className="flex flex-col gap-4 bg-[#13161c]/50 rounded-[24px] p-5 border border-white/5">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
            {icon}
            <span className="text-[#90a1b9] font-bold text-sm">{title}</span>
          </div>
          <div className="text-xs text-white/40 text-center py-8 bg-white/5 rounded-xl border border-white/10 border-dashed">
            데이터를 분석 중입니다.
          </div>
        </div>
      );
    }

    const rank1 = players[0];
    const others = players.slice(1, 5);

    return (
      <div className="flex flex-col h-full bg-[#13161c]/50 rounded-[24px] p-5 border border-white/5 shadow-lg relative overflow-hidden">
        <div className="flex items-center gap-2.5 mb-5 relative z-10">
          <div className="p-1.5 bg-white/5 rounded-lg border border-white/10 shadow-sm">
            {icon}
          </div>
          <span className="text-white font-black text-[15px] tracking-tight">
            {title}
          </span>
        </div>

        <div className="relative flex items-center gap-4 bg-gradient-to-r from-white/[0.08] to-white/[0.01] p-4 rounded-2xl border border-white/10 mb-4 group overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none transition-transform group-hover:scale-110" />

          <div className="relative shrink-0">
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-[#ffb400] to-[#d48c00] text-black font-black text-xs flex items-center justify-center rounded-full z-10 shadow-[0_2px_10px_rgba(255,180,0,0.5)]">
              1
            </div>
            <Image
              src={rank1.photo}
              alt={rank1.name}
              width={64}
              height={64}
              className="w-14 h-14 rounded-full object-cover border-2 border-white/10 bg-[#0f1115] relative z-0 group-hover:scale-105 transition-transform"
            />
          </div>

          <div className="flex flex-col flex-1 min-w-0 justify-center">
            <span className="text-white font-bold text-base truncate leading-tight mb-0.5 drop-shadow-sm">
              {rank1.name}
            </span>
            <span className="text-[#90a1b9] font-medium text-[11px] truncate">
              {rank1.team}
            </span>
          </div>

          <div className="flex flex-col items-end justify-center shrink-0 pl-2">
            <span
              className={`font-black text-2xl tabular-nums tracking-tighter drop-shadow-md ${typeof valueColor === "function" ? valueColor(rank1.value) : valueColor}`}
            >
              {rank1.value}
            </span>
          </div>
        </div>

        <div className="flex flex-col flex-1">
          {others.map((player: any, idx: number) => (
            <div
              key={player.id}
              className="flex items-center gap-4 py-3 px-2 hover:bg-white/[0.03] rounded-xl transition-colors group cursor-pointer border-b border-white/[0.02] last:border-transparent"
            >
              <span className="font-bold text-white/30 w-4 text-center text-xs shrink-0 group-hover:text-white/60 transition-colors">
                {idx + 2}
              </span>

              <Image
                src={player.photo}
                alt={player.name}
                width={40}
                height={40}
                className="w-8 h-8 rounded-full shrink-0 object-cover bg-[#0f1115] border border-white/5"
              />

              <div className="flex flex-col flex-1 min-w-0 justify-center">
                <span className="text-white/80 font-bold text-[13px] truncate group-hover:text-white transition-colors leading-tight mb-0.5">
                  {player.name}
                </span>
                <span className="text-white/40 text-[10px] truncate leading-tight">
                  {player.team}
                </span>
              </div>

              <span
                className={`font-bold text-[15px] tabular-nums shrink-0 pl-2 ${typeof valueColor === "function" ? valueColor(player.value) : valueColor}`}
              >
                {player.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
    const pastMatches = leagueRecord.response.filter((match) => {
      const isTeamMatch =
        match.teams.home.id === teamId || match.teams.away.id === teamId;
      const isPastMatch = match.fixture.timestamp * 1000 <= Date.now();
      return isTeamMatch && isPastMatch;
    });

    return pastMatches
      .filter((item) => item.fixture.status.short === "FT")
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
            let bgColor = "bg-[#90a1b9]";

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
    <div className="flex flex-col w-full pb-8 pt-4 gap-8">
      {/* 🟦 상단 영역: 순위표 & 라운드 일정 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-7 flex flex-col gap-6 w-full">
          <div className="bg-[#0f1115]/80 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-2xl relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#00bc7d]/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="p-4 md:p-8 pb-0 md:pb-0">
              <h2 className="text-xl md:text-2xl font-black mb-4 md:mb-6 flex items-center gap-2 md:gap-3 relative z-10 tracking-tight">
                <span className="w-1.5 h-6 md:h-7 bg-gradient-to-b from-[#00bc7d] to-[#00bc7d]/20 rounded-full shadow-[0_0_15px_rgba(0,188,125,0.8)]"></span>
                리그 순위
              </h2>
            </div>

            <div className="overflow-x-auto relative z-10 px-4 md:px-8 pb-6 md:pb-8 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
              <table className="w-full text-sm text-left whitespace-nowrap min-w-full md:min-w-[650px]">
                <thead className="text-[10px] md:text-[11px] text-[#90a1b9] font-bold border-b border-white/10 uppercase tracking-wider bg-white/[0.02]">
                  <tr>
                    <th className="px-2 md:px-4 py-3 md:py-4 text-center w-8 md:w-12 rounded-tl-xl">#</th>
                    <th className="px-2 md:px-4 py-3 md:py-4">클럽</th>
                    <th className="px-2 md:px-3 py-3 md:py-4 text-center">경기</th>
                    <th className="px-3 py-4 text-center hidden md:table-cell">승</th>
                    <th className="px-3 py-4 text-center hidden md:table-cell">무</th>
                    <th className="px-3 py-4 text-center hidden md:table-cell">패</th>
                    <th className="px-3 py-4 text-center hidden md:table-cell">득실</th>
                    <th className="px-6 py-4 text-center hidden md:table-cell">최근 5경기</th>
                    <th className="px-2 md:px-4 py-3 md:py-4 text-center rounded-tr-xl">승점</th>
                  </tr>
                </thead>
                <tbody>
                  {standingsData.map((row: any, idx: number) => (
                    <tr
                      key={row.team.id}
                      className="border-b border-white/5 hover:bg-white/[0.03] transition-all duration-300 group"
                    >
                      <td className="px-2 md:px-4 py-3 md:py-4 text-center">
                        <span
                          className={`font-black text-sm md:text-base ${idx < 4 ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "text-white/40"}`}
                        >
                          {row.rank}
                        </span>
                      </td>
                      <td className="px-2 md:px-4 py-2 font-bold">
                        <div className="flex items-center gap-2 md:gap-4">
                          <div className="w-7 h-7 md:w-9 md:h-9 shrink-0 bg-white/5 rounded-full flex items-center justify-center p-1 md:p-1.5 border border-white/5 group-hover:scale-110 transition-transform shadow-sm">
                            <Image
                              src={row.team.logo}
                              alt={row.team.name}
                              width={24}
                              height={24}
                              className="w-4 h-4 md:w-6 md:h-6 object-contain shrink-0"
                            />
                          </div>
                          <span className="text-sm md:text-base group-hover:text-white transition-colors text-white/90 truncate max-w-[120px] md:max-w-[200px]">
                            {row.team.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 md:px-3 py-3 md:py-4 text-center text-white/60 font-semibold text-xs md:text-sm">
                        {row.all.played}
                      </td>
                      <td className="px-3 py-4 text-center text-white/60 font-semibold hidden md:table-cell">
                        {row.all.win}
                      </td>
                      <td className="px-3 py-4 text-center text-white/60 font-semibold hidden md:table-cell">
                        {row.all.draw}
                      </td>
                      <td className="px-3 py-4 text-center text-white/60 font-semibold hidden md:table-cell">
                        {row.all.lose}
                      </td>
                      <td className="px-3 py-4 text-center font-bold text-[#90a1b9] hidden md:table-cell">
                        {row.goalsDiff > 0 ? `+${row.goalsDiff}` : row.goalsDiff}
                      </td>
                      <td className="px-4 py-4 text-center hidden md:table-cell">
                        {renderRecentForm(row.team.id)}
                      </td>
                      <td className="px-2 md:px-4 py-3 md:py-4 text-center">
                        <span className="font-black text-base md:text-lg text-[#00bc7d]">
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

        <div className="xl:col-span-5 flex flex-col gap-6 w-full">
          {rounds.length > 0 && (
            <div className="bg-[#0f1115]/80 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-2xl relative overflow-hidden flex flex-col h-full">
              <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#2b7fff]/10 rounded-full blur-[100px] pointer-events-none" />

              <div className="p-4 md:p-8 border-b border-white/5 relative z-50 w-full shrink-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl md:text-2xl font-black flex items-center gap-2 md:gap-3 tracking-tight">
                    <span className="w-1.5 h-6 md:h-7 bg-gradient-to-b from-[#2b7fff] to-[#2b7fff]/20 rounded-full shadow-[0_0_15px_rgba(43,127,255,0.8)]"></span>
                    라운드 일정
                  </h2>

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

              <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-8 py-4 md:py-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
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
                        <div className="flex items-center sticky top-0 z-20 bg-[#0f1115]/95 backdrop-blur-md py-2 -mx-4 px-4 mb-3">
                          <div className="w-1 h-5 bg-[#2b7fff] rounded-full shadow-[0_0_8px_rgba(43,127,255,0.8)] mr-3" />
                          <h3 className="text-base md:text-lg font-black text-white uppercase flex items-center gap-2">
                            {dateStr.split(" ")[0]}
                            <span className="text-[#2b7fff]">
                              {dateStr.split(" ").slice(1).join(" ")}
                            </span>
                          </h3>
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
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                                <div className="flex items-center justify-between w-full relative z-10">
                                  <div className="flex items-center gap-3 w-[35%]">
                                    <Image
                                      src={match.teams.home.logo}
                                      alt={match.teams.home.name}
                                      width={24}
                                      height={24}
                                      className="w-6 h-6 object-contain shrink-0 group-hover:scale-110 transition-transform"
                                    />
                                    <span
                                      className={`font-bold text-sm truncate transition-colors ${match.teams.home.winner === true ? "text-white" : "text-white/70 group-hover:text-white"}`}
                                    >
                                      {match.teams.home.name}
                                    </span>
                                  </div>

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
                                      className="w-6 h-6 object-contain shrink-0 group-hover:scale-110 transition-transform"
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

      {/* 🟨 하단 영역: 리그 주요 기록 */}
      <div className="w-full mt-4">
        {unifiedTopRated.length > 0 ||
        unifiedTopScorers.length > 0 ||
        unifiedTopAssists.length > 0 ? (
          <div className="bg-[#0f1115]/80 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-[800px] h-96 bg-[#ffb400]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="p-4 md:p-8 border-b border-white/5 relative z-10">
              <h2 className="text-xl md:text-2xl font-black flex items-center gap-2 md:gap-3 tracking-tight">
                <span className="w-1.5 h-6 md:h-7 bg-gradient-to-b from-[#ffb400] to-[#ffb400]/20 rounded-full shadow-[0_0_15px_rgba(255,180,0,0.8)]"></span>
                리그 주요 기록
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-8 relative z-10">
              {renderStatBox(
                "최고 평점",
                unifiedTopRated,
                (val: any) => {
                  const num = parseFloat(val);
                  if (num >= 8.0) return "text-[#2b7fff]";
                  if (num >= 7.0) return "text-[#00bc7d]";
                  return "text-[#ffb400]";
                },
                <Star className="w-4 h-4 text-[#ffb400] fill-[#ffb400]" />,
              )}
              {renderStatBox(
                "최다 득점",
                unifiedTopScorers,
                "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]",
                <Target className="w-4 h-4 text-white" />,
              )}
              {renderStatBox(
                "최다 도움",
                unifiedTopAssists,
                "text-[#2b7fff]",
                <TrendingUp className="w-4 h-4 text-[#2b7fff]" />,
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* 📰 최하단 영역: 최신 뉴스 (2x4 그리드 레이아웃) */}
      {articles.length > 0 && (
        <div className="w-full mt-4">
          <div className="bg-[#0f1115]/80 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-2xl relative overflow-hidden">
            {/* 뉴스 섹션 포인트 컬러: 강렬한 레드/오렌지 글로우 */}
            <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-96 bg-[#ff3b30]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="p-4 md:p-8 border-b border-white/5 relative z-10 flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-black flex items-center gap-2 md:gap-3 tracking-tight">
                <span className="w-1.5 h-6 md:h-7 bg-gradient-to-b from-[#ff3b30] to-[#ff3b30]/20 rounded-full shadow-[0_0_15px_rgba(255,59,48,0.8)]"></span>
                관련 최신 뉴스
              </h2>
              <Newspaper className="w-5 h-5 md:w-6 md:h-6 text-white/20" />
            </div>

            <div className="p-4 md:p-8 relative z-10">
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-2 xl:grid-cols-4 md:gap-6 md:overflow-visible md:snap-none md:pb-0 no-scrollbar md:[&::-webkit-scrollbar]:h-2">
                {/* 8개 매핑 */}
                {articles.slice(0, 8).map((article: any) => (
                  <a
                    key={article.id}
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col bg-[#13161c]/50 rounded-[20px] p-4 border border-white/5 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-300 group shadow-lg h-full w-[260px] sm:w-[300px] md:w-auto shrink-0 snap-start"
                  >
                    {/* 💡 썸네일 이미지 영역 */}
                    <div className="relative w-full h-36 mb-4 rounded-xl overflow-hidden shrink-0 bg-black/40 border border-white/5">
                      {article.thumbnail ? (
                        <img
                          src={article.thumbnail}
                          alt={article.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        // 썸네일이 없는 기사를 위한 깔끔한 기본 대체 UI
                        <div className="flex items-center justify-center w-full h-full text-white/10 group-hover:text-white/20 transition-colors">
                          <Newspaper className="w-10 h-10" />
                        </div>
                      )}
                    </div>

                    {/* 뉴스 제목 (썸네일이 생겼으므로 2줄까지만 보여줍니다) */}
                    <h3 className="text-white/90 font-bold text-[14px] leading-snug line-clamp-2 group-hover:text-white transition-colors mb-3">
                      {article.title}
                    </h3>

                    {/* 뉴스 출처 & 작성 시간 */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.02]">
                      <span className="text-[#ff3b30] font-bold text-[11px] px-2 py-1 bg-[#ff3b30]/10 rounded-md">
                        {article.source}
                      </span>
                      <span className="text-[#90a1b9] font-medium text-[11px]">
                        {dayjs(article.pubDate).format("MM.DD HH:mm")}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
