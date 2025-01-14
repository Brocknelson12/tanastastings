import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '../types/Recipe';
import { fractionToDecimal, isValidFraction, decimalToFraction } from '../utils/fractionalUtils';


interface AddRecipeProps {
  onAddRecipe: (recipe: Recipe) => void;
  onEditRecipe: (recipe: Recipe) => void;
  editingRecipe: Recipe | null;
}

export function AddRecipe({ onAddRecipe, onEditRecipe, editingRecipe }: AddRecipeProps) {
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Partial<Recipe>>(
    editingRecipe || {
      title: '',
      description: '',
      image: '',
      cuisine: '',
      dietaryTags: [],
      prepTime: '',
      cookTime: '',
      servings: 4,
      ingredients: [],
      instructions: [],
      story: '',
      notes: '',
      nutritionalInfo: {
        servingSize: '',
        calories: 0,
        carbohydrates: 0,
        fiber: 0,
        netCarbs: 0,
        protein: 0,
        fat: 0,
        sugar: 0
      }
    }
  );
  const [newTag, setNewTag] = useState('');
  const [ingredientFractions, setIngredientFractions] = useState<string[]>(
    editingRecipe?.ingredients.map(ing => decimalToFraction(ing.amount)) || []
  );

  useEffect(() => {
    if (editingRecipe) {
      setRecipe(editingRecipe);
    }
  }, [editingRecipe]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRecipe) {
      const updatedRecipe: Recipe = {
        ...recipe as Recipe,
        lastModified: new Date().toISOString()
      };
      onEditRecipe(updatedRecipe);
    } else {
      const newRecipe: Recipe = {
        ...recipe as Recipe,
        id: `recipe-${Date.now()}`,
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      onAddRecipe(newRecipe);
    }
    navigate('/');
  };

  const addIngredient = () => {
    setRecipe(prev => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), { item: '', amount: 0, unit: '', notes: '' }]
    }));
  };

  const addInstruction = () => {
    setRecipe(prev => ({
      ...prev,
      instructions: [...(prev.instructions || []), '']
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !recipe.dietaryTags?.includes(newTag.trim())) {
      setRecipe(prev => ({
        ...prev,
        dietaryTags: [...(prev.dietaryTags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setRecipe(prev => ({
      ...prev,
      dietaryTags: prev.dietaryTags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-primary mb-8">
        {editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}
      </h1>

      <div className="space-y-8">
        <section>
          <h2 className="section-title">Basic Information</h2>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              required
              value={recipe.title}
              onChange={e => setRecipe(prev => ({ ...prev, title: e.target.value }))}
              className="form-input"
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              required
              value={recipe.description}
              onChange={e => setRecipe(prev => ({ ...prev, description: e.target.value }))}
              className="form-textarea"
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              type="url"
              required
              value={recipe.image}
              onChange={e => setRecipe(prev => ({ ...prev, image: e.target.value }))}
              className="form-input"
              placeholder="Enter image URL"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cuisine</label>
            <select
              required
              value={recipe.cuisine}
              onChange={e => setRecipe(prev => ({ ...prev, cuisine: e.target.value }))}
              className="form-input"
            >
              <option value="">Select cuisine</option>
              <option value="Asian">Asian</option>
              <option value="Mediterranean">Mediterranean</option>
              <option value="Italian">Italian</option>
              <option value="Mexican">Mexican</option>
              <option value="American">American</option>
            </select>
          </div>
        </section>

        <section>
          <h2 className="section-title">Recipe Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-group">
              <label className="form-label">Prep Time</label>
              <input
                type="text"
                required
                value={recipe.prepTime}
                onChange={e => setRecipe(prev => ({ ...prev, prepTime: e.target.value }))}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cook Time</label>
              <input
                type="text"
                required
                value={recipe.cookTime}
                onChange={e => setRecipe(prev => ({ ...prev, cookTime: e.target.value }))}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Servings</label>
              <input
                type="number"
                required
                value={recipe.servings}
                onChange={e => setRecipe(prev => ({ ...prev, servings: parseInt(e.target.value) }))}
                className="form-input"
                min={1}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Dietary Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {recipe.dietaryTags?.map(tag => (
                <span key={tag} className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-2">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-primary hover:text-primary-dark"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                className="form-input"
                placeholder="Add a dietary tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="btn btn-success whitespace-nowrap"
              >
                Add Tag
              </button>
            </div>
          </div>
        </section>

        <section>
        <h2 className="section-title">Ingredients</h2>
        {recipe.ingredients?.map((ingredient, index) => (
          <div key={index} className="array-input">
            <input
              type="text"
              placeholder="Item"
              required
              value={ingredient.item}
              onChange={e => {
                const newIngredients = [...(recipe.ingredients || [])];
                newIngredients[index].item = e.target.value;
                setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
              }}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Amount (e.g., 1 1/2)"
              required
              value={ingredientFractions[index] || ''}
              onChange={e => {
                const value = e.target.value;
                const newFractions = [...ingredientFractions];
                newFractions[index] = value;
                setIngredientFractions(newFractions);

                if (isValidFraction(value)) {
                  const decimal = fractionToDecimal(value);
                  const newIngredients = [...(recipe.ingredients || [])];
                  newIngredients[index].amount = decimal;
                  setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
                }
              }}
              className={`form-input ${!isValidFraction(ingredientFractions[index]) ? 'border-red-500' : ''}`}
            />
            <input
              type="text"
              placeholder="Unit"
              required
              value={ingredient.unit}
              onChange={e => {
                const newIngredients = [...(recipe.ingredients || [])];
                newIngredients[index].unit = e.target.value;
                setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
              }}
              className="form-input w-32"
            />
              <input
                type="text"
                placeholder="Notes (optional)"
                value={ingredient.notes || ''}
                onChange={e => {
                  const newIngredients = [...(recipe.ingredients || [])];
                  newIngredients[index].notes = e.target.value;
                  setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
                }}
                className="form-input"
              />
              <button
                type="button"
                onClick={() => {
                  const newIngredients = [...(recipe.ingredients || [])];
                  newIngredients.splice(index, 1);
                  setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
                }}
                className="btn btn-danger"
              >
                Remove
              </button>
            </div>
          ))}
          <button 
          type="button" 
          onClick={() => {
            addIngredient();
            setIngredientFractions(prev => [...prev, '']);
          }} 
          className="btn btn-success mt-2"
        >
          Add Ingredient
        </button>
        </section>

        <section>
          <h2 className="section-title">Instructions</h2>
          {recipe.instructions?.map((instruction, index) => (
            <div key={index} className="array-input">
              <textarea
                required
                value={instruction}
                onChange={e => {
                  const newInstructions = [...(recipe.instructions || [])];
                  newInstructions[index] = e.target.value;
                  setRecipe(prev => ({ ...prev, instructions: newInstructions }));
                }}
                className="form-textarea"
                placeholder={`Step ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => {
                  const newInstructions = [...(recipe.instructions || [])];
                  newInstructions.splice(index, 1);
                  setRecipe(prev => ({ ...prev, instructions: newInstructions }));
                }}
                className="btn btn-danger"
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addInstruction} className="btn btn-success mt-2">
            Add Instruction
          </button>
        </section>

        <section>
          <h2 className="section-title">Story</h2>
          <div className="form-group">
            <textarea
              required
              value={recipe.story}
              onChange={e => setRecipe(prev => ({ ...prev, story: e.target.value }))}
              className="form-textarea"
              rows={4}
              maxLength={1000}
            />
          </div>
        </section>

        <section>
          <h2 className="section-title">Notes</h2>
          <div className="form-group">
            <textarea
              value={recipe.notes}
              onChange={e => setRecipe(prev => ({ ...prev, notes: e.target.value }))}
              className="form-textarea"
              rows={4}
              maxLength={1000}
              placeholder="Add any additional notes, tips, or variations for this recipe..."
            />
          </div>
        </section>

        <section>
          <h2 className="section-title">Nutritional Information</h2>
          <div className="nutrition-grid">
            <div className="form-group">
              <label className="form-label">Serving Size</label>
              <input
                type="text"
                required
                value={recipe.nutritionalInfo?.servingSize}
                onChange={e => setRecipe(prev => ({
                  ...prev,
                  nutritionalInfo: { ...(prev.nutritionalInfo || {}), servingSize: e.target.value }
                }))}
                className="form-input"
              />
            </div>
            {[
              { label: 'Calories', key: 'calories' },
              { label: 'Carbohydrates (g)', key: 'carbohydrates' },
              { label: 'Fiber (g)', key: 'fiber' },
              { label: 'Net Carbs (g)', key: 'netCarbs' },
              { label: 'Protein (g)', key: 'protein' },
              { label: 'Fat (g)', key: 'fat' },
              { label: 'Sugar (g)', key: 'sugar' }
            ].map(({ label, key }) => (
              <div key={key} className="form-group">
                <label className="form-label">{label}</label>
                <input
                  type="number"
                  required
                  value={recipe.nutritionalInfo?.[key as keyof typeof recipe.nutritionalInfo]}
                  onChange={e => setRecipe(prev => ({
                    ...prev,
                    nutritionalInfo: { ...(prev.nutritionalInfo || {}), [key]: parseInt(e.target.value) }
                  }))}
                  className="form-input"
                  min={0}
                />
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {editingRecipe ? 'Save Changes' : 'Save Recipe'}
          </button>
        </div>
      </div>
    </form>
  );
}