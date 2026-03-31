"use client";

import React from 'react';
import { MOCK_CLUBS } from '../../mocks';
import Image from 'next/image';
import Link from 'next/link';

export default function ClubsTab() {
  return (
    <div className="w-full p-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {MOCK_CLUBS.map((club) => (
          <Link href={`/teams/${club.id}`} key={club.id}>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 shadow-lg cursor-pointer group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[rgba(0,188,125,0.03)] rounded-bl-full group-hover:bg-[rgba(0,188,125,0.1)] transition-colors" />
              
              <div className="w-20 h-20 md:w-24 md:h-24 bg-black/40 rounded-2xl p-3 flex items-center justify-center border border-white/5 shadow-inner group-hover:shadow-[0_0_20px_rgba(0,188,125,0.2)] transition-shadow">
                <Image src={club.logo} alt={club.name} width={70} height={70} className="object-contain" />
              </div>
              
              <div className="flex flex-col items-center text-center w-full z-10">
                <h3 className="font-extrabold text-lg text-white mb-1 group-hover:text-[#00bc7d] transition-colors line-clamp-1">{club.name}</h3>
                
                <div className="w-8 h-[2px] bg-white/10 my-2 group-hover:bg-[#00bc7d]/50 transition-colors" />
                
                <div className="flex flex-col gap-1.5 w-full mt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/40">감독</span>
                    <span className="font-medium text-[#cad5e2] truncate max-w-[100px]">{club.manager}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/40">구장</span>
                    <span className="font-medium text-[#cad5e2] truncate max-w-[120px]">{club.stadium}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/40">연고지</span>
                    <span className="font-medium text-[#cad5e2] truncate max-w-[100px]">{club.city}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
