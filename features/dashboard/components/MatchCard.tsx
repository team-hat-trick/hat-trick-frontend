import React from "react";
import Image from "next/image";
import { Bell, MonitorPlay } from "lucide-react";
import { FixtureList } from "../types/dashboard";
import dayjs from "dayjs";

interface MatchCardProps {
  match: FixtureList;
}

export function MatchCard({ match }: MatchCardProps) {
  const shortStatus = match.fixture.status.short;
  const isLive = ["1H", "2H", "HT", "ET", "BT", "P", "SUSP", "INT", "LIVE"].includes(shortStatus);
  const isEnd = ["FT", "AET", "PEN"].includes(shortStatus);
  const isScheduled = ["NS", "TBD"].includes(shortStatus);
  const isPostponed = ["PST", "CANC", "ABD", "AWD", "WO"].includes(shortStatus);

  // 승자 판별
  const homeWinner = match.teams.home.winner;
  const awayWinner = match.teams.away.winner;

  const kickoffTime = dayjs(match.fixture.date).format("HH:mm");

  return (
    <div
      className={`group relative flex-col sm:flex-row flex w-full bg-[#0a0a0a] border border-white/5 rounded-xl sm:rounded-2xl hover:border-[#00bc7d]/30 transition-all duration-300 cursor-pointer overflow-hidden ${isPostponed ? "opacity-50" : "opacity-100"}`}
    >
      {/* ========================================================
          1) DESKTOP LAYOUT (sm:flex) 
          ======================================================== */}
      <div className="hidden sm:flex items-center w-full min-h-[110px] p-5 gap-4 relative">
        {/* Live Indicator Line & Elapsed Time */}
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
                    {match.fixture.status.extra ? `+${match.fixture.status.extra}` : ""}
                    &apos;
                  </>
                )}
              </span>
            </div>
          </>
        )}

        {/* Home Team */}
        <div className={`flex items-center gap-4 flex-1 justify-end min-w-0 ${isLive ? "pl-16" : ""}`}>
          <span
            className={`font-bold text-base truncate transition-colors ${homeWinner ? "text-white" : "text-[#cad5e2]/60 group-hover:text-[#cad5e2]"}`}
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

        {/* Center: Score / Time */}
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

          {/* Status Badge */}
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

        {/* Away Team */}
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
            className={`font-bold text-base truncate transition-colors ${awayWinner ? "text-white" : "text-[#cad5e2]/60 group-hover:text-[#cad5e2]"}`}
          >
            {match.teams.away.name}
          </span>
        </div>

        {/* Actions (Bell) */}
        <button className="ml-2 p-2.5 bg-white/5 hover:bg-[#00bc7d]/10 rounded-xl transition-colors group/bell shrink-0">
          <Bell className="w-4 h-4 text-[#62748e] group-hover/bell:text-[#00bc7d]" />
        </button>
      </div>

      {/* ========================================================
          2) MOBILE LAYOUT (flex sm:hidden)
          ======================================================== */}
      <div className="flex sm:hidden flex-col w-full p-4 gap-3 relative">
        {isLive && (
          <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#00bc7d] rounded-r-md shadow-[0_0_15px_#00bc7d]" />
        )}
        {/* Top row: Time & Status */}
        <div className={`flex items-center justify-between pb-2 border-b border-white/5 ${isLive ? "pl-2" : ""}`}>
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
              {shortStatus === "HT" ? "HT" : `${match.fixture.status.elapsed}${match.fixture.status.extra ? `+${match.fixture.status.extra}` : ""}'`}
            </span>
          )}
          {!isLive && isScheduled && (
            <Bell className="w-3.5 h-3.5 text-[#62748e]" />
          )}
        </div>

        {/* Teams and Scores */}
        <div className={`flex flex-col gap-2.5 pt-1 ${isLive ? "pl-2" : ""}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <Image src={match.teams.home.logo} width={24} height={24} alt="" className="w-[24px] h-[24px] object-contain drop-shadow-md" unoptimized />
              </div>
              <span className={`font-bold text-sm truncate max-w-[200px] ${homeWinner ? "text-white" : "text-[#cad5e2]/80"}`}>
                {match.teams.home.name}
              </span>
            </div>
            {(isLive || isEnd) && (
              <span className={`font-black tracking-tighter text-base ${homeWinner ? "text-[#00bc7d]" : "text-white"}`}>
                {match.goals.home ?? "-"}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <Image src={match.teams.away.logo} width={24} height={24} alt="" className="w-[24px] h-[24px] object-contain drop-shadow-md" unoptimized />
              </div>
              <span className={`font-bold text-sm truncate max-w-[200px] ${awayWinner ? "text-white" : "text-[#cad5e2]/80"}`}>
                {match.teams.away.name}
              </span>
            </div>
            {(isLive || isEnd) && (
              <span className={`font-black tracking-tighter text-base ${awayWinner ? "text-[#00bc7d]" : "text-white"}`}>
                {match.goals.away ?? "-"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
