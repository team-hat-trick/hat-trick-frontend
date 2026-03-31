import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { MOCK_FAVORITE_PLAYERS } from "../constants/mockData";
import { useAuthStore } from "@/store/authStore";
import { createBrowserSupabaseClient } from "@/lib/utils/supabase/client";
import FollowedTeamRecord from "./FollowedTeamRecord";
import Standing from "./Standing";

export function RightSideBar() {
  const profile = useAuthStore((state) => state.profile);
  const supabase = createBrowserSupabaseClient();

  const [followedTeamIds, setFollowedTeamIds] = useState<number[]>([]);

  useEffect(() => {
    if (!profile) return;

    const fetchFollowedTeamIds = async () => {
      const { data: followsData, error: followsError } = await supabase
        .from("user_follows_teams")
        .select("team_id")
        .eq("user_id", profile?.user_id);
      if (followsData) {
        setFollowedTeamIds(followsData.map((item) => item.team_id));
      }
    };
    fetchFollowedTeamIds();
  }, [profile]);

  console.log(followedTeamIds);

  return (
    <aside className="w-full xl:w-[360px] flex flex-col gap-6 shrink-0">
      <div className="bg-gradient-to-br from-[#0f172b] to-black border border-white/5 rounded-[24px] p-6 relative overflow-hidden">
        {profile ? (
          <FollowedTeamRecord teamIds={followedTeamIds} />
        ) : (
          <Standing />
        )}
      </div>

      {/* Could add another section here like "관심 팀" or "최근 본 경기" */}
    </aside>
  );
}
