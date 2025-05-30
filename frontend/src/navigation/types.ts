export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    League: { id: number }
    Matches: { teamId: number, competitionId: number };
  };