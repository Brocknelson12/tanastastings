import { Recipe } from '../types/Recipe';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function fetchRecipes() {
  const response = await fetch(`${API_BASE_URL}/recipes`);
  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }
  return response.json();
}

export async function saveRecipe(recipe: Recipe) {
  const response = await fetch(`${API_BASE_URL}/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipe),
  });
  if (!response.ok) {
    throw new Error('Failed to save recipe');
  }
  return response.json();
}

export async function updateRecipe(id: string, recipe: Recipe) {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipe),
  });
  if (!response.ok) {
    throw new Error('Failed to update recipe');
  }
  return response.json();
}

export async function deleteRecipe(id: string) {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete recipe');
  }
  return response.json();
}