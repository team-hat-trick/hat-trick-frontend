"use client";

import { Competition } from "@/features/onboarding/types";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { createBrowserSupabaseClient } from "@/lib/utils/supabase/client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGetStandings } from "../hooks/useGetStandings";
import { BIG_5_CODES } from "../constants";
import { ApiResopnse, Standings } from "../types/dashboard";
import Image from "next/image";

const Standing = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [leagueType, setLeagueType] = useState<Competition | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => {
    if (isDropdownOpen) setIsDropdownOpen(false);
  });

  const results = useGetStandings(BIG_5_CODES);

  const currentLeagueData = results.find((result) => {
    const data = result.data as ApiResopnse | undefined;
    if (!data) return false;
    return (
      data.competition?.id === leagueType?.id || 
      data.competition?.name === leagueType?.name
    );
  });

  const selectedData = currentLeagueData?.data as ApiResopnse | undefined;
  // standings 배열에는 주로 'TOTAL', 'HOME', 'AWAY' 등의 타입이 있으며, 일반적으로 [0]이 'TOTAL'입니다.
  const standingsTable = selectedData?.standings?.[0]?.table || [];
  const displayLimit = 5;
  const displayedStandings = isExpanded ? standingsTable : standingsTable.slice(0, displayLimit);

  useEffect(() => {
    const fetchCompetitions = async () => {
      const supabase = createBrowserSupabaseClient();
      const { data } = await supabase.from("competitions").select("*");

      if (data) {
        setCompetitions(data as Competition[]);
        setLeagueType(
          data.find((item) => item.name === "Premier League") as Competition,
        );
      }
    };

    fetchCompetitions();
  }, []);

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <span className="text-white font-black tracking-tight text-sm">
            리그 순위
          </span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[#f8fafc] text-xs font-bold hover:bg-white/10 transition-colors justify-between shadow-sm"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="flex items-center gap-1.5">
              {leagueType?.name || "리그 선택"}
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full mt-2 right-0 w-[140px] bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              {competitions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setLeagueType(item);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-xs font-bold transition-colors hover:bg-white/5 ${
                    leagueType?.id === item.id
                      ? "text-[#00bc7d] bg-[#00bc7d]/5"
                      : "text-[#cad5e2]"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full bg-white/5 border border-white/10 rounded-2xl flex flex-col overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[20px_1fr_28px_32px_32px] md:grid-cols-[24px_1fr_32px_40px_36px] gap-2 md:gap-3 text-[10px] md:text-xs text-[#cad5e2] font-semibold px-4 py-3 border-b border-white/10 text-center bg-black/20">
          <div className="text-left">#</div>
          <div className="text-left pl-1">클럽</div>
          <div>경기</div>
          <div>득실</div>
          <div>승점</div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col">
          {standingsTable && standingsTable.length > 0 ? (
            displayedStandings.map((row) => (
              <div
                key={row.team.id}
                className="grid grid-cols-[20px_1fr_28px_32px_32px] md:grid-cols-[24px_1fr_32px_40px_36px] gap-2 md:gap-3 items-center text-xs md:text-sm text-white font-medium px-4 py-3 border-b border-white/5 hover:bg-white/10 transition-colors text-center"
              >
                <div className="text-left text-white/50 font-bold">{row.position}</div>
                <div className="flex items-center gap-2.5 text-left min-w-0">
                  <Image width={16} height={16} src={row.team.crest} alt={row.team.name} className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 object-contain" />
                  <span className="font-bold whitespace-nowrap overflow-hidden text-ellipsis">{row.team.shortName}</span>
                </div>
                <div className="text-white/60">{row.playedGames}</div>
                <div className="text-white/60 font-semibold">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</div>
                <div className="font-black text-[#00bc7d]">{row.points}</div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-white/40 text-xs font-medium">
              순위 데이터가 없습니다.
            </div>
          )}
        </div>

        {/* Toggle Expand / Collapse */}
        {standingsTable && standingsTable.length > displayLimit && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex justify-center items-center gap-1.5 py-3 text-xs font-bold text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
          >
            {isExpanded ? (
              <>
                접기 <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                더보기 <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Standing;
