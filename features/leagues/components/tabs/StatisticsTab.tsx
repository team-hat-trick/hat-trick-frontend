"use client";

import React, { useState } from 'react';
import { MOCK_YELLOW_CARDS, MOCK_CLEAN_SHEETS, MOCK_TEAM_POSSESSION, MOCK_TEAM_GOALS } from '../../mocks';
import Image from 'next/image';

export default function StatisticsTab() {
  const [statType, setStatType] = useState<"player" | "team">("player");

  return (
    <div className="flex flex-col gap-8 w-full p-2">
      {/* Sub Switch */}
      <div className="flex justify-center md:justify-start">
        <div className="bg-white/5 p-1 rounded-full flex gap-1 border border-white/10">
          <button
            onClick={() => setStatType("player")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              statType === "player" ? "bg-[#00bc7d] text-black shadow-md" : "text-[#cad5e2] hover:text-white"
            }`}
          >
            선수 통계
          </button>
          <button
            onClick={() => setStatType("team")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              statType === "team" ? "bg-[#00bc7d] text-black shadow-md" : "text-[#cad5e2] hover:text-white"
            }`}
          >
            팀 통계
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {statType === "player" ? (
          <>
            {/* Player Stat 1: Yellow Cards */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ffc107] rounded-full"></span>
                경고 누적 순위 <span className="text-xs text-[#90a1b9] font-normal ml-2">(터프한 선수들)</span>
              </h2>
              <div className="flex flex-col gap-4">
                {MOCK_YELLOW_CARDS.map((player) => (
                  <div key={player.rank} className="flex flex-row items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="font-black text-white/40 w-4 text-center">{player.rank}</span>
                      <img src={player.photo} alt={player.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                      <div className="flex flex-col">
                        <span className="font-bold text-base text-white">{player.name}</span>
                        <span className="text-xs text-[#90a1b9]">{player.team}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-[#ffc107]/10 px-3 py-1.5 rounded-lg border border-[#ffc107]/20">
                      <div className="w-3 h-4 bg-[#ffc107] rounded-sm shadow-sm" />
                      <span className="font-black text-[#ffc107] text-lg">{player.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Player Stat 2: Clean Sheets */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#2b7fff] rounded-full"></span>
                클린시트 순위 <span className="text-xs text-[#90a1b9] font-normal ml-2">(최고의 수문장)</span>
              </h2>
              <div className="flex flex-col gap-4">
                {MOCK_CLEAN_SHEETS.map((player) => (
                  <div key={player.rank} className="flex flex-row items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="font-black text-white/40 w-4 text-center">{player.rank}</span>
                      <img src={player.photo} alt={player.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                      <div className="flex flex-col">
                        <span className="font-bold text-base text-white">{player.name}</span>
                        <span className="text-xs text-[#90a1b9]">{player.team}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-black text-2xl text-[#2b7fff] leading-none">{player.value}</span>
                      <span className="text-[10px] text-white/40 mt-1 uppercase">경기</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Team Stat 1: Possession */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#00bc7d] rounded-full"></span>
                평균 점유율 순위 <span className="text-xs text-[#90a1b9] font-normal ml-2">(지배자들)</span>
              </h2>
              <div className="flex flex-col gap-4">
                {MOCK_TEAM_POSSESSION.map((teamStat) => (
                  <div key={teamStat.rank} className="flex flex-row items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="font-black text-[#00bc7d] w-4 text-center">{teamStat.rank}</span>
                      <div className="bg-white/10 p-1.5 rounded-lg">
                        <Image src={teamStat.team.crest} alt={teamStat.team.name} width={32} height={32} className="object-contain" />
                      </div>
                      <span className="font-bold text-lg text-white">{teamStat.team.name}</span>
                    </div>
                    <span className="font-black text-xl text-white">{teamStat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Stat 2: Total Goals */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ff4b4b] rounded-full"></span>
                총 득점 순위 <span className="text-xs text-[#90a1b9] font-normal ml-2">(화력의 정점)</span>
              </h2>
              <div className="flex flex-col gap-4">
                {MOCK_TEAM_GOALS.map((teamStat) => (
                  <div key={teamStat.rank} className="flex flex-row items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="font-black text-[#ff4b4b] w-4 text-center">{teamStat.rank}</span>
                      <div className="bg-white/10 p-1.5 rounded-lg">
                        <Image src={teamStat.team.crest} alt={teamStat.team.name} width={32} height={32} className="object-contain" />
                      </div>
                      <span className="font-bold text-lg text-white">{teamStat.team.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⚽️</span>
                      <span className="font-black text-2xl text-white">{teamStat.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
