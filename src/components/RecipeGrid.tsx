import React from 'react';
import { Recipe } from '../types/Recipe';
import { RecipeCard } from './RecipeCard';

interface RecipeGridProps {
  recipes: Recipe[];
  searchTerm: string;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (recipeId: string) => void;
}

export function RecipeGrid({ recipes, searchTerm, onEditRecipe, onDeleteRecipe }: RecipeGridProps) {
  const filteredRecipes = recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.dietaryTags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredRecipes.map(recipe => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onEditRecipe={onEditRecipe}
          onDeleteRecipe={onDeleteRecipe}
        />
      ))}
    </div>
  );
}