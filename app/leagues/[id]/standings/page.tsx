import { LeagueDetailClient } from "@/features/leagues/components/LeagueDetailClient";

const LeagueStandingPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await props.params;

  return <LeagueDetailClient leagueId={parseInt(id)} tab="standings" />;
};

export default LeagueStandingPage;
