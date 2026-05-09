"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import {
  Star,
  Target,
  TrendingUp,
  ChevronRight,
  CardSim,
  CircleAlert,
  Crosshair,
  Link,
  LogOut,
  Timer,
  Percent,
  Pickaxe,
  Shield,
  CircleOff,
  FishingHook,
  ChevronsRightLeft,
  TriangleAlert,
  Spotlight,
  CircleX,
  Hand,
} from "lucide-react";
import { useGetTopScorers } from "../../hooks/statistics/useGetTopScorers";
import { useGetTopAssists } from "../../hooks/statistics/useGetTopAssists";
import { useGetTopRating } from "../../hooks/statistics/useGetTopRating";
import { useGetTopYellowcards } from "../../hooks/statistics/useGetTopYellowcards";
import { useGetTopRedcards } from "../../hooks/statistics/useGetTopRedcards";
import { useGetTopGameMinutes } from "../../hooks/statistics/useGetTopGameMinutes";
import { useGetTotalShots } from "../../hooks/statistics/useGetTotalShots";
import { useGetShotsOnTarget } from "../../hooks/statistics/useGetShotsOnTarget";
import { useGetKeyPasses } from "../../hooks/statistics/useGetKeyPasses";
import { useGetPassesAccuracy } from "../../hooks/statistics/useGetPassesAccuracy";
import { useGetDribbleSuccessRate } from "../../hooks/statistics/useGetDribbleSuccessRate";
import { useGetPenaltySuccessRate } from "../../hooks/statistics/useGetPenaltySuccessRate";
import { useGetTackleSuccess } from "../../hooks/statistics/useGetTackleSuccess";
import { useGetBlocks } from "../../hooks/statistics/useGetBlocks";
import { useGetInterceptions } from "../../hooks/statistics/useGetInterceptions";
import { useGetDuelsWon } from "../../hooks/statistics/useGetDuelsWon";
import { useGetFoulsDrawn } from "../../hooks/statistics/useGetFoulsDrawn";
import { useGetFoulsCommitted } from "../../hooks/statistics/useGetFoulsCommitted";
import { useGetPenaltyCommitted } from "../../hooks/statistics/useGetPenaltyCommitted";
import { useGetPenaltySaved } from "../../hooks/statistics/useGetPenaltySaved";
import { useGetSavedRate } from "../../hooks/statistics/useGetSavedRate";

interface Props {
  leagueId: number;
  season: number;
}

