import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  BarChart2,
  Users,
  Trophy,
  LogOut,
} from "lucide-react";
import { signOutAction } from "@/app/auth/action";

export function Sidebar() {
  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 hidden lg:flex flex-col justify-between h-screen sticky top-0 shrink-0">
      <div className="p-6">
        {/* LOGO */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#00bc7d] flex items-center justify-center font-bold text-black text-xl">
            G
          </div>
          <span className="font-bold text-[23.4px] text-[#00bc7d] tracking-[-1.2px]">
            HAT-TRICK
          </span>
        </div>

        {/* NAV MENUS */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] text-[#62748e] font-bold tracking-[1px] mb-2 px-2">
            메인 메뉴
          </span>

          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-[14px] bg-[rgba(0,188,125,0.1)] text-[#00d492] font-semibold text-sm transition-colors relative"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>대시보드</span>
            <div className="absolute right-3 w-1.5 h-1.5 bg-[#00bc7d] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          </Link>

          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-[#90a1b9] font-medium text-sm hover:bg-white/5 transition-colors"
          >
            <BarChart2 className="w-5 h-5" />
            <span>데이터 분석(개발중)</span>
          </Link>

          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-[#90a1b9] font-medium text-sm hover:bg-white/5 transition-colors"
          >
            <Users className="w-5 h-5" />
            <span>커뮤니티(개발중)</span>
          </Link>

          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-[#90a1b9] font-medium text-sm hover:bg-white/5 transition-colors"
          >
            <Trophy className="w-5 h-5" />
            <span>리그 순위(개발중)</span>
          </Link>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="p-4 border-t border-white/5 flex flex-col gap-4">
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
        <button className="flex items-center gap-3 px-3 py-2 text-[#90a1b9] hover:text-white transition-colors w-full">
          <LogOut className="w-[18px] h-[18px]" />
          <span className="font-medium text-sm" onClick={signOutAction}>
            로그아웃
          </span>
        </button>
      </div>
    </aside>
  );
}
