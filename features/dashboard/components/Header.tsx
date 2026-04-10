"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, Calendar, Menu, X, LayoutDashboard, BarChart2, Users, Trophy, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/auth/action";

export function Header() {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Get formatted date like "2026.03.03 (화)"
  const today = new Date();
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const formattedDate = `${today.getFullYear()}.${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")} (${
    days[today.getDay()]
  })`;

  return (
    <>
      <header className="h-20 bg-[rgba(5,5,5,0.8)] backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-999 shrink-0 gap-4">
      {/* Mobile Menu Icon */}
      <div className="flex lg:hidden items-center">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 -ml-2 text-white hover:bg-white/5 rounded-xl transition-colors"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
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
          className="flex items-center gap-2 sm:gap-3 border-l border-white/5 pl-4 sm:pl-6"
        >
          <div className="flex flex-col items-end hidden sm:flex">
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

    {/* Mobile Sidebar Overlay */}
    <div 
      className={`fixed inset-0 z-[100] lg:hidden flex transition-all duration-300 ${
        isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
      
      {/* Sidebar */}
      <div 
        className={`relative w-[280px] max-w-[80vw] bg-[#0a0a0a] h-[100dvh] shadow-2xl flex flex-col border-r border-white/5 z-[101] transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
            <div className="p-6 overflow-y-auto flex-1">
              {/* Header inside Menu */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#00bc7d] flex items-center justify-center font-bold text-black text-xl">
                    G
                  </div>
                  <span className="font-bold text-[23.4px] text-[#00bc7d] tracking-[-1.2px]">
                    HAT-TRICK
                  </span>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-white/70 hover:text-white bg-white/5 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Menus */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-[#62748e] font-bold tracking-[1px] mb-2 px-2">
                  메인 메뉴
                </span>

                <Link
                  href="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[14px] bg-[rgba(0,188,125,0.1)] text-[#00d492] font-semibold text-sm transition-colors relative"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>대시보드</span>
                  <div className="absolute right-3 w-1.5 h-1.5 bg-[#00bc7d] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                </Link>

                <Link
                  href="#"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-[#90a1b9] font-medium text-sm hover:bg-white/5 transition-colors"
                >
                  <BarChart2 className="w-5 h-5" />
                  <span>데이터 분석(개발중)</span>
                </Link>

                <Link
                  href="#"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-[#90a1b9] font-medium text-sm hover:bg-white/5 transition-colors"
                >
                  <Users className="w-5 h-5" />
                  <span>커뮤니티(개발중)</span>
                </Link>

                <Link
                  href="#"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-[#90a1b9] font-medium text-sm hover:bg-white/5 transition-colors"
                >
                  <Trophy className="w-5 h-5" />
                  <span>리그 순위(개발중)</span>
                </Link>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="p-6 border-t border-white/5 flex flex-col gap-4 bg-[#0a0a0a] shrink-0">
              {/* PRO PLAN */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[rgba(0,188,125,0.2)] to-[rgba(43,127,255,0.2)] border border-white/5">
                <h4 className="text-white font-bold text-xs mb-1">PRO 멤버십</h4>
                <p className="text-[#90a1b9] text-[10px] mb-3 leading-tight">
                  무제한 AI 분석 리포트를 확인하세요.
                </p>
                <button className="w-full py-2 bg-[#00bc7d] text-black font-bold text-xs rounded-[10px] hover:bg-[#00d492] transition-colors">
                  업그레이드
                </button>
              </div>

              {/* LOGOUT */}
              <button 
                onClick={async () => {
                  await signOutAction();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 text-[#90a1b9] hover:text-white transition-colors w-full"
              >
                <LogOut className="w-[18px] h-[18px]" />
                <span className="font-medium text-sm">
                  로그아웃
                </span>
              </button>
            </div>
          </div>
        </div>
    </>
  );
}
