import { LeagueDetailClient } from "@/features/leagues/components/LeagueDetailClient";

const TeamStatisticsPage = async (props: { params: { id: string } }) => {
  const { id } = await props.params;

  return <LeagueDetailClient leagueId={parseInt(id)} tab="team-statistics" />;
};

export default TeamStatisticsPage;
