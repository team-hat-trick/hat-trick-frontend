"use client";

import React from "react";
import { Search, Bell, Calendar } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);

  // Get formatted date like "2026.03.03 (화)"
  const today = new Date();
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const formattedDate = `${today.getFullYear()}.${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")} (${
    days[today.getDay()]
  })`;

  return (
    <header className="h-20 bg-[rgba(5,5,5,0.8)] backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10 shrink-0 gap-4">
      {/* Mobile Menu Icon */}
      <div className="flex lg:hidden items-center">
        <button className="p-2 -ml-2 text-white hover:bg-white/5 rounded-xl transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl px-4 py-2.5 flex-1 max-w-[384px]">
        <Search className="w-4 h-4 text-white/50 shrink-0" />
        <input
          type="text"
          placeholder="팀, 선수, 또는 리그를 검색하세요..."
          className="bg-transparent border-none text-sm text-[#e2e8f0]/50 outline-none w-full placeholder:text-[#e2e8f0]/50"
        />
      </div>

      <div className="flex-1 lg:hidden" /> {/* Spacer */}

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        {/* Mobile Search Icon */}
        <button className="md:hidden p-2 text-white hover:bg-white/5 rounded-full transition-colors">
          <Search className="w-5 h-5" />
        </button>

        {/* Date */}
        <div className="hidden sm:flex items-center gap-2">
          <Calendar className="w-[18px] h-[18px] text-[#cad5e2]" />
          <span className="font-bold text-xs text-[#cad5e2]">
            {formattedDate}
          </span>
        </div>

        {/* Notification */}
        <button className="relative p-2 hover:bg-white/5 rounded-full transition-colors">
          <Bell className="w-5 h-5 text-white" />
          <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#00bc7d] border-2 border-[#050505] rounded-full" />
        </button>

        {/* Profile */}
        <Link
          href={user ? "/onboarding" : "/login"}
          className="flex items-center gap-3 border-l border-white/5 pl-6"
        >
          <div className="flex flex-col items-end">
            <span className="font-bold text-sm text-white">
              {user ? profile?.name : "로그인을 해주세요!"}
            </span>
          </div>
          {user && (
            <div className="w-10 h-10 rounded-full border-2 border-white/10 overflow-hidden shadow-[0_10px_15px_-3px_rgba(0,188,125,0.1),0_4px_6px_-4px_rgba(0,188,125,0.1)]">
              <Image src={profile?.avatar_url} alt="" width={40} height={40} />
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}
