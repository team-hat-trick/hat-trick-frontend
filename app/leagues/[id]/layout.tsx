import { createClient } from "@/lib/utils/supabase/server";
import { AuthStoreInitializer } from "@/store/AuthStoreInitializer";

export default async function LeagueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data: profileData } = await supabase
      .from("user_profile")
      .select("*")
      .eq("user_id", user.id)
      .single();
    profile = profileData;
  }

  return (
    <>
      <AuthStoreInitializer user={user} profile={profile} />
      {children}
    </>
  );
}
