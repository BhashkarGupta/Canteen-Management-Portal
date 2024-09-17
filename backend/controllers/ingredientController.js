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

// Update ingredient inventory (Admin)
export const updateIngredient = async (req, res) => {
  const { id } = req.params;
  const { quantityAvailable } = req.body;

  try {
    const ingredient = await Ingredient.findByPk(id);
    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    ingredient.quantityAvailable = quantityAvailable;
    await ingredient.save();

    res.status(200).json({ message: 'Ingredient updated successfully', ingredient });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
    console.log(error);
  }
};
