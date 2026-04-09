"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { DateSelector } from "./DateSelector";
import { LeagueSection } from "./LeagueSection";
import { RightSideBar } from "./RightSideBar";
import { MOCK_LEAGUES, MOCK_MATCHES } from "../constants/mockData";
import { Calendar, ChevronDown, Filter } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useGetFixtures } from "../hooks/useGetFixtures";
import { Loader2 } from "lucide-react";
import { LEAGUE_OPTIONS, LIVE_STATUS_CODE } from "../constants";
import type { FixtureList, League } from "../types/dashboard";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import CalendarModal from "./modal/CalendarModal";

dayjs.locale("ko");

type LeagueType = {
  name: string;
  id: number | null;
};

export function DashboardLayout() {
  // Group matches by league
  const groupedMatches = MOCK_MATCHES.reduce(
    (acc, match) => {
      if (!acc[match.leagueId]) acc[match.leagueId] = [];
      acc[match.leagueId].push(match);
      return acc;
    },
    {} as Record<string, typeof MOCK_MATCHES>,
  );

  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format("YYYY-MM-DD"),
  );
  const [leagueType, setLeagueType] = useState<LeagueType>({
    name: "인기 리그",
    id: null,
  });
  const [isLiveOnly, setIsLiveOnly] = useState(false);

  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => {
    if (dropdownRef) setIsDropdownOpen(false);
  });

  const isToday = selectedDate === dayjs().format("YYYY-MM-DD");
  const { data, isLoading: isApiLoading } = useGetFixtures(
    selectedDate,
    "Asia/Seoul",
    isToday,
  );

  const allMatches = data?.response || [];

  const filteredMatches = useMemo(() => {
    if (!isLiveOnly) return allMatches;

    return allMatches.filter((item) =>
      LIVE_STATUS_CODE.includes(item.fixture.status.short),
    );
  }, [allMatches, isLiveOnly]);

  // Group directly from allMatches
  const groupedLeagues = Object.values(
    filteredMatches.reduce(
      (acc, match) => {
        const leagueId = match.league.id;
        if (!acc[leagueId]) {
          acc[leagueId] = {
            league: match.league,
            matches: [],
          };
        }
        acc[leagueId].matches.push(match);
        return acc;
      },
      {} as Record<number, { league: League; matches: FixtureList[] }>,
    ),
  ).filter((group) => {
    if (leagueType.id === null) return true;
    return group.league.id === leagueType.id;
  });

  const isGlobalLoading = isApiLoading;

  return (
    <div className="bg-white min-h-screen font-sans text-black flex">
      <div className="bg-[#050505] min-h-screen flex w-full mx-auto relative">
        <Sidebar />

        <div className="flex-1 flex flex-col relative w-full overflow-hidden">
          <Header />

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="w-full max-w-[1500px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-12 py-4 sm:py-[32px] flex flex-col xl:flex-row gap-6 xl:gap-[32px]">
              {/* Center Feed */}
              <div className="flex flex-col gap-8 flex-1 min-w-0 xl:max-w-[1050px]">
                {/* Title Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h2 className="font-black text-2xl sm:text-[30px] text-white tracking-tight">
                        경기 대시보드
                      </h2>
                    </div>
                    <p className="font-medium text-sm text-[#62748e]">
                      유럽 5대 리그의 경기 정보를 확인해보세요.
                    </p>
                  </div>

                  <div
                    className="flex flex-wrap gap-2 items-center relative"
                    ref={dropdownRef}
                  >
                    {isToday && (
                      <button
                        onClick={() => setIsLiveOnly(!isLiveOnly)}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold transition-all ${
                          isLiveOnly
                            ? "bg-[#ff4646]/10 border-[#ff4646] text-[#ff4646]"
                            : "bg-white/5 border-white/10 text-[#62748e] hover:bg-white/10"
                        }`}
                      >
                        {isLiveOnly ? (
                          <>
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff4646] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff4646]"></span>
                            </span>
                            LIVE ON
                          </>
                        ) : (
                          <>
                            <div className="w-2.5 h-2.5 rounded-full bg-[#62748e]"></div>
                            LIVE
                          </>
                        )}
                      </button>
                    )}
                    {/* Filter Button */}
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[#f8fafc] text-sm font-bold hover:bg-white/10 transition-colors min-w-[120px] justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-[#00bc7d]" />
                        {leagueType.name}
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute top-full mt-2 right-0 w-[160px] bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl">
                        {LEAGUE_OPTIONS.map((option) => (
                          <button
                            key={option.id ?? "all"}
                            onClick={() => {
                              setLeagueType(option);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-white/5 ${
                              leagueType.id === option.id
                                ? "text-[#00bc7d] bg-[#00bc7d]/5"
                                : "text-[#cad5e2]"
                            }`}
                          >
                            {option.name}
                          </button>
                        ))}
                      </div>
                    )}

                    <button
                      className="px-4 py-2 bg-[#00bc7d] text-black font-bold text-sm rounded-xl hover:bg-[#00d492] transition-colors"
                      onClick={() => setIsCalendarModalOpen(true)}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {isToday ? "전체 일정" : selectedDate}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Date Slider */}
                <DateSelector
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />

                {/* Leagues and Matches */}
                <div className="flex flex-col gap-6">
                  {isGlobalLoading ? (
                    /* 로딩 중일 때 보여줄 스켈레톤 혹은 로더 */
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <Loader2 className="w-10 h-10 text-[#00bc7d] animate-spin" />
                      <p className="text-[#62748e] font-medium animate-pulse">
                        최신 경기 데이터를 가져오는 중입니다...
                      </p>
                    </div>
                  ) : (
                    <>
                      {groupedLeagues.map((group) => (
                        <LeagueSection
                          key={group.league.id}
                          league={group.league}
                          matches={group.matches}
                        />
                      ))}

                      {/* 3. 데이터가 아예 없는 경우 (Empty State) */}
                      {!isGlobalLoading && groupedLeagues.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 border border-white/5 rounded-3xl bg-white/[0.02]">
                          <p className="text-[#62748e] font-bold">
                            선택하신 날짜에 예정된 경기가 없습니다.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Right Aside */}
              <div className="w-full xl:w-[360px] shrink-0">
                <RightSideBar />
              </div>
            </div>
          </main>
        </div>
      </div>

      {isCalendarModalOpen && (
        <CalendarModal
          selectedDate={selectedDate}
          onSelectDate={(date) => {
            setSelectedDate(date); // 날짜 변경!
            setIsCalendarModalOpen(false); // 모달 닫기
            setIsLiveOnly(false); // 라이브 필터가 켜져있었다면 꺼주는 센스
          }}
          onClose={() => setIsCalendarModalOpen(false)}
        />
      )}
    </div>
  );
}
