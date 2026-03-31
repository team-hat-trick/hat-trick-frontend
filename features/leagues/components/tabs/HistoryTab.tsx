"use client";

import React from 'react';
import { MOCK_HISTORY_WINNERS, MOCK_HISTORY_TITLES, MOCK_HISTORY_SCORERS } from '../../mocks';
import Image from 'next/image';

export default function HistoryTab() {
  return (
    <div className="flex flex-col gap-8 w-full p-2">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column: Timeline of Winners */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-[100px] pointer-events-none" />
          
          <h2 className="text-2xl md:text-3xl font-black mb-10 flex items-center gap-4 relative z-10">
            <span className="text-4xl drop-shadow-[0_0_15px_rgba(255,193,7,0.6)]">🏆</span>
            명예의 전당 <span className="text-xs md:text-sm text-[#90a1b9] font-bold tracking-tight bg-white/5 px-3 py-1 rounded-full border border-white/10">역대 우승 팀</span>
          </h2>
          
          <div className="relative pl-8 md:pl-10 flex flex-col gap-8 z-10">
            {/* Main Timeline Line */}
            <div className="absolute left-0 top-6 bottom-6 w-0.5 bg-gradient-to-b from-yellow-400 via-[#00bc7d]/50 to-transparent rounded-full" />
            
            {MOCK_HISTORY_WINNERS.map((winner, idx) => (
              <div key={idx} className="relative group perspective-1000">
                {/* Timeline Dot */}
                <div className="absolute -left-[35px] md:-left-[43.5px] top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 rounded-full border-[3px] border-yellow-400 bg-[#0a0a0a] group-hover:scale-125 group-hover:border-white transition-all duration-300 shadow-[0_0_15px_rgba(250,204,21,0.6)] z-10" />
                
                <div className="flex items-center gap-5 bg-black/40 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-white/10 group-hover:border-yellow-400/50 group-hover:bg-white/5 transition-all duration-500 w-full md:max-w-xl shadow-xl group-hover:shadow-[0_10px_30px_-5px_rgba(250,204,21,0.15)] group-hover:-translate-y-1">
                  <div className="flex flex-col min-w-[70px] md:min-w-[90px] justify-center border-r border-white/10 pr-4">
                    <span className="text-sm md:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 tracking-wider inline-block">{winner.year}</span>
                    <span className="text-white/40 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-0.5">Season</span>
                  </div>
                  
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-[18px] p-2 flex items-center justify-center border border-white/10 shadow-inner group-hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] transition-all">
                    <Image src={winner.logo} alt={winner.team} width={48} height={48} className="object-contain group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  
                  <h3 className="text-lg md:text-2xl font-black text-white tracking-tight">{winner.team}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Titles & Top Scorers */}
        <div className="flex flex-col gap-6 md:gap-8">
          {/* Most Titles */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
            <h2 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]"></span>
              최다 우승 클럽
            </h2>
            <div className="flex flex-col gap-4">
              {MOCK_HISTORY_TITLES.map(title => (
                <div key={title.rank} className="flex items-center justify-between bg-black/30 p-3.5 rounded-xl border border-white/5 hover:bg-white/10 hover:border-yellow-400/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <span className={`font-black text-base w-4 text-center ${title.rank === 1 ? 'text-yellow-400 drop-shadow-md' : 'text-white/30'}`}>{title.rank}</span>
                    <div className="bg-white/5 p-1.5 rounded-lg group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-shadow">
                      <Image src={title.logo} alt={title.team} width={28} height={28} className="object-contain" />
                    </div>
                    <span className="font-bold text-sm md:text-base text-white">{title.team}</span>
                  </div>
                  <div className={`flex items-center gap-2 ${title.rank === 1 ? 'bg-yellow-400/15 border-yellow-400/30' : 'bg-white/5 border-white/10'} px-2.5 py-1.5 rounded-lg border`}>
                    <span className="text-xs">🏆</span>
                    <span className={`font-black text-sm ${title.rank === 1 ? 'text-yellow-400' : 'text-white'}`}>{title.titles}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Time Scorers */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
            <h2 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-[#00bc7d] rounded-full shadow-[0_0_10px_rgba(0,188,125,0.8)]"></span>
              역대 최고 득점자 <span className="text-[10px] text-white/50 font-normal ml-0.5 mt-1">(Legends)</span>
            </h2>
            <div className="flex flex-col gap-4">
              {MOCK_HISTORY_SCORERS.map(scorer => (
                <div key={scorer.rank} className="flex items-center justify-between bg-black/30 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-4">
                    <span className={`font-black text-base w-4 text-center ${scorer.rank === 1 ? 'text-[#00bc7d] drop-shadow-md' : 'text-white/30'}`}>{scorer.rank}</span>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm md:text-base text-white group-hover:text-[#00bc7d] transition-colors">{scorer.name}</span>
                      <span className="text-[10px] text-[#90a1b9] font-bold mt-0.5 tracking-wide">MATCHES: {scorer.matches}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-center">
                    <span className="text-[10px] text-[#00bc7d] font-bold bg-[#00bc7d]/10 px-2 py-0.5 rounded uppercase tracking-wider mb-1">GOALS</span>
                    <span className="font-black text-3xl text-white group-hover:scale-110 transition-transform origin-right leading-none tracking-tighter">{scorer.goals}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
