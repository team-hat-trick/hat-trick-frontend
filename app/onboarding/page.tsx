import { ProfileSetupStep } from "@/features/onboarding";
import { createClient } from "@/lib/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
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

  console.log(userProfile);

  // Fallback to auth metadata if profile data is missing/empty
  const name = userProfile?.name || user.user_metadata?.full_name || "";
  //@ts-ignore - bio and profile_image_url are new columns not yet in generated types
  const bio = userProfile?.bio || "";
  //@ts-ignore
  const profileImageUrl =
    userProfile?.avatar_url || user.user_metadata?.avatar_url || "";

  return (
    <main className="w-full h-screen bg-[#050505]">
      <ProfileSetupStep
        initialName={name}
        initialBio={bio}
        initialImageUrl={profileImageUrl}
      />
    </main>
  );
}
