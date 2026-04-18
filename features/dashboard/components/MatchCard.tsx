import React from "react";
import Image from "next/image";
import { Bell, MonitorPlay } from "lucide-react";
import { FixtureList } from "../types/dashboard";
import dayjs from "dayjs";
import { useGetHeadToHead } from "../hooks/useGetHeadToHead";
import { TWO_LEGGED_TOURNAMENT_IDS } from "../constants";

interface MatchCardProps {
  leagueId: number;
  season: number;
  match: FixtureList;
}

export function MatchCard({ leagueId, season, match }: MatchCardProps) {
  const shortStatus = match.fixture.status.short;
  const isLive = [
    "1H",
    "2H",
    "HT",
    "ET",
    "BT",
    "P",
    "SUSP",
    "INT",
    "LIVE",
  ].includes(shortStatus);
  const isEnd = ["FT", "AET", "PEN"].includes(shortStatus);
  const isScheduled = ["NS", "TBD"].includes(shortStatus);
  const isPostponed = ["PST", "CANC", "ABD", "AWD", "WO"].includes(shortStatus);

  // 💡 1. 2차전이 존재하는 유럽 대항전(챔스, 유로파, 컨퍼런스) 판별
  const isTwoLeggedTournament = TWO_LEGGED_TOURNAMENT_IDS.includes(leagueId);
  const roundString = match.league.round || "";
  const isKnockoutPhase =
    !roundString.includes("Group") && !roundString.includes("Final");

  // 💡 2. 똑똑한 조건부 페칭 (유럽 대항전 토너먼트일 때만 API 호출)
  const h2h = `${match.teams.home.id}-${match.teams.away.id}`;
  const { data: h2hData } = useGetHeadToHead(
    h2h,
    leagueId,
    season,
    undefined,
    isTwoLeggedTournament && isKnockoutPhase,
  );

  let aggregateScoreText: string | null = null;
  let isAggHomeLoser = false;
  let isAggAwayLoser = false;

  // 💡 3. 스마트 인덱싱을 활용한 1차전 스코어 추적 및 합산
  if (h2hData?.response && h2hData.response.length >= 2) {
    const sortedMatches = [...h2hData.response].sort(
      (a, b) => a.fixture.timestamp - b.fixture.timestamp,
    );
    const currentIndex = sortedMatches.findIndex(
      (m) => m.fixture.id === match.fixture.id,
    );

    if (currentIndex > 0) {
      const firstLeg = sortedMatches[currentIndex - 1]; // 무조건 직전 경기가 1차전!

      if (["FT", "AET", "PEN"].includes(firstLeg.fixture.status.short)) {
        const firstLegHomeGoals = firstLeg.goals.home ?? 0;
        const firstLegAwayGoals = firstLeg.goals.away ?? 0;

        let totalHomeGoals = match.goals.home ?? 0;
        let totalAwayGoals = match.goals.away ?? 0;

        if (firstLeg.teams.home.id === match.teams.home.id) {
          totalHomeGoals += firstLegHomeGoals;
          totalAwayGoals += firstLegAwayGoals;
        } else {
          totalHomeGoals += firstLegAwayGoals;
          totalAwayGoals += firstLegHomeGoals;
        }

        aggregateScoreText = `AGG ${totalHomeGoals} - ${totalAwayGoals}`;

        if (totalHomeGoals > totalAwayGoals) {
          isAggAwayLoser = true;
        } else if (totalHomeGoals < totalAwayGoals) {
          isAggHomeLoser = true;
        } else if (["FT", "AET", "PEN"].includes(match.fixture.status.short)) {
          if (match.teams.home.winner === false) isAggHomeLoser = true;
          if (match.teams.away.winner === false) isAggAwayLoser = true;
        }
      }
    }
  }

  const homeWinner = match.teams.home.winner;
  const awayWinner = match.teams.away.winner;
  const kickoffTime = dayjs(match.fixture.date).format("HH:mm");

  return (
    <div
      className={`group relative flex-col sm:flex-row flex w-full bg-[#0a0a0a] border border-white/5 rounded-xl sm:rounded-2xl hover:border-[#00bc7d]/30 transition-all duration-300 cursor-pointer overflow-hidden ${isPostponed ? "opacity-50" : "opacity-100"}`}
    >
      {/* 1) DESKTOP LAYOUT */}
      <div className="hidden sm:flex items-center w-full min-h-[110px] p-5 gap-4 relative">
        {isLive && (
          <>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#00bc7d] rounded-r-full shadow-[0_0_15px_#00bc7d]" />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center">
              <span className="text-[#00bc7d] font-black text-sm animate-pulse tracking-tight">
                {shortStatus === "HT" ? (
                  "HT"
                ) : (
                  <>
                    {match.fixture.status.elapsed}
                    {match.fixture.status.extra
                      ? `+${match.fixture.status.extra}`
                      : ""}
                    &apos;
                  </>
                )}
              </span>
            </div>
          </>
        )}

        <div
          className={`flex items-center gap-4 flex-1 justify-end min-w-0 ${isLive ? "pl-16" : ""}`}
        >
          <span
            className={`font-bold text-base truncate transition-colors ${aggregateScoreText && isAggHomeLoser ? "line-through text-[#62748e]" : (aggregateScoreText && isAggAwayLoser) || homeWinner ? "text-white" : "text-[#cad5e2]/60 group-hover:text-[#cad5e2]"}`}
          >
            {match.teams.home.name}
          </span>
          <div className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center p-2 border border-white/10 shrink-0">
            <Image
              src={match.teams.home.logo}
              width={28}
              height={28}
              alt=""
              className="w-[28px] h-[28px] object-contain"
              unoptimized
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-[120px] shrink-0 bg-white/[0.02] rounded-xl py-2 px-1 border border-white/[0.05]">
          <div className="flex items-center gap-3">
            {isLive || isEnd ? (
              <>
                <span
                  className={`text-2xl font-black italic tracking-tighter ${homeWinner ? "text-[#00bc7d]" : "text-white"}`}
                >
                  {match.goals.home ?? "-"}
                </span>
                <span className="text-white/20 font-bold text-base">-</span>
                <span
                  className={`text-2xl font-black italic tracking-tighter ${awayWinner ? "text-[#00bc7d]" : "text-white"}`}
                >
                  {match.goals.away ?? "-"}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-white tracking-tight">
                {kickoffTime}
              </span>
            )}
          </div>

          {aggregateScoreText && (
            <span className="text-[10px] text-[#00bc7d] font-bold uppercase tracking-widest mt-0.5">
              {aggregateScoreText}
            </span>
          )}

          <div className="mt-1">
            {isLive ? (
              <span className="flex items-center gap-1.5 text-[9px] text-[#fb2c36] font-black uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-[#fb2c36] rounded-full animate-pulse" />
                {shortStatus === "HT" ? "HT" : "Live"}
              </span>
            ) : (
              <span className="text-xs text-[#62748e] font-bold uppercase tracking-widest">
                {isEnd ? "경기 종료" : isPostponed ? "연기됨" : "경기 예정"}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 flex-1 justify-start min-w-0">
          <div className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center p-2 border border-white/10 shrink-0">
            <Image
              src={match.teams.away.logo}
              width={28}
              height={28}
              alt=""
              className="w-[28px] h-[28px] object-contain"
              unoptimized
            />
          </div>
          <span
            className={`font-bold text-base truncate transition-colors ${aggregateScoreText && isAggAwayLoser ? "line-through text-[#62748e]" : (aggregateScoreText && isAggHomeLoser) || awayWinner ? "text-white" : "text-[#cad5e2]/60 group-hover:text-[#cad5e2]"}`}
          >
            {match.teams.away.name}
          </span>
        </div>

        <button className="ml-2 p-2.5 bg-white/5 hover:bg-[#00bc7d]/10 rounded-xl transition-colors group/bell shrink-0">
          <Bell className="w-4 h-4 text-[#62748e] group-hover/bell:text-[#00bc7d]" />
        </button>
      </div>

      {/* 2) MOBILE LAYOUT */}
      <div className="flex sm:hidden flex-col w-full p-4 gap-3 relative">
        {isLive && (
          <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#00bc7d] rounded-r-md shadow-[0_0_15px_#00bc7d]" />
        )}
        <div
          className={`flex items-center justify-between pb-2 border-b border-white/5 ${isLive ? "pl-2" : ""}`}
        >
          <span className="text-[10px] text-[#62748e] font-bold tracking-widest uppercase">
            {isLive ? (
              <span className="flex items-center gap-1.5 text-[#fb2c36] animate-pulse">
                <span className="w-1.5 h-1.5 bg-[#fb2c36] rounded-full" />
                {shortStatus === "HT" ? "HT" : "Live"}
              </span>
            ) : isEnd ? (
              "경기 종료"
            ) : isPostponed ? (
              "연기됨"
            ) : (
              kickoffTime
            )}
          </span>
          {isLive && (
            <span className="text-[#00bc7d] font-black text-[11px] animate-pulse">
              {shortStatus === "HT"
                ? "HT"
                : `${match.fixture.status.elapsed}${match.fixture.status.extra ? `+${match.fixture.status.extra}` : ""}'`}
            </span>
          )}
          {!isLive && isScheduled && (
            <Bell className="w-3.5 h-3.5 text-[#62748e]" />
          )}
        </div>

        <div className={`flex flex-col gap-2.5 pt-1 ${isLive ? "pl-2" : ""}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <Image
                  src={match.teams.home.logo}
                  width={24}
                  height={24}
                  alt=""
                  className="w-[24px] h-[24px] object-contain drop-shadow-md"
                  unoptimized
                />
              </div>
              <span
                className={`font-bold text-sm truncate max-w-[200px] ${aggregateScoreText && isAggHomeLoser ? "line-through text-[#62748e]" : (aggregateScoreText && isAggAwayLoser) || homeWinner ? "text-white" : "text-[#cad5e2]/80"}`}
              >
                {match.teams.home.name}
              </span>
            </div>
            {(isLive || isEnd) && (
              <span
                className={`font-black tracking-tighter text-base ${homeWinner ? "text-[#00bc7d]" : "text-white"}`}
              >
                {match.goals.home ?? "-"}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <Image
                  src={match.teams.away.logo}
                  width={24}
                  height={24}
                  alt=""
                  className="w-[24px] h-[24px] object-contain drop-shadow-md"
                  unoptimized
                />
              </div>
              <span
                className={`font-bold text-sm truncate max-w-[200px] ${aggregateScoreText && isAggAwayLoser ? "line-through text-[#62748e]" : (aggregateScoreText && isAggHomeLoser) || awayWinner ? "text-white" : "text-[#cad5e2]/80"}`}
              >
                {match.teams.away.name}
              </span>
            </div>
            {(isLive || isEnd) && (
              <span
                className={`font-black tracking-tighter text-base ${awayWinner ? "text-[#00bc7d]" : "text-white"}`}
              >
                {match.goals.away ?? "-"}
              </span>
            )}
          </div>

          {aggregateScoreText && (
            <div className="flex justify-end mt-[-2px]">
              <span className="text-[10px] text-[#00bc7d] font-bold uppercase tracking-widest">
                {aggregateScoreText}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
