import express from 'express';
import { createIngredient, getIngredients } from '../controllers/ingredientController.js';

const router = express.Router();

// Ingredient routes
router.post('/', createIngredient); // Create an ingredient
router.get('/', getIngredients);    // Fetch all ingredients

export default router;
