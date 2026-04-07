"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Header } from "@/features/dashboard/components/Header";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { MOCK_LEAGUE_INFO } from "../mocks";
import OverviewTab from "./tabs/OverviewTab";
import StatisticsTab from "./tabs/StatisticsTab";
import ClubsTab from "./tabs/ClubsTab";
import TransfersTab from "./tabs/TransfersTab";
import HistoryTab from "./tabs/HistoryTab";
import { Competition } from "@/features/onboarding/types";
import { useGetLeagueDetail } from "../hooks/useGetLeagueDetail";

interface Props {
  leagueId: number;
}

const TABS = [
  { id: "overview", label: "개요" },
  { id: "statistics", label: "통계" },
  { id: "clubs", label: "팀 목록" },
  { id: "transfers", label: "이적 시장" },
  { id: "history", label: "히스토리" },
];

export function LeagueDetailClient({ leagueId }: Props) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const leagueInfo = MOCK_LEAGUE_INFO;

  const { data: leagueDetail } = useGetLeagueDetail(leagueId);

  useEffect(() => {
    if (leagueDetail && !selectedSeason) {
      const allSeasons = leagueDetail.response[0].seasons;
      if (allSeasons && allSeasons.length > 0) {
        const currentSeason = allSeasons.find((s) => s.current);
        if (currentSeason) {
          setSelectedSeason(currentSeason.year.toString());
        } else {
          setSelectedSeason(allSeasons[allSeasons.length - 1].year.toString());
        }
      }
    }
  }, [leagueDetail, selectedSeason]);

  const seasons = leagueDetail?.response[0].seasons.map((item) => {
    const yearToSeasons = `${item.year}-${item.year + 1}`;

    return {
      label: yearToSeasons,
      value: item.year,
    };
  });

  if (!leagueDetail) return null;

  return (
    <div className="flex bg-[#050505] min-h-screen text-white font-sans w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 overflow-x-hidden">
          {/* HEADER SECTION */}
          <div className="relative w-full h-48 md:h-64 flex items-end p-6 md:p-10 border-b border-white/10 bg-gradient-to-t from-[#0a0a0a] to-[rgba(0,188,125,0.15)] overflow-hidden">
            {/* Background Blur */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <Image
                src={leagueDetail.response[0].league.logo}
                alt="bg"
                layout="fill"
                objectFit="cover"
                className="blur-[100px]"
              />
            </div>

            <div className="flex items-center gap-6 z-10 w-full max-w-[1400px] mx-auto">
              <div className="w-20 h-20 md:w-28 md:h-28 bg-white backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
                <Image
                  src={leagueDetail.response[0].league.logo}
                  alt={leagueDetail.response[0].league.name}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col gap-1 md:gap-2 text-shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[#00bc7d] font-bold text-sm md:text-base">
                    {leagueDetail.response[0].country.name}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                  {leagueDetail.response[0].league.name}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-white/50 text-xs md:text-sm font-medium">
                    시즌
                  </span>
                  <div className="relative">
                    <select
                      value={selectedSeason}
                      onChange={(e) => setSelectedSeason(e.target.value)}
                      className="appearance-none bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold text-xs md:text-sm pl-4 pr-10 py-2 rounded-xl outline-none border border-white/10 transition-colors cursor-pointer shadow-sm"
                    >
                      {seasons
                        ?.slice()
                        .reverse()
                        .map((season) => (
                          <option
                            key={season.value}
                            value={season.value}
                            className="bg-[#1a1a1a] text-white"
                          >
                            {season.label}
                          </option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-[1400px] mx-auto w-full px-4 md:px-8 py-6">
            {/* TABS NAVIGATION */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 border-b border-white/10 mb-8 select-none">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap px-5 py-2.5 rounded-[14px] text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-[#00bc7d] text-black shadow-[0_0_15px_rgba(0,188,125,0.4)]"
                        : "bg-white/5 text-[#90a1b9] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
              {activeTab === "overview" && (
                <OverviewTab
                  leagueId={leagueId}
                  season={parseInt(selectedSeason)}
                />
              )}
              {activeTab === "statistics" && <StatisticsTab />}
              {activeTab === "clubs" && <ClubsTab />}
              {activeTab === "transfers" && <TransfersTab />}
              {activeTab === "history" && <HistoryTab />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
