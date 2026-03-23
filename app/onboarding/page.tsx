import { ProfileSetupStep, TeamFollowStep, PlayerFollowStep } from "@/features/onboarding";
import { Competition, FollowedTeam, Team, Player, FollowedPlayer } from "@/features/onboarding/types";
import { createClient } from "@/lib/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) {
  const { step } = await searchParams;
  const currentStep = step ? parseInt(step, 10) : 1;

  const supabase = await createClient();

  // Get current user session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login"); // Redirect to login if unauthenticated
  }

  // Fetch the user's profile from the database
  const { data: userProfile, error: profileError } = await supabase
    .from("user_profile")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { data: competitions, error: competitionsError } = await supabase
    .from("competitions")
    .select("*");
  const { data: teams, error: teamsError } = await supabase
    .from("teams")
    .select("*");
  const { data: followedTeams, error: followedTeamsError } = await supabase
    .from("user_team_follows")
    .select("*")
    .eq("user_id", user.id);
  const { data: players, error: playersError } = await supabase
    .from("players")
    .select("*");
  const { data: followedPlayers, error: followedPlayersError } = await supabase
    .from("user_player_follows")
    .select("*")
    .eq("user_id", user.id);

  console.log(followedTeams);

  // Fallback to auth metadata if profile data is missing/empty
  const name = userProfile?.name || user.user_metadata?.full_name || "";
  //@ts-ignore - bio and profile_image_url are new columns not yet in generated types
  const bio = userProfile?.bio || "";
  //@ts-ignore
  const profileImageUrl =
    userProfile?.avatar_url || user.user_metadata?.avatar_url || "";

  return (
    <main className="w-full h-screen bg-[#050505]">
      {currentStep === 1 && (
        <ProfileSetupStep
          initialName={name}
          initialBio={bio}
          initialImageUrl={profileImageUrl}
        />
      )}
      {currentStep === 2 && (
        <TeamFollowStep
          competitions={competitions as Competition[]}
          teams={teams as Team[]}
          followedTeams={followedTeams as FollowedTeam[]}
        />
      )}
      {currentStep === 3 && (
        <PlayerFollowStep
          teams={teams as Team[]}
          players={players as Player[]}
          followedPlayers={followedPlayers as FollowedPlayer[]}
        />
      )}
    </main>
  );
}
