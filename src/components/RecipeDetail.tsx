import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { Recipe } from '../types/Recipe';

interface RecipeDetailProps {
  recipes: Recipe[];
  onEditRecipe: (recipe: Recipe) => void;  // Add this line

}

export function RecipeDetail({ recipes, onEditRecipe }: RecipeDetailProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipe = recipes.find(r => r.id === id);

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  const getNutritionPercentage = (value: number, max: number) => {
    return Math.min((value / max) * 100, 100);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg print:shadow-none print:p-4">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          Back to Recipes
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Printer size={18} />
          Print Recipe
        </button>
      </div>

      <div className="print:mt-0">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-64 object-cover rounded-lg mb-6 print:hidden"
        />
        
        <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
        
        <div className="mb-8 print:hidden">
          <h2 className="text-xl font-semibold mb-3">The Story Behind This Recipe</h2>
          <p className="text-gray-700 leading-relaxed">{recipe.story}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8 text-center print:grid-cols-2 print:text-left">
          <div className="bg-gray-50 p-4 rounded-lg print:bg-transparent print:p-0">
            <p className="text-gray-600">Prep Time</p>
            <p className="font-semibold">{recipe.prepTime}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg print:bg-transparent print:p-0">
            <p className="text-gray-600">Cook Time</p>
            <p className="font-semibold">{recipe.cookTime}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg print:bg-transparent print:p-0">
            <p className="text-gray-600">Servings</p>
            <p className="font-semibold">{recipe.servings}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="font-medium">
                    {ingredient.amount} {ingredient.unit}
                  </span>
                  <span>{ingredient.item}</span>
                  {ingredient.notes && (
                    <span className="text-gray-600">({ingredient.notes})</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span className="font-bold text-gray-400">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {recipe.notes && (
          <div className="mb-8 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Recipe Notes</h2>
            <p className="text-gray-700 leading-relaxed">{recipe.notes}</p>
          </div>
        )}

        <div className="bg-gray-50 p-6 rounded-lg print:bg-transparent print:p-0">
          <h2 className="text-xl font-semibold mb-4">Nutritional Information</h2>
          <p className="text-sm text-gray-600 mb-4">Per {recipe.nutritionalInfo.servingSize}</p>
          <div className="space-y-4">
            {[
              { label: 'Calories', value: recipe.nutritionalInfo.calories, max: 800 },
              { label: 'Carbs', value: recipe.nutritionalInfo.carbohydrates, max: 50, unit: 'g' },
              { label: 'Protein', value: recipe.nutritionalInfo.protein, max: 50, unit: 'g' },
              { label: 'Fat', value: recipe.nutritionalInfo.fat, max: 40, unit: 'g' },
              { label: 'Fiber', value: recipe.nutritionalInfo.fiber, max: 20, unit: 'g' },
              { label: 'Net Carbs', value: recipe.nutritionalInfo.netCarbs, max: 30, unit: 'g' }
            ].map(({ label, value, max, unit }) => (
              <div key={label} className="flex items-center gap-4">
                <span className="w-24 text-sm font-medium">{label}:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${getNutritionPercentage(value, max)}%` }}
                  />
                </div>
                <span className="w-16 text-sm text-right">
                  {value}{unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}