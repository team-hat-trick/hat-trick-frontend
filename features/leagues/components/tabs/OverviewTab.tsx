import React from 'react';
import { MOCK_STANDINGS, MOCK_MATCHES, MOCK_PLAYER_GOALS, MOCK_PLAYER_ASSISTS } from '../../mocks';
import Image from 'next/image';

export default function OverviewTab() {
  return (
    <div className="flex flex-col gap-8 w-full p-2">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Standings & Matches */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* STANDINGS */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#00bc7d] rounded-full"></span>
              리그 순위
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-[11px] text-[#90a1b9] font-semibold border-b border-white/10 uppercase bg-black/20">
                  <tr>
                    <th className="px-4 py-3 text-center w-12 rounded-tl-lg">#</th>
                    <th className="px-4 py-3">클럽</th>
                    <th className="px-4 py-3 text-center">경기</th>
                    <th className="px-4 py-3 text-center">승</th>
                    <th className="px-4 py-3 text-center">무</th>
                    <th className="px-4 py-3 text-center">패</th>
                    <th className="px-4 py-3 text-center">득실</th>
                    <th className="px-4 py-3 text-center rounded-tr-lg">승점</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_STANDINGS.map((row) => (
                    <tr key={row.position} className="border-b border-white/5 hover:bg-white/10 transition-colors">
                      <td className="px-4 py-4 text-center text-white/50 font-bold">{row.position}</td>
                      <td className="px-4 py-4 font-bold flex items-center gap-3">
                        <div className="bg-white/5 p-1 rounded-md">
                          <Image src={row.team.crest} alt={row.team.name} width={24} height={24} className="object-contain" />
                        </div>
                        {row.team.shortName}
                      </td>
                      <td className="px-4 py-4 text-center text-white/70 font-medium">{row.playedGames}</td>
                      <td className="px-4 py-4 text-center text-white/70 font-medium">{row.won}</td>
                      <td className="px-4 py-4 text-center text-white/70 font-medium">{row.draw}</td>
                      <td className="px-4 py-4 text-center text-white/70 font-medium">{row.lost}</td>
                      <td className="px-4 py-4 text-center font-semibold text-[#90a1b9]">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                      <td className="px-4 py-4 text-center font-black text-[#00bc7d] text-base">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RECENT MATCHES */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#00bc7d] rounded-full"></span>
              최근 경기 결과
            </h2>
            <div className="flex flex-col gap-3">
              {MOCK_MATCHES.map((match) => (
                <div key={match.id} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-black/40 via-black/20 to-black/40 border border-white/5 hover:border-white/20 transition-all shadow-sm">
                  <div className="flex items-center gap-3 w-[40%] justify-start">
                    <div className="bg-white/5 p-1.5 rounded-lg">
                      <Image src={match.homeLogo} alt={match.homeTeam} width={28} height={28} className="object-contain" />
                    </div>
                    <span className="font-bold text-sm md:text-base hidden sm:block truncate">{match.homeTeam}</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center w-[20%]">
                    <span className="text-[10px] text-[#00bc7d] font-black mb-1 px-2.5 py-0.5 rounded-full bg-[rgba(0,188,125,0.15)] border border-[rgba(0,188,125,0.3)]">{match.time}</span>
                    <div className="flex items-center gap-3 text-2xl font-black tracking-tight">
                      <span className="text-white">{match.homeScore}</span>
                      <span className="text-white/20 text-sm">-</span>
                      <span className="text-white">{match.awayScore}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-[40%] justify-end">
                    <span className="font-bold text-sm md:text-base hidden sm:block truncate text-right">{match.awayTeam}</span>
                    <div className="bg-white/5 p-1.5 rounded-lg">
                      <Image src={match.awayLogo} alt={match.awayTeam} width={28} height={28} className="object-contain" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Top Scorers & Assists */}
        <div className="flex flex-col gap-6">
          {/* TOP SCORERS */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[rgba(0,188,125,0.05)] rounded-full blur-3xl" />
            
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2 relative z-10">
              <span className="w-1.5 h-6 bg-[#00bc7d] rounded-full shadow-[0_0_10px_rgba(0,188,125,0.8)]"></span>
              득점 순위
            </h2>
            <div className="flex flex-col gap-4 relative z-10">
              {MOCK_PLAYER_GOALS.map((player) => (
                <div key={player.rank} className="flex items-center justify-between group p-2 -mx-2 rounded-xl hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 text-center text-sm font-black ${player.rank === 1 ? 'text-[#00bc7d] text-base drop-shadow-[0_0_8px_rgba(0,188,125,0.8)]' : 'text-white/40'}`}>{player.rank}</span>
                    <div className="relative">
                      <img src={player.photo} alt={player.name} className="w-11 h-11 rounded-full border border-white/10 object-cover shadow-md" />
                      {player.rank === 1 && <div className="absolute -top-1 -right-1 text-xs">👑</div>}
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="font-bold text-sm leading-tight text-white group-hover:text-[#00d492] transition-colors">{player.name}</span>
                      <span className="text-[10px] text-[#90a1b9] font-medium">{player.team}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-center">
                    <span className="font-black text-xl text-[#00bc7d] leading-none">{player.goals}</span>
                    <span className="text-[9px] text-[#90a1b9] font-bold mt-1 uppercase tracking-wider">{player.matches}경기</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TOP ASSISTS */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[rgba(43,127,255,0.05)] rounded-full blur-3xl" />
            
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2 relative z-10">
              <span className="w-1.5 h-6 bg-[#2b7fff] rounded-full shadow-[0_0_10px_rgba(43,127,255,0.8)]"></span>
              도움 순위
            </h2>
            <div className="flex flex-col gap-4 relative z-10">
              {MOCK_PLAYER_ASSISTS.map((player) => (
                <div key={player.rank} className="flex items-center justify-between group p-2 -mx-2 rounded-xl hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 text-center text-sm font-black ${player.rank === 1 ? 'text-[#2b7fff] text-base drop-shadow-[0_0_8px_rgba(43,127,255,0.8)]' : 'text-white/40'}`}>{player.rank}</span>
                    <div className="relative">
                      <img src={player.photo} alt={player.name} className="w-11 h-11 rounded-full border border-white/10 object-cover shadow-md" />
                      {player.rank === 1 && <div className="absolute -top-1 -right-1 text-xs">🎯</div>}
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="font-bold text-sm leading-tight text-white group-hover:text-[#2b7fff] transition-colors">{player.name}</span>
                      <span className="text-[10px] text-[#90a1b9] font-medium">{player.team}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-center">
                    <span className="font-black text-xl text-[#2b7fff] leading-none">{player.assists}</span>
                    <span className="text-[9px] text-[#90a1b9] font-bold mt-1 uppercase tracking-wider">{player.matches}경기</span>
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
