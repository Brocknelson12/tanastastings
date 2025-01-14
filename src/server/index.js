import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
console.log('Connecting to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Recipe Schema
const recipeSchema = new mongoose.Schema({
  id: String,
  title: String,
  image: String,
  description: String,
  cuisine: String,
  dietaryTags: [String],
  prepTime: String,
  cookTime: String,
  servings: Number,
  ingredients: [{
    item: String,
    amount: Number,
    unit: String,
    notes: String
  }],
  instructions: [String],
  story: String,
  notes: String,
  nutritionalInfo: {
    servingSize: String,
    calories: Number,
    carbohydrates: Number,
    fiber: Number,
    netCarbs: Number,
    protein: Number,
    fat: Number,
    sugar: Number
  },
  dateCreated: String,
  lastModified: String,
  importedAt: Date
});

const RecipeModel = mongoose.model('Recipe', recipeSchema);

// Routes
app.get('/api/recipes', async (req, res) => {
  try {
    console.log('Fetching recipes from MongoDB...');
    const recipes = await RecipeModel.find({}).lean().select('-_id -__v');
    console.log(`Fetched ${recipes.length} recipes successfully`);
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

app.post('/api/recipes', async (req, res) => {
  try {
    const recipe = new RecipeModel(req.body);
    await recipe.save();
    const savedRecipe = recipe.toObject();
    // delete savedRecipe._id;
    // delete savedRecipe.__v;
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

app.put('/api/recipes/:id', async (req, res) => {
  try {
    const recipe = await RecipeModel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, lean: true }
    ).select('-_id -__v');
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
});

app.delete('/api/recipes/:id', async (req, res) => {
  try {
    const recipe = await RecipeModel.findOneAndDelete({ id: req.params.id });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});