import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import { PlusCircle, Save, Upload, Utensils, Search } from 'lucide-react';
import { Recipe } from './types/Recipe';
import { RecipeGrid } from './components/RecipeGrid';
import { RecipeDetail } from './components/RecipeDetail';
import { AddRecipe } from './components/AddRecipe';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { importRecipesFromJson } from './utils/recipeStorage';
import { fetchRecipes, saveRecipe, deleteRecipe } from './utils/api';

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [importText, setImportText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const loadedRecipes = await fetchRecipes();
      setRecipes(loadedRecipes);
    } catch (error) {
      console.error('Failed to load recipes:', error);
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    try {
      await deleteRecipe(recipeId);
      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      alert('Failed to delete recipe');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImport = () => {
    try {
      const importedRecipes = importRecipesFromJson(importText);
      setRecipes(prev => [...prev, ...importedRecipes]);
      setImportText('');
      setShowImportModal(false);
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import recipes. Please check the JSON format.');
    }
  };

  const handleSaveToDb = async () => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      const existingRecipes = await fetchRecipes();
      const existingIds = new Set(existingRecipes.map((recipe: { id: any; }) => recipe.id));
      
      // Only save recipes that don't already exist in the database
      const newRecipes = recipes.filter(recipe => !existingIds.has(recipe.id));
      
      for (const recipe of newRecipes) {
        await saveRecipe(recipe);
      }
      
      if (newRecipes.length > 0) {
        alert(`${newRecipes.length} new recipes saved to database successfully!`);
      } else {
        alert('No new recipes to save. All recipes are already in the database.');
      }
      
      // Reload recipes from the database
      await loadRecipes();
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save recipes to database.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddRecipe = (recipe: Recipe) => {
    setRecipes(prev => [...prev, recipe]);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setRecipes(prev => prev.map(r => r.id === recipe.id ? recipe : r));
    setEditingRecipe(null);
  };

  const startEditingRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    navigate('/add-recipe');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center px-4 py-3">
            <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
              <Utensils size={24} />
              Tana's Tastings
            </Link>
            <nav className="flex items-center gap-6">
              <Link 
                to="/" 
                className={`text-gray-600 hover:text-gray-900 ${isActive('/') ? 'font-bold' : ''}`}
              >
                Recipes
              </Link>
              <Link 
                to="/about" 
                className={`text-gray-600 hover:text-gray-900 ${isActive('/about') ? 'font-bold' : ''}`}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className={`text-gray-600 hover:text-gray-900 ${isActive('/contact') ? 'font-bold' : ''}`}
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {location.pathname === '/' && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative flex-1 w-full" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSearchSuggestions(true);
                  }}
                  placeholder="Search recipes by name or dietary tags..."
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              {showSearchSuggestions && searchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {recipes
                    .filter(recipe => 
                      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      recipe.dietaryTags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
                    .slice(0, 5)
                    .map(recipe => (
                      <div
                        key={recipe.id}
                        className="p-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setSearchTerm(recipe.title);
                          setShowSearchSuggestions(false);
                          navigate(`/recipe/${recipe.id}`);
                        }}
                      >
                        <div className="font-medium">{recipe.title}</div>
                        <div className="text-sm text-gray-500">
                          {recipe.dietaryTags.join(', ')}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={handleSaveToDb}
                className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
              >
                <Save size={16} />
                Save to DB
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
              >
                <Upload size={16} />
                Import
              </button>
              <button 
                onClick={() => navigate('/add-recipe')}
                className="flex items-center gap-1 px-3 py-2 bg-success text-white rounded-md hover:bg-success-dark text-sm ml-2"
              >
                <PlusCircle size={16} />
                Add Recipe
              </button>
            </div>
          </div>
        </div>
      )}

      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">Import Recipes</h2>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full h-64 p-2 border rounded-md mb-4"
              placeholder="Paste your recipe JSON here..."
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
        <Route 
            path="/" 
            element={
              <RecipeGrid
                recipes={recipes}
                searchTerm={searchTerm}
                onEditRecipe={startEditingRecipe}
                onDeleteRecipe={handleDeleteRecipe}
              />
            } 
          />
          <Route 
            path="/recipe/:id" 
            element={<RecipeDetail recipes={recipes} onEditRecipe={startEditingRecipe} />} 
          />
          <Route 
            path="/add-recipe" 
            element={
              <AddRecipe 
                onAddRecipe={handleAddRecipe} 
                onEditRecipe={handleEditRecipe}
                editingRecipe={editingRecipe}
              />
            } 
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;