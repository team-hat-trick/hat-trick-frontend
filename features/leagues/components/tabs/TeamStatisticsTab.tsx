"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { ChevronRight, Target, Shield } from "lucide-react";
import { useGetAvgGoals } from "../../hooks/statistics/teams/useGetAvgGoals"; // 경로를 환경에 맞게 맞춰주세요!

interface Props {
  leagueId: number;
  season: number;
}

export default function TeamStatisticsTab({ leagueId, season }: Props) {
  const { data: teamData, isLoading, isError } = useGetAvgGoals(leagueId, season);

  // ⚔️ 최고의 창: 경기당 최다 득점 (내림차순)
  const unifiedTopScoring = useMemo(() => {
    if (!teamData || teamData.length === 0) return [];

    const sorted = [...teamData].sort(
      (a: any, b: any) => (b.avg_goals_for || 0) - (a.avg_goals_for || 0)
    );

    return sorted.slice(0, 3).map((team: any) => ({
      id: team.team_id,
      name: team.team_name,
      photo: team.team_logo, // renderStatCard 규격에 맞추기 위해 logo 대신 photo 사용
      team: "", // 팀 통계이므로 소속팀 표시 생략
      value: team.avg_goals_for || 0,
    }));
  }, [teamData]);

  // 🛡️ 최고의 방패: 경기당 최소 실점 (오름차순!)
  const unifiedTopDefending = useMemo(() => {
    if (!teamData || teamData.length === 0) return [];

    const sorted = [...teamData].sort(
      (a: any, b: any) => (a.avg_goals_against || 0) - (b.avg_goals_against || 0)
    );

    return sorted.slice(0, 3).map((team: any) => ({
      id: team.team_id,
      name: team.team_name,
      photo: team.team_logo, 
      team: "", 
      value: team.avg_goals_against || 0,
    }));
  }, [teamData]);

  // 💡 선수 통계에서 가져온 완벽한 FotMob 스타일 카드 컴포넌트
  const renderStatCard = (
    title: string,
    items: any[],
    valueColor: string | ((val: any) => string),
    icon: React.ReactNode,
  ) => {
    if (!items || items.length === 0) {
      return (
        <div className="flex flex-col bg-[#0f1115]/90 backdrop-blur-md rounded-[20px] p-5 border border-white/5 shadow-lg">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
            {icon}
            <span className="text-white/80 font-bold text-[15px]">{title}</span>
          </div>
          <div className="text-xs text-white/30 text-center py-10 bg-white/[0.02] rounded-xl border border-white/5 border-dashed">
            데이터가 없습니다.
          </div>
        </div>
      );
    }

    const rank1 = items[0];
    const others = items.slice(1, 3);

    return (
      <div className="flex flex-col h-full bg-[#0f1115]/90 backdrop-blur-md rounded-[20px] p-5 border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:border-white/10 transition-all group/card cursor-pointer">
        {/* 카드 헤더 */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/5 rounded-lg border border-white/5 text-white/80 group-hover/card:text-white transition-colors">
              {icon}
            </div>
            <span className="text-white font-bold text-[16px] tracking-tight group-hover/card:text-white transition-colors">
              {title}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-white/20 group-hover/card:text-white/50 transition-colors" />
        </div>

        {/* 👑 1위 프리미엄 블록 */}
        <div className="relative flex items-center gap-4 bg-gradient-to-r from-white/[0.06] to-white/[0.01] p-4 rounded-2xl border border-white/5 mb-4 group/top overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none transition-transform group-hover/top:scale-110" />

          <div className="relative shrink-0">
            <div className="absolute -top-1.5 -left-1.5 w-6 h-6 bg-white text-black font-black text-xs flex items-center justify-center rounded-full z-10 shadow-md">
              1
            </div>
            <Image
              src={rank1.photo}
              alt={rank1.name}
              width={64}
              height={64}
              className="w-14 h-14 rounded-full object-contain p-1 border border-white/10 bg-[#13161c] relative z-0 group-hover/top:scale-105 transition-transform"
            />
          </div>

          <div className="flex flex-col flex-1 min-w-0 justify-center">
            <span className="text-white font-bold text-[15px] truncate leading-tight mb-0.5">
              {rank1.name}
            </span>
            {/* 팀 통계에서는 소속팀 이름이 없으므로 빈 공간 방지 차원에서 생략 가능 */}
          </div>

          <div className="flex flex-col items-end justify-center shrink-0 pl-2">
            <span
              className={`font-black text-[22px] tabular-nums tracking-tighter drop-shadow-sm ${typeof valueColor === "function" ? valueColor(rank1.value) : valueColor}`}
            >
              {rank1.value}
            </span>
          </div>
        </div>

        {/* 2위 ~ 3위 리스트 */}
        <div className="flex flex-col flex-1 gap-1">
          {others.map((item: any, idx: number) => (
            <div
              key={item.id}
              className="flex items-center gap-4 py-2 px-2 hover:bg-white/[0.04] rounded-xl transition-colors group/row"
            >
              <span className="font-bold text-white/30 w-4 text-center text-[13px] shrink-0 group-hover/row:text-white/60 transition-colors">
                {idx + 2}
              </span>

              <Image
                src={item.photo}
                alt={item.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full shrink-0 object-contain p-1 bg-[#13161c] border border-white/5"
              />

              <div className="flex flex-col flex-1 min-w-0 justify-center">
                <span className="text-white/80 font-bold text-[13px] truncate group-hover/row:text-white transition-colors leading-tight mb-0.5">
                  {item.name}
                </span>
              </div>

              <span
                className={`font-bold text-[15px] tabular-nums shrink-0 pl-2 ${typeof valueColor === "function" ? valueColor(item.value) : valueColor}`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ⏳ 선수 통계 탭과 동일한 로딩 UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 w-full h-full">
        <div className="w-10 h-10 md:w-14 md:h-14 border-4 border-[#00bc7d]/20 border-t-[#00bc7d] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full py-20 text-red-400/80 text-sm font-medium">
        데이터를 불러오는데 실패했습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-12 pt-4 gap-12">
      <div className="w-full">
        <h2 className="text-2xl md:text-2xl font-black text-white tracking-tight mb-6 px-2 flex items-center gap-2">
          주요 팀 통계
        </h2>

        {/* 💡 그리드 레이아웃: PC에서는 3열(가로로 남은 한자리는 나중에 다른 지표로 채울 수 있습니다) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {renderStatCard(
            "경기당 최다 득점",
            unifiedTopScoring,
            "text-[#2b7fff]", // 파란색으로 공격력 강조
            <Target className="w-[18px] h-[18px] text-[#2b7fff]" />
          )}
          
          {renderStatCard(
            "경기당 최소 실점",
            unifiedTopDefending,
            "text-[#00bc7d]", // 초록색으로 수비 안정감 강조
            <Shield className="w-[18px] h-[18px] text-[#00bc7d]" />
          )}
        </div>
      </div>
    </div>
  );
}