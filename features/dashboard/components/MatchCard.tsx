import React from "react";
import Image from "next/image";
import { Bell, MonitorPlay } from "lucide-react";
import { MatchData } from "../types/dashboard";
import dayjs from "dayjs";

interface MatchCardProps {
  match: MatchData;
}

export function MatchCard({ match }: MatchCardProps) {
  const isLive = match.status === "IN_PLAY" || match.status === "PAUSED";
  const isEnd = match.status === "FINISHED";
  const isScheduled = match.status === "SCHEDULED";
  const isPostponed = match.status === "POSTPONED";

  // 승자 판별
  const homeWinner =
    isEnd && match.score.fullTime.home! > match.score.fullTime.away!;
  const awayWinner =
    isEnd && match.score.fullTime.away! > match.score.fullTime.home!;

  const kickoffTime = dayjs(match.utcDate).format("HH:mm");

  return (
    <div
      className={`group relative flex w-full min-h-[90px] sm:min-h-[110px] bg-[#0a0a0a] border border-white/5 rounded-2xl p-3 sm:p-5 items-center hover:border-[#00bc7d]/30 transition-all duration-300 cursor-pointer gap-2 sm:gap-4 ${isPostponed ? "opacity-50" : "opacity-100"}`}
    >
      {/* Live Indicator Line */}
      {isLive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#00bc7d] rounded-r-full shadow-[0_0_15px_#00bc7d]" />
      )}

      {/* Home Team */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end min-w-0">
        <span
          className={`font-bold text-sm sm:text-base truncate transition-colors ${homeWinner ? "text-white" : "text-[#cad5e2]/60 group-hover:text-[#cad5e2]"}`}
        >
          {match.homeTeam.shortName || match.homeTeam.name}
        </span>
        <div className="w-8 h-8 sm:w-11 sm:h-11 bg-white/5 rounded-xl flex items-center justify-center p-1.5 sm:p-2 border border-white/10 shrink-0">
          <Image
            src={match.homeTeam.crest}
            width={28}
            height={28}
            alt=""
            className="object-contain w-full h-full"
            unoptimized
          />
        </div>
      </div>

      {/* Center: Score / Time */}
      <div className="flex flex-col items-center justify-center w-[75px] sm:w-[120px] shrink-0 bg-white/[0.02] rounded-xl py-2 pl-1 pr-1 border border-white/[0.05]">
        <div className="flex items-center gap-3">
          {isLive || isEnd ? (
            <>
              <span
                className={`text-lg sm:text-2xl font-black italic tracking-tighter ${homeWinner ? "text-[#00bc7d]" : "text-white"}`}
              >
                {match.score.fullTime.home}
              </span>
              <span className="text-white/20 font-bold text-sm sm:text-base">-</span>
              <span
                className={`text-lg sm:text-2xl font-black italic tracking-tighter ${awayWinner ? "text-[#00bc7d]" : "text-white"}`}
              >
                {match.score.fullTime.away}
              </span>
            </>
          ) : (
            <span className="text-[15px] sm:text-xl font-bold text-white tracking-tight">
              {kickoffTime}
            </span>
          )}
        </div>

        {/* Status Badge */}
        <div className="mt-1">
          {isLive ? (
            <span className="flex items-center gap-1.5 text-[9px] text-[#fb2c36] font-black uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-[#fb2c36] rounded-full animate-pulse" />
              Live
            </span>
          ) : (
            <span className="text-xs text-[#62748e] font-bold uppercase tracking-widest">
              {isEnd ? "경기 종료" : isPostponed ? "연기됨" : "경기 예정"}
            </span>
          )}
        </div>
      </div>

      {/* Away Team */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-start min-w-0">
        <div className="w-8 h-8 sm:w-11 sm:h-11 bg-white/5 rounded-xl flex items-center justify-center p-1.5 sm:p-2 border border-white/10 shrink-0">
          <Image
            src={match.awayTeam.crest}
            width={28}
            height={28}
            alt=""
            className="object-contain w-full h-full"
            unoptimized
          />
        </div>
        <span
          className={`font-bold text-sm sm:text-base truncate transition-colors ${awayWinner ? "text-white" : "text-[#cad5e2]/60 group-hover:text-[#cad5e2]"}`}
        >
          {match.awayTeam.shortName || match.awayTeam.name}
        </span>
      </div>

      {/* Actions (Bell) */}
      <button className="ml-1 sm:ml-2 p-2 sm:p-2.5 bg-white/5 hover:bg-[#00bc7d]/10 rounded-xl transition-colors group/bell shrink-0 hidden sm:block">
        <Bell className="w-4 h-4 text-[#62748e] group-hover/bell:text-[#00bc7d]" />
      </button>
    </div>
  );
}
