import { Recipe } from '../types/Recipe';

export function exportRecipes(recipes: Recipe[]) {
  const exportData = {
    recipes,
    metadata: {
      exportDate: new Date().toISOString(),
      version: "1.0",
      totalRecipes: recipes.length
    }
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `recipes-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importRecipesFromJson(jsonString: string): Recipe[] {
  try {
    const data = JSON.parse(jsonString);
    
    if (!data.recipes || !Array.isArray(data.recipes)) {
      throw new Error('Invalid recipe data format');
    }
    
    return data.recipes;
  } catch (error) {
    throw new Error('Failed to parse JSON data');
  }
}