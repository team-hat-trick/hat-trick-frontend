import { LeagueDetailClient } from "@/features/leagues/components/LeagueDetailClient";

const PlayerStatisticsPage = async (props: { params: { id: string } }) => {
  const { id } = await props.params;

  return <LeagueDetailClient leagueId={parseInt(id)} tab="player-statistics" />;
};

export default PlayerStatisticsPage;
