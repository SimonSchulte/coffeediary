export interface EspressoRecipe {
  gramms: number;
  ratio: number;
  grinder_setting: number;
  runtime: number;
}

export interface Espresso extends EspressoRecipe {
  id: number;
  name: string;
  vendor: string;
  archived?: boolean;
  espresso_pulls?: EspressoPull[];
}

export interface EspressoPull {
  id: number;
  espresso_id: number;
  created_at: string;
  runtime: number;
  output: number;
  grinder_setting: number;
  gramms: number;
}

export type NewEspressoInput = Omit<Espresso, 'id' | 'espresso_pulls'>;

export type NewEspressoPullInput = Omit<EspressoPull, 'id' | 'created_at'>;
