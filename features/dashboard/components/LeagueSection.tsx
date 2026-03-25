import React from "react";
import { ChevronRight } from "lucide-react";
import { Competition } from "@/features/onboarding/types";
import { MatchData } from "../types/dashboard";
import { MatchCard } from "./MatchCard";
import Link from "next/link";

interface LeagueSectionProps {
  league: Competition;
  matches: MatchData[];
}

export function LeagueSection({ league, matches }: LeagueSectionProps) {
  // if (matches.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* League Header */}
      <Link
        href={`/leagues/${league.id}`}
        className="flex items-center gap-3 px-2 w-full"
      >
        <span className="text-2xl">{league.country_flag}</span>
        <h3 className="font-bold text-2xl text-white tracking-[-0.45px]">
          {league.name}
        </h3>
        <div className="flex-1 h-px bg-white/5 ml-2" />
        <button className="w-4 h-4 text-[#62748e] hover:text-white transition-colors">
          <ChevronRight className="w-full h-full" />
        </button>
      </Link>

      {/* Match List */}
      {
        <div className="flex flex-col gap-4">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      }
    </div>
  );
}