export default function PlayerStatisticsTab({ leagueId, season }: Props) {
  const { data: topScorersData, isLoading: isLoadingScorers } =
    useGetTopScorers(leagueId, season);
  const { data: topAssistsData, isLoading: isLoadingAssists } =
    useGetTopAssists(leagueId, season);
  const { data: topRated, isLoading: isLoadingRated } = useGetTopRating(
    leagueId,
    season,
  );
  const { data: topYellowcardsData, isLoading: isLoadingYellowcards } =
    useGetTopYellowcards(leagueId, season);
  const { data: topRedcardsData, isLoading: isLoadingRedcards } =
    useGetTopRedcards(leagueId, season);

  const { data: topGameMinutesData, isLoading: isLoadingGameMinutes } =
    useGetTopGameMinutes(leagueId, season);

  const { data: topTotalShotsData, isLoading: isLoadingTopTotalShots } =
    useGetTotalShots(leagueId, season);
  const { data: topShotsOnTargetData, isLoading: isLoadingTopShotsOnTarget } =
    useGetShotsOnTarget(leagueId, season);
  const { data: topKeyPassesData, isLoading: isLoadingTopKeyPasses } =
    useGetKeyPasses(leagueId, season);
  const { data: topPassesAccuracyData, isLoading: isLoadingTopPassesAccuracy } =
    useGetPassesAccuracy(leagueId, season);
  const {
    data: topDribbleSuccessRateData,
    isLoading: isLoadingTopDribbleSuccessRate,
  } = useGetDribbleSuccessRate(leagueId, season);
  const {
    data: topPenaltySuccessRateData,
    isLoading: isLoadingTopPenaltySuccessRate,
  } = useGetPenaltySuccessRate(leagueId, season);

  const { data: topTackleSuccessData, isLoading: isLoadingTopTackleSuccess } =
    useGetTackleSuccess(leagueId, season);
  const { data: topBlocksData, isLoading: isLoadingTopBlocks } = useGetBlocks(
    leagueId,
    season,
  );
  const { data: topInterceptionsData, isLoading: isLoadingTopInterceptions } =
    useGetInterceptions(leagueId, season);
  const { data: topDuelsWonData, isLoading: isLoadingTopDuelsWon } =
    useGetDuelsWon(leagueId, season);
  const { data: topFoulsDrawnData, isLoading: isLoadingTopFoulsDrawn } =
    useGetFoulsDrawn(leagueId, season);
  const { data: topFoulsCommittedData, isLoading: isLoadingTopFoulsCommitted } =
    useGetFoulsCommitted(leagueId, season);
  const {
    data: topPenaltyCommittedData,
    isLoading: isLoadingTopPenaltyCommitted,
  } = useGetPenaltyCommitted(leagueId, season);
  const { data: topPenaltySavedData, isLoading: isLoadingTopPenaltySaved } =
    useGetPenaltySaved(leagueId, season);
  const { data: topSavedRateData, isLoading: isLoadingTopSavedRate } =
    useGetSavedRate(leagueId, season);

  const topScorers = topScorersData?.response?.slice(0, 3) || [];
  const topAssists = topAssistsData?.response?.slice(0, 3) || [];
  const topYellowcards = topYellowcardsData?.response?.slice(0, 3) || [];
  const topRedcards = topRedcardsData?.response?.slice(0, 3) || [];

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

  const unifiedTopYellowcards = useMemo(() => {
    return (
      topYellowcards?.map((p: any) => ({
        id: p.player.id,
        name: p.player.name,
        photo: p.player.photo,
        team: p.statistics[0]?.team.name,
        value: p.statistics[0]?.cards.yellow || 0,
      })) || []
    );
  }, [topYellowcards]);

  const unifiedTopRedcards = useMemo(() => {
    return (
      topRedcards?.map((p: any) => ({
        id: p.player.id,
        name: p.player.name,
        photo: p.player.photo,
        team: p.statistics[0]?.team.name,
        value: p.statistics[0]?.cards.red || 0,
      })) || []
    );
  }, [topRedcards]);

  const unifiedTopGameMinutes = useMemo(() => {
    if (!topGameMinutesData || topGameMinutesData.length === 0) return [];

    // 1. 먼저 통일된 규격으로 데이터를 매핑합니다.
    const mappedPlayers = topGameMinutesData.map((p: any) => ({
      id: p.player_id,
      name: p.name,
      photo: p.photo,
      team: p.team_name,
      value: p.game_minutes.toLocaleString() || 0, // 혹시 값이 없으면 0 처리
    }));

    // 2. 출전 시간(value)을 기준으로 내림차순(큰 숫자가 먼저 오게) 정렬 후 3명을 자릅니다!
    return mappedPlayers
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 3);
  }, [topGameMinutesData]);

  const unifiedTopTotalShots = useMemo(() => {
    if (!topTotalShotsData || topTotalShotsData.length === 0) return [];

    const mappedPlayers = topTotalShotsData.map((p: any) => ({
      id: p.player_id,
      name: p.name,
      photo: p.photo,
      team: p.team_name,
      value: p.total_shots || 0,
    }));

    return mappedPlayers
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 3);
  }, [topTotalShotsData]);

  const unifiedTopShotsOnTarget = useMemo(() => {
    if (!topShotsOnTargetData || topShotsOnTargetData.length === 0) return [];

    const mappedPlayers = topShotsOnTargetData.map((p: any) => ({
      id: p.player_id,
      name: p.name,
      photo: p.photo,
      team: p.team_name,
      value: p.shots_on_target.toLocaleString() || 0,
    }));

    return mappedPlayers
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 3);
  }, [topShotsOnTargetData]);

  const unifiedTopKeyPasses = useMemo(() => {
    if (!topKeyPassesData || topKeyPassesData.length === 0) return [];

    const mappedPlayers = topKeyPassesData.map((p: any) => ({
      id: p.player_id,
      name: p.name,
      photo: p.photo,
      team: p.team_name,
      value: p.key_passes.toLocaleString() || 0,
    }));

    return mappedPlayers
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 3);
  }, [topKeyPassesData]);

  const unifiedTopPassesAccuracy = useMemo(() => {
    if (!topPassesAccuracyData || topPassesAccuracyData.length === 0) return [];

    const mappedPlayers = topPassesAccuracyData.map((p: any) => {
      console.log(p);
      return {
        id: p.player_id,
        name: p.name,
        photo: p.photo,
        team: p.team_name,
        value: `${p.passes_accuracy}%` || 0,
      };
    });

    return mappedPlayers
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 3);
  }, [topPassesAccuracyData]);

  const unifiedTopChanceCreated = useMemo(() => {
    // 1. 두 데이터 중 하나라도 아직 로딩 전이면 빈 배열 반환
    if (!topAssistsData?.response || !topKeyPassesData) return [];

    // 2. 선수를 고유하게 식별하고 데이터를 합칠 Map 생성 (기준 키: player_id)
    const playerMap = new Map();

    // 3. 먼저 Supabase DB에서 가져온 '키 패스' 데이터를 Map에 쫘락 깔아줍니다.
    topKeyPassesData.forEach((p: any) => {
      playerMap.set(p.player_id, {
        id: p.player_id,
        name: p.name,
        photo: p.photo,
        team: p.team_name,
        keyPasses: p.key_passes || 0,
        assists: 0, // 🚨 [해결 포인트 1] 무조건 0으로 초기화!
      });
    });

    // 4. API-Football에서 가져온 '어시스트' 데이터를 Map에 병합합니다.
    topAssistsData.response.forEach((p: any) => {
      const playerId = p.player.id;
      const assistCount = p.statistics[0]?.goals?.assists || 0;

      if (playerMap.has(playerId)) {
        // 이미 Map에 존재하는 선수면 어시스트 수치만 업데이트
        const existingPlayer = playerMap.get(playerId);
        // 🚨 [해결 포인트 2] 혹시 몰라 || 0 안전장치 추가
        existingPlayer.assists = Math.max(
          existingPlayer.assists || 0,
          assistCount,
        );
      } else {
        // Map에 없는 선수면 새로 뼈대를 만들어서 추가
        playerMap.set(playerId, {
          id: playerId,
          name: p.player.name,
          photo: p.player.photo,
          team: p.statistics[0]?.team.name,
          keyPasses: 0, // 🚨 [해결 포인트 3] 무조건 0으로 초기화!
          assists: assistCount,
        });
      }
    });

    // 5. Map 데이터를 배열로 변환하면서 (키패스 + 어시스트) 최종 합산!
    const chanceCreatedPlayers = Array.from(playerMap.values()).map(
      (player) => ({
        id: player.id,
        name: player.name,
        photo: player.photo,
        team: player.team,
        // 🚨 [해결 포인트 4] 최후의 방어벽: undefined + 숫자가 되지 않도록 || 0 처리
        value: (player.keyPasses || 0) + (player.assists || 0),
      }),
    );

    // 6. 합산된 수치(value)를 기준으로 내림차순 정렬 후 Top 3 추출
    return chanceCreatedPlayers.sort((a, b) => b.value - a.value).slice(0, 3);
  }, [topAssistsData, topKeyPassesData]); // 의존성 배열도 정확히 잡아줍니다.

  const unifiedTopDribbleSuccessRate = useMemo(() => {
    if (!topDribbleSuccessRateData || topDribbleSuccessRateData.length === 0)
      return [];

    const mappedPlayers = topDribbleSuccessRateData.map((p: any) => ({
      id: p.player_id,
      name: p.name,
      photo: p.photo,
      team: p.team_name,
      value: `${p.dribble_success_rate || 0}%`,
    }));

    return mappedPlayers
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 3);
  }, [topDribbleSuccessRateData]);

  // 클라이언트 측 코드 수정

  const unifiedTopPenaltySuccessRate = useMemo(() => {
    if (!topPenaltySuccessRateData || topPenaltySuccessRateData.length === 0)
      return [];

    // 💡 1. 맵핑(%)하기 전에 원본 숫자 데이터(penalty_success_rate)를 기준으로 내림차순 정렬 먼저!
    const sortedPlayers = [...topPenaltySuccessRateData].sort(
      (a: any, b: any) => {
        const rateA = a.penalty_success_rate || 0;
        const rateB = b.penalty_success_rate || 0;
        return rateB - rateA; // 숫자 vs 숫자 연산이므로 완벽하게 정렬됨
      },
    );

    // 💡 2. 정렬이 끝난 상태에서 3명을 자르고(slice), 마지막에 % 기호를 씌워줍니다(map).
    return sortedPlayers.slice(0, 3).map((p: any) => ({
      id: p.player_id,
      name: p.name,
      photo: p.photo,
      team: p.team_name,
      value: `${p.penalty_success_rate || 0}%`, // 드디어 문자열로 변신
    }));
  }, [topPenaltySuccessRateData]);

  const unifiedTopTackleSuccess = useMemo(() => {
    if (!topTackleSuccessData || topTackleSuccessData.length === 0) return [];

    const mappedPlayers = topTackleSuccessData.map((p: any) => ({
      id: p.player_id,
      name: p.name,
      photo: p.photo,
      team: p.team_name,
      value: p.tackle_success || 0,
    }));

    return mappedPlayers
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 3);
  }, [topTackleSuccessData]);

  const unifiedTopBlocks = useMemo(() => {
    if (!topBlocksData || topBlocksData.length === 0) return [];

    const mappedPlayers = topBlocksData.map((p: any) => ({
      id: p.player_id,
      name: p.name,
      photo: p.photo,
      team: p.team_name,
      value: p.blocks || 0,
    }));

    return mappedPlayers
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 3);
  }, [topBlocksData]);

  const unifiedTopInterceptions = useMemo(() => {
    if (!topInterceptionsData || topInterceptionsData.length === 0) return [];

    const mappedPlayers = topInterceptionsData.map((p: any) => ({
      id: p.player_id,
      name: p.name,
      photo: p.photo,
      team: p.team_name,
      value: p.interceptions || 0,
    }));

    return mappedPlayers
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 3);
  }, [topInterceptionsData]);

  const unifiedTopDuelsWon = useMemo(() => {
    if (!topDuelsWonData || topDuelsWonData.length === 0) return [];

    const mappedPlayers = topDuelsWonData.map((p: any) => ({
      id: p.player_id,
      name: p.name,
      photo: p.photo,
      team: p.team_name,
      value: p.duels_won || 0,
    }));

    return mappedPlayers
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 3);
  }, [topDuelsWonData]);

  const unifiedTopFoulsDrawn = useMemo(() => {
    if (!topFoulsDrawnData || topFoulsDrawnData.length === 0) return [];

    const mappedPlayers = topFoulsDrawnData.map((p: any) => ({
      id: p.player_id,
      name: p.name,
      photo: p.photo,
      team: p.team_name,
      value: p.fouls_drawn || 0,
    }));

    return mappedPlayers
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 3);
  }, [topFoulsDrawnData]);

  const unifiedTopFoulsCommitted = useMemo(() => {
    if (!topFoulsCommittedData || topFoulsCommittedData.length === 0) return [];

    const mappedPlayers = topFoulsCommittedData.map((p: any) => ({
      id: p.player_id,
      name: p.name,
      photo: p.photo,
      team: p.team_name,
      value: p.fouls_committed || 0,
    }));

    return mappedPlayers
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 3);
  }, [topFoulsCommittedData]);

  const unifiedTopPenaltyCommitted = useMemo(() => {
    if (!topPenaltyCommittedData || topPenaltyCommittedData.length === 0)
      return [];

    const mappedPlayers = topPenaltyCommittedData.map((p: any) => ({
      id: p.player_id,
      name: p.name,
      photo: p.photo,
      team: p.team_name,
      value: p.penalty_committed || 0,
    }));

    return mappedPlayers
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 3);
  }, [topPenaltyCommittedData]);

  const unifiedTopPenaltySaved = useMemo(() => {
    if (!topPenaltySavedData || topPenaltySavedData.length === 0) return [];

    const mappedPlayers = topPenaltySavedData.map((p: any) => ({
      id: p.player_id,
      name: p.name,
      photo: p.photo,
      team: p.team_name,
      value: p.penalty_saved,
    }));

    return mappedPlayers
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 3);
  }, [topPenaltySavedData]);

  const unifiedTopSavedRate = useMemo(() => {
    if (!topSavedRateData || topSavedRateData.length === 0) return [];

    const mappedPlayers = topSavedRateData.map((p: any) => ({
      id: p.player_id,
      name: p.name,
      photo: p.photo,
      team: p.team_name,
      value: `${p.saved_rate || 0}%`,
    }));

    return mappedPlayers.slice(0, 3);
  }, [topSavedRateData]);

  const isLoading =
    isLoadingScorers ||
    isLoadingAssists ||
    isLoadingRated ||
    isLoadingYellowcards ||
    isLoadingRedcards ||
    isLoadingGameMinutes ||
    isLoadingTopTotalShots ||
    isLoadingTopShotsOnTarget ||
    isLoadingTopDribbleSuccessRate ||
    isLoadingTopPenaltySuccessRate ||
    isLoadingTopTackleSuccess ||
    isLoadingTopBlocks ||
    isLoadingTopInterceptions ||
    isLoadingTopDuelsWon ||
    isLoadingTopFoulsDrawn ||
    isLoadingTopFoulsCommitted ||
    isLoadingTopPenaltyCommitted ||
    isLoadingTopPenaltySaved ||
    isLoadingTopSavedRate;

  // 💡 FotMob 스타일의 독립적인 카드 UI로 업그레이드된 함수
  const renderStatCard = (
    title: string,
    players: any[],
    valueColor: string | ((val: any) => string),
    icon: React.ReactNode,
  ) => {
    if (!players || players.length === 0) {
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

    const rank1 = players[0];
    const others = players.slice(1, 3);

    return (
      <div className="flex flex-col h-full bg-[#0f1115]/90 backdrop-blur-md rounded-[20px] p-5 border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:border-white/10 transition-all group/card cursor-pointer">
        {/* 카드 헤더 (FotMob 스타일: 아이콘 + 제목 + 더보기 화살표) */}
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
          {/* 글로우 효과 */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none transition-transform group-hover/top:scale-110" />

          {/* 프로필 이미지 */}
          <div className="relative shrink-0">
            <div className="absolute -top-1.5 -left-1.5 w-6 h-6 bg-white text-black font-black text-xs flex items-center justify-center rounded-full z-10 shadow-md">
              1
            </div>
            <Image
              src={rank1.photo}
              alt={rank1.name}
              width={64}
              height={64}
              className="w-14 h-14 rounded-full object-cover border border-white/10 bg-[#13161c] relative z-0 group-hover/top:scale-105 transition-transform"
            />
          </div>

          {/* 이름 & 소속팀 */}
          <div className="flex flex-col flex-1 min-w-0 justify-center">
            <span className="text-white font-bold text-[15px] truncate leading-tight mb-0.5">
              {rank1.name}
            </span>
            <span className="text-[#90a1b9] font-medium text-[12px] truncate">
              {rank1.team}
            </span>
          </div>

          {/* 통계 수치 */}
          <div className="flex flex-col items-end justify-center shrink-0 pl-2">
            <span
              className={`font-black text-[22px] tabular-nums tracking-tighter drop-shadow-sm ${typeof valueColor === "function" ? valueColor(rank1.value) : valueColor}`}
            >
              {rank1.value}
            </span>
          </div>
        </div>

        {/* 2위 ~ 5위 플랫 리스트 */}
        <div className="flex flex-col flex-1 gap-1">
          {others.map((player: any, idx: number) => (
            <div
              key={player.id}
              className="flex items-center gap-4 py-2 px-2 hover:bg-white/[0.04] rounded-xl transition-colors group/row"
            >
              <span className="font-bold text-white/30 w-4 text-center text-[13px] shrink-0 group-hover/row:text-white/60 transition-colors">
                {idx + 2}
              </span>

              <Image
                src={player.photo}
                alt={player.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full shrink-0 object-cover bg-[#13161c] border border-white/5"
              />

              <div className="flex flex-col flex-1 min-w-0 justify-center">
                <span className="text-white/80 font-bold text-[13px] truncate group-hover/row:text-white transition-colors leading-tight mb-0.5">
                  {player.name}
                </span>
                <span className="text-white/40 text-[11px] truncate leading-tight">
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 w-full h-full">
        <div className="w-10 h-10 md:w-14 md:h-14 border-4 border-[#00bc7d]/20 border-t-[#00bc7d] rounded-full animate-spin"></div>
      </div>
    );
  }

  // 데이터가 하나도 없을 경우의 예외 처리
  if (
    unifiedTopRated.length === 0 &&
    unifiedTopScorers.length === 0 &&
    unifiedTopAssists.length === 0
  ) {
    return (
      <div className="flex items-center justify-center h-full py-20 text-white/50 text-sm font-medium">
        현재 시즌 선수 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-12 pt-4 gap-12">
      {/* 1. 공격 지표 섹션 (타이틀만 있고 껍데기 박스는 제거됨) */}
      <div className="w-full">
        <h2 className="text-2xl md:text-2xl font-black text-white tracking-tight mb-6 px-2 flex items-center gap-2">
          주요 통계
        </h2>

        {/* 💡 그리드 자체가 컨테이너 역할을 하며, 내부의 카드들이 알아서 정렬됩니다. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {renderStatCard(
            "최고 평점",
            unifiedTopRated,
            (val: any) => {
              const num = parseFloat(val);
              if (num >= 8.0) return "text-[#2b7fff]";
              if (num >= 7.0) return "text-[#00bc7d]";
              return "text-[#ffb400]";
            },
            <Star className="w-[18px] h-[18px] text-[#ffd500]" />,
          )}
          {renderStatCard(
            "득점",
            unifiedTopScorers,
            "text-white",
            <Crosshair className="w-[18px] h-[18px]" />,
          )}
          {renderStatCard(
            "도움",
            unifiedTopAssists,
            "text-white",
            <Link className="w-[18px] h-[18px]" />,
          )}
          {renderStatCard(
            "경고",
            unifiedTopYellowcards,
            "text-white",
            <TriangleAlert className="w-[18px] h-[18px] text-[#fbff00]" />,
          )}
          {renderStatCard(
            "퇴장",
            unifiedTopRedcards,
            "text-white",
            <LogOut className="w-[18px] h-[18px] text-[#ff0000]" />,
          )}
          {renderStatCard(
            "출전 시간(분)",
            unifiedTopGameMinutes,
            "text-white",
            <Timer className="w-[18px] h-[18px]" />,
          )}
        </div>
      </div>

      <div className="w-full">
        <h2 className="text-2xl md:text-2xl font-black text-white tracking-tight mb-6 px-2 flex items-center gap-2">
          공격
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {renderStatCard(
            "전체 슛팅",
            unifiedTopTotalShots,
            "text-white",
            <Crosshair className="w-[18px] h-[18px]" />,
          )}
          {renderStatCard(
            "유효 슛팅",
            unifiedTopShotsOnTarget,
            "text-white",
            <Target className="w-[18px] h-[18px]" />,
          )}
          {renderStatCard(
            "키 패스",
            unifiedTopKeyPasses,
            "text-white",
            <Link className="w-[18px] h-[18px]" />,
          )}
          {renderStatCard(
            "패스 정확도",
            unifiedTopPassesAccuracy,
            "text-white",
            <Percent className="w-[18px] h-[18px]" />,
          )}
          {renderStatCard(
            "기회 창출",
            unifiedTopChanceCreated,
            "text-white",
            <Pickaxe className="w-[18px] h-[18px]" />,
          )}
          {renderStatCard(
            "드리블 성공률",
            unifiedTopDribbleSuccessRate,
            "text-white",
            <Percent className="w-[18px] h-[18px]" />,
          )}
          {renderStatCard(
            "파울 유도",
            unifiedTopFoulsDrawn,
            "text-white",
            <Spotlight className="w-[18px] h-[18px]" />,
          )}
          {renderStatCard(
            "페널티킥 성공률",
            unifiedTopPenaltySuccessRate,
            "text-white",
            <Percent className="w-[18px] h-[18px]" />,
          )}
        </div>
      </div>

      <div className="w-full">
        <h2 className="text-2xl md:text-2xl font-black text-white tracking-tight mb-6 px-2 flex items-center gap-2">
          수비
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {renderStatCard(
            "태클 성공",
            unifiedTopTackleSuccess,
            "text-white",
            <Shield className="w-[18px] h-[18px]" />,
          )}
          {renderStatCard(
            "블록",
            unifiedTopBlocks,
            "text-white",
            <CircleOff className="w-[18px] h-[18px]" />,
          )}
          {renderStatCard(
            "인터셉트",
            unifiedTopInterceptions,
            "text-white",
            <FishingHook className="w-[18px] h-[18px]" />,
          )}
          {renderStatCard(
            "경합 승리",
            unifiedTopDuelsWon,
            "text-white",
            <ChevronsRightLeft className="w-[18px] h-[18px]" />,
          )}
          {renderStatCard(
            "파울",
            unifiedTopFoulsCommitted,
            "text-white",
            <CircleAlert className="w-[18px] h-[18px]" />,
          )}
          {renderStatCard(
            "페널티킥 헌납",
            unifiedTopPenaltyCommitted,
            "text-white",
            <CircleX className="w-[18px] h-[18px]" />,
          )}
        </div>
      </div>

      <div className="w-full">
        <h2 className="text-2xl md:text-2xl font-black text-white tracking-tight mb-6 px-2 flex items-center gap-2">
          골키핑
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {renderStatCard(
            "페널티킥 선방",
            unifiedTopPenaltySaved,
            "text-white",
            <Hand className="w-[18px] h-[18px]" />,
          )}
          {renderStatCard(
            "선방률",
            unifiedTopSavedRate,
            "text-white",
            <Hand className="w-[18px] h-[18px]" />,
          )}
        </div>
      </div>
    </div>
  );
}
