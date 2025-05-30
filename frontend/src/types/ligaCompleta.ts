export type Posiciones = {
  position: number;
  team: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  playedGames: number,
  form: string,
  won: number,
  draw: number,
  lost: number,
  points: number,
  goalsFor: number,
  goalsAgainst: number,
  goalDifference: number
}

export type LigaCompleta = {
    id: number;
    name: string;
    emblem: string;
    tabla: Posiciones[];
}