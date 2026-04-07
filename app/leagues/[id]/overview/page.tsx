import { LeagueDetailClient } from "@/features/leagues/components/LeagueDetailClient";

const LeagueOverviewPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await props.params;

  return <LeagueDetailClient leagueId={parseInt(id)} />;
};

export default LeagueOverviewPage;
