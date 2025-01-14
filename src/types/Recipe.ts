export interface Recipe {
  id: string;
  title: string;
  image: string;
  description: string;
  cuisine: string;
  dietaryTags: string[];
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredients: {
    item: string;
    amount: number;
    unit: string;
    notes?: string;
  }[];
  instructions: string[];
  story: string;
  notes: string; // New field for recipe notes
  nutritionalInfo: {
    servingSize: string;
    calories: number;
    carbohydrates: number;
    fiber: number;
    netCarbs: number;
    protein: number;
    fat: number;
    sugar: number;
  };
  dateCreated: string;
  lastModified: string;
}