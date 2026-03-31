import { LeagueDetailClient } from "@/features/leagues/components/LeagueDetailClient";
import { Competition } from "@/features/onboarding/types";
import { createClient } from "@/lib/utils/supabase/server";

export default async function LeagueDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const supabase = await createClient();
  const { data } = await supabase
    .from("competitions")
    .select("*")
    .eq("id", id)
    .single();

  return (
    <LeagueDetailClient
      leagueId={parseInt(id)}
      leagueData={data as Competition}
    />
  );
}
