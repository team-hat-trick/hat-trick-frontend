interface Props {
  leagueId: number;
  season: number;
}

const TeamStatisticsTab = ({ leagueId, season }: Props) => {
  return (
    <div className="flex flex-col w-full pb-12 pt-4 gap-12">
      <div className="w-full">
        <h2 className="text-2xl md:text-2xl font-black text-white tracking-tight mb-6 px-2 flex items-center gap-2">
          주요 통계
        </h2>
      </div>
    </div>
  );
};

export default TeamStatisticsTab;
