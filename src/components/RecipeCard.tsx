import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Printer, Edit2, Trash2} from 'lucide-react';
import { Recipe } from '../types/Recipe';
import { useNavigate } from 'react-router-dom';

interface RecipeCardProps {
  recipe: Recipe;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (recipeId: string) => void;
}

export function RecipeCard({ recipe, onEditRecipe, onDeleteRecipe }: RecipeCardProps) {
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      onDeleteRecipe(recipe.id);
    }
  };

  

  const getNutritionPercentage = (value: number, max: number) => {
    return Math.min((value / max) * 100, 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={recipe.image} 
        alt={recipe.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900 truncate flex-1" title={recipe.title}>
            {recipe.title}
          </h3>
          <div className="flex items-center gap-2 ml-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              title="Show Info"
            >
              {showInfo ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <button
              onClick={() => onEditRecipe(recipe)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              title="Edit Recipe"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 transition-colors"
              title="Delete Recipe"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              className="text-primary hover:text-primary-dark transition-colors"
              title="View Recipe"
            >
              <Printer size={18} />
            </button>
          </div>
        </div>

       

        {showInfo && (
          <>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-gray-600">Prep</p>
                  <p className="font-medium">{recipe.prepTime}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-gray-600">Cook</p>
                  <p className="font-medium">{recipe.cookTime}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-gray-600">Servings</p>
                  <p className="font-medium">{recipe.servings}</p>
                </div>
              </div>
               <div className="flex flex-wrap gap-2 mb-4">
          {recipe.dietaryTags.map(tag => (
            <span 
              key={tag} 
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-primary">Nutritional Information</h4>
                <p className="text-sm text-gray-600 mb-2">Per {recipe.nutritionalInfo.servingSize}</p>
                <div className="space-y-2">
                  {[
                    { label: 'Calories', value: recipe.nutritionalInfo.calories, max: 800 },
                    { label: 'Carbs', value: recipe.nutritionalInfo.carbohydrates, max: 50, unit: 'g' },
                    { label: 'Protein', value: recipe.nutritionalInfo.protein, max: 50, unit: 'g' },
                    { label: 'Fat', value: recipe.nutritionalInfo.fat, max: 40, unit: 'g' },
                    { label: 'Net Carbs', value: recipe.nutritionalInfo.netCarbs, max: 30, unit: 'g' }
                  ].map(({ label, value, max, unit }) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="w-20 text-sm text-gray-600">{label}:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${getNutritionPercentage(value, max)}%` }}
                        />
                      </div>
                      <span className="w-12 text-sm text-right font-medium">
                        {value}{unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}