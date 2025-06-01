import { useQuery } from "@tanstack/react-query";

interface Match {
  id: string;
  league: string;
  team1: string;
  team2: string;
  score1: string;
  score2: string;
  status: string;
  details: string;
  isLive: boolean;
}

const mockMatches: Match[] = [
  {
    id: "1",
    league: "IPL 2024",
    team1: "Mumbai Indians",
    team2: "Chennai Super Kings",
    score1: "185/6",
    score2: "142/8",
    status: "LIVE",
    details: "MI won by 43 runs • Man of the Match: R. Sharma",
    isLive: false
  },
  {
    id: "2",
    league: "Premier League",
    team1: "Manchester City",
    team2: "Liverpool",
    score1: "3",
    score2: "1",
    status: "FT",
    details: "Final Time • Goals: Haaland 2, De Bruyne 1",
    isLive: false
  },
  {
    id: "3",
    league: "La Liga",
    team1: "Real Madrid",
    team2: "Barcelona",
    score1: "vs",
    score2: "-",
    status: "18:30",
    details: "El Clásico • Santiago Bernabéu",
    isLive: false
  }
];

export function SportsScores() {
  // In a real implementation, this would fetch from a sports API
  const { data: matches = mockMatches, isLoading } = useQuery<Match[]>({
    queryKey: ['/api/sports'],
    enabled: false, // Disable automatic fetching for mock data
  });

  if (isLoading) {
    return (
      <section className="mb-8">
        <h3 className="text-3xl font-bold mb-6 flex items-center">
          <i className="fas fa-trophy text-primary mr-4"></i>
          Live Sports Scores
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="tv-card bg-card rounded-3xl p-6 animate-pulse">
              <div className="h-6 bg-muted rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                <div className="h-8 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h3 className="text-3xl font-bold mb-6 flex items-center">
        <i className="fas fa-trophy text-primary mr-4"></i>
        Live Sports Scores
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
          <div
            key={match.id}
            className="tv-card tv-focus bg-card rounded-3xl p-6"
            tabIndex={0}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                match.status === 'LIVE' 
                  ? 'bg-red-500 text-white' 
                  : match.status === 'FT'
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 text-white'
              }`}>
                {match.status}
              </span>
              <span className="text-muted-foreground text-sm">
                {match.league}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">{match.team1}</span>
                <span className="text-2xl font-bold text-primary">
                  {match.score1}
                </span>
              </div>
              <div className="text-center text-muted-foreground text-sm">
                {match.score1 === 'vs' ? 'vs' : 'vs'}
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">{match.team2}</span>
                <span className="text-2xl font-bold">
                  {match.score2}
                </span>
              </div>
            </div>
            
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {match.details}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
