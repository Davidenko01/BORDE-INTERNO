export type Partido = {
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