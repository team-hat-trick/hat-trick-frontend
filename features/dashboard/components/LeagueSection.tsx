import React from "react";
import { ChevronRight } from "lucide-react";
import { FixtureList, League } from "../types/dashboard";
import { MatchCard } from "./MatchCard";
import Link from "next/link";
import Image from "next/image";

interface LeagueSectionProps {
  league: League;
  matches: FixtureList[];
}

export function LeagueSection({ league, matches }: LeagueSectionProps) {
  // if (matches.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* League Header */}
      <Link
        href={`/leagues/${league.id}/overview`}
        className="flex items-center gap-3 px-2 w-full"
      >
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0 border border-white/10">
          <Image
            src={league.logo}
            alt={league.name}
            width={24}
            height={24}
            className="w-[70%] h-[70%] object-contain"
          />
        </div>
        <h3 className="font-bold text-2xl text-white tracking-[-0.45px]">
          {league.name}
          {league.flag && ` - ${league.country}`}
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
            <MatchCard key={match.fixture.id} match={match} />
          ))}
        </div>
      }
    </div>
  );
}
