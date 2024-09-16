import Ingredient from '../models/Ingredient.js';

// Create a new ingredient
export const createIngredient = async (req, res) => {
  const { name, quantityAvailable, unit } = req.body;

  try {
    const ingredient = await Ingredient.create({ name, quantityAvailable, unit });
    res.status(201).json({ message: 'Ingredient created successfully', ingredient });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Fetch all ingredients
export const getIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.findAll();
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
