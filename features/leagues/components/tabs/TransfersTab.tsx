"use client";

import React from 'react';
import { MOCK_TRANSFERS } from '../../mocks';

export default function TransfersTab() {
  return (
    <div className="flex flex-col gap-6 w-full p-2">
      <div className="grid grid-cols-1 gap-4 lg:max-w-5xl mx-auto w-full">
        {MOCK_TRANSFERS.map((transfer) => (
          <div key={transfer.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-white/10 hover:border-white/20 transition-all shadow-lg group relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${transfer.type === "IN" ? "bg-[#00bc7d]" : "bg-[#ff4b4b]"}`} />
            
            <div className="flex flex-col w-full md:w-auto pl-2 md:pl-4">
              <div className="flex items-center gap-3 mb-2.5">
                <span className={`font-extrabold text-sm px-3 py-1 rounded-full tracking-wider ${transfer.type === "IN" ? "text-[#00bc7d] bg-[#00bc7d]/10" : "text-[#ff4b4b] bg-[#ff4b4b]/10"}`}>{transfer.type}</span>
                <span className="text-white/50 text-[11px] font-bold bg-black/40 px-2 py-1 rounded-md">{transfer.date}</span>
                {transfer.isOfficial && <span className="bg-[#2b7fff] text-white text-[10px] font-black px-2 py-1 rounded shadow-[0_0_10px_rgba(43,127,255,0.6)] uppercase tracking-widest flex items-center gap-1"><span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> OFFICIAL</span>}
              </div>
              <h3 className="text-xl md:text-3xl font-black text-white group-hover:opacity-80 transition-opacity line-clamp-1 tracking-tight">{transfer.player}</h3>
            </div>
            
            <div className="flex flex-row md:flex-row items-center justify-between md:justify-end gap-4 md:gap-10 w-full md:w-auto bg-black/20 p-5 md:bg-transparent md:p-0 rounded-xl border border-white/5 md:border-none relative z-10">
              <div className="flex flex-col items-center md:items-end w-[35%] md:w-auto">
                <span className="text-[10px] text-white/40 font-bold mb-1.5 tracking-widest">FROM</span>
                <span className={`text-sm md:text-base font-bold truncate max-w-[120px] ${transfer.type === "OUT" ? "text-[#00bc7d]" : "text-[#ff4b4b]"}`}>{transfer.from}</span>
              </div>
              
              <div className="flex flex-col items-center justify-center w-[30%] md:w-auto">
                <div className="bg-white/10 p-2 rounded-full mb-1">
                  <span className="text-base md:text-xl">✈️</span>
                </div>
                <span className="text-[11px] bg-white/5 border border-white/10 text-white/80 px-2.5 py-0.5 rounded-md font-bold tracking-tight shadow-sm whitespace-nowrap">{transfer.fee}</span>
              </div>
              
              <div className="flex flex-col items-center md:items-start w-[35%] md:w-auto">
                <span className="text-[10px] text-white/40 font-bold mb-1.5 tracking-widest">TO</span>
                <span className={`text-sm md:text-base font-bold truncate max-w-[120px] ${transfer.type === "IN" ? "text-[#00bc7d]" : "text-[#ff4b4b]"}`}>{transfer.to}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
