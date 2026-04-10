"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { useGetStandings } from "../../hooks/useGetStandings";
import { useGetRecord } from "../../hooks/useGetRecord";

interface Props {
  leagueId: number;
  season: number;
}

export default function StandingsTab({ leagueId, season }: Props) {
  // 1. 커스텀 훅 (항상 최상단)
  const { data: standings, isLoading } = useGetStandings(leagueId, season);
  const { data: leagueRecord, isLoading: isLoadingRecord } = useGetRecord(
    leagueId,
    season,
  );

  // 💡 2. 데이터 정제 로직을 훅과 함께 최상단으로 끌어올립니다.
  // standings가 undefined일 때를 대비해 옵셔널 체이닝(?.)을 꼼꼼히 적용합니다.
  const rawStandings = standings?.response?.[0]?.league?.standings;
  const standingsData =
    Array.isArray(rawStandings) && Array.isArray(rawStandings[0])
      ? rawStandings[0]
      : [];

  // 💡 4. 모든 훅과 데이터 맵핑이 끝난 후, 안전하게 예외 처리(Early Return)를 합니다.
  if (isLoading || isLoadingRecord) {
    return (
      <div className="flex items-center justify-center py-24 w-full h-full">
        <div className="w-10 h-10 md:w-14 md:h-14 border-4 border-[#00bc7d]/20 border-t-[#00bc7d] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!standings || !leagueRecord || standingsData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full py-10 text-white/50 text-sm font-medium">
        데이터가 없습니다.
      </div>
    );
  }

  // 5. 일반 함수 및 렌더링 영역
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

  return (
    <div className="flex flex-col gap-8 w-full p-2">
      <div className="overflow-x-auto relative z-10 md:pb-6 md:pb-8 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
        <table className="w-full text-sm text-left whitespace-nowrap min-w-full md:min-w-[650px]">
          <thead className="text-[10px] md:text-[11px] text-[#90a1b9] font-bold border-b border-white/10 uppercase tracking-wider bg-white/[0.02]">
            <tr>
              <th className="px-2 md:px-4 py-3 md:py-4 text-center w-8 md:w-12 rounded-tl-xl">
                #
              </th>
              <th className="px-2 md:px-4 py-3 md:py-4">클럽</th>
              <th className="px-2 md:px-3 py-3 md:py-4 text-center">경기</th>
              <th className="px-3 py-4 text-center hidden md:table-cell">승</th>
              <th className="px-3 py-4 text-center hidden md:table-cell">무</th>
              <th className="px-3 py-4 text-center hidden md:table-cell">패</th>
              <th className="px-3 py-4 text-center hidden md:table-cell">
                득실
              </th>
              <th className="px-6 py-4 text-center hidden md:table-cell">
                최근 5경기
              </th>
              <th className="px-2 md:px-4 py-3 md:py-4 text-center rounded-tr-xl">
                승점
              </th>
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
  );
}
