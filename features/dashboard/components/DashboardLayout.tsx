"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { DateSelector } from "./DateSelector";
import { LeagueSection } from "./LeagueSection";
import { RightSideBar } from "./RightSideBar";
import { MOCK_LEAGUES, MOCK_MATCHES } from "../constants/mockData";
import { ChevronDown, Filter } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useGetMatches } from "../hooks/useGetMatches";
import { createBrowserSupabaseClient } from "@/lib/utils/supabase/client";
import { Competition } from "@/features/onboarding/types";
import { Loader2 } from "lucide-react";
import { BIG_5_CODES, LEAGUE_OPTIONS } from "../constants";
import { useGetMatchesByLeague } from "../hooks/useGetMatchesByLeague";
import { ApiResopnse, MatchData } from "../types/dashboard";
import { useClickOutside } from "@/lib/hooks/useClickOutside";

dayjs.locale("ko");

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
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isCompLoading, setIsCompLoading] = useState(true);
  const [leagueType, setLeagueType] = useState<string>("전체");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => {
    if (dropdownRef) setIsDropdownOpen(false);
  });

  const startDate = dayjs(selectedDate).subtract(1, "day").format("YYYY-MM-DD");
  const endDate = selectedDate;

  const results = useGetMatchesByLeague(BIG_5_CODES, startDate, endDate);

  const isApiLoading = results.some((result) => result.isLoading);

  const allMatches = results.reduce((acc, result) => {
    // 💡 result.data를 ApiResopnse<MatchData>로 간주하라고 명시합니다.
    const data = result.data as ApiResopnse;

    if (data?.matches) {
      return [...acc, ...data.matches];
    }
    return acc;
  }, [] as MatchData[]);

  const filteredCompetitions = BIG_5_CODES.map((code) =>
    competitions.find((comp) => comp.code === code),
  )
    .filter((comp): comp is Competition => !!comp)
    .filter((league) => {
      if (leagueType === "전체") return true;
      const selectedOption = LEAGUE_OPTIONS.find(
        (opt) => opt.name === leagueType,
      );
      return league.code === selectedOption?.code;
    });

  useEffect(() => {
    const fetchCompetitions = async () => {
      setIsCompLoading(true);
      const supabase = createBrowserSupabaseClient();
      const { data } = await supabase.from("competitions").select("*");

      setCompetitions(data as Competition[]);
      setIsCompLoading(false);
    };
    fetchCompetitions();
  }, []);

  const isGlobalLoading = isApiLoading || isCompLoading;

  return (
    <div className="bg-white min-h-screen font-sans text-black flex">
      <div className="bg-[#050505] min-h-screen flex w-full mx-auto relative">
        <Sidebar />

        <div className="flex-1 flex flex-col relative w-full overflow-hidden">
          <Header />

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="w-full max-w-[1500px] mx-auto px-4 lg:px-8 xl:px-12 py-[32px] flex flex-col xl:flex-row gap-6 xl:gap-[32px]">
              {/* Center Feed */}
              <div className="flex flex-col gap-8 flex-1 min-w-0 xl:max-w-[1050px]">
                {/* Title Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h2 className="font-black text-[30px] text-white">
                        경기 대시보드
                      </h2>
                    </div>
                    <p className="font-medium text-sm text-[#62748e]">
                      유럽 5대 리그의 경기 정보를 확인해보세요.
                    </p>
                  </div>

                  <div
                    className="flex gap-2 items-center relative"
                    ref={dropdownRef}
                  >
                    {/* Filter Button */}
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[#f8fafc] text-sm font-bold hover:bg-white/10 transition-colors min-w-[120px] justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-[#00bc7d]" />
                        {leagueType}
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
                            key={option.code}
                            onClick={() => {
                              setLeagueType(option.name);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-white/5 ${
                              leagueType === option.name
                                ? "text-[#00bc7d] bg-[#00bc7d]/5"
                                : "text-[#cad5e2]"
                            }`}
                          >
                            {option.name}
                          </button>
                        ))}
                      </div>
                    )}

                    <button className="px-4 py-2 bg-[#00bc7d] text-black font-bold text-sm rounded-xl hover:bg-[#00d492] transition-colors">
                      전체 일정 보기
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
                      {filteredCompetitions.map((league) => {
                        const matchesForThisLeague = allMatches.filter(
                          (match) => {
                            const isSameLeague =
                              match.competition.id === league.id;
                            const isSameDate =
                              dayjs(match.utcDate).format("YYYY-MM-DD") ===
                              selectedDate;
                            return isSameLeague && isSameDate;
                          },
                        );

                        // 경기가 있는 리그만 보여주고 싶다면 아래 조건 추가
                        if (matchesForThisLeague.length === 0) return null;
                        console.log(matchesForThisLeague);

                        return (
                          <LeagueSection
                            key={league.id}
                            league={league}
                            matches={matchesForThisLeague}
                          />
                        );
                      })}

                      {/* 3. 데이터가 아예 없는 경우 (Empty State) */}
                      {!isGlobalLoading && allMatches.length === 0 && (
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
    </div>
  );
}
