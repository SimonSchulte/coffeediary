export interface HandbrewRecipeDefinition {
  key: 'recipe_1' | 'recipe_2';
  label: string;
  beans_g: number;
  output_ml: number;
}

export const HANDBREW_RECIPES: HandbrewRecipeDefinition[] = [
  {key: 'recipe_1', label: '18 g → 300 ml', beans_g: 18, output_ml: 300},
  {key: 'recipe_2', label: '30 g → 500 ml', beans_g: 30, output_ml: 500},
];

export interface Handbrew {
  id: number;
  name: string;
  vendor: string;
  archived?: boolean;
  handbrew_pulls?: HandbrewPull[];
}

export interface HandbrewPull {
  id: number;
  handbrew_id: number;
  created_at: string;
  recipe_key: 'recipe_1' | 'recipe_2';
  grinder_setting: number;
  beans_g: number;
  infusions: number;
  infusion_ml: number;
  output_ml: number;
}

export type NewHandbrewInput = Omit<Handbrew, 'id' | 'handbrew_pulls'>;
export type NewHandbrewPullInput = Omit<HandbrewPull, 'id' | 'created_at'>;
