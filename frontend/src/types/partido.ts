type Partido = {
  date: string;
  id: number;
  homeTeam: {
    id: number;
    shortName: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    shortName: string;
    crest: string;
  };
  score: {
    home: number;
    away: number;
    winner: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null;
  };
};

export type Partidos = {
  team: string,
  competition: string,
  matches: Partido[],
};

type TeamProps = {
  name: string;
  logo: string;
  goals: number;
};

export type MatchCardProps = {
  homeTeam: TeamProps;
  awayTeam: TeamProps;
  date: string;
};