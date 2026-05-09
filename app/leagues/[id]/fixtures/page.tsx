import { LeagueDetailClient } from "@/features/leagues/components/LeagueDetailClient";

const LeagueFixturesPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await props.params;

  return <LeagueDetailClient leagueId={parseInt(id)} tab="fixtures" />;
};

export default LeagueFixturesPage;