import express from 'express';
import { createIngredient, getIngredients, updateIngredient } from '../controllers/ingredientController.js';

const router = express.Router();

// Ingredient routes
router.post('/', createIngredient); // Create an ingredient
router.get('/', getIngredients);    // Fetch all ingredients
router.put('/:id', updateIngredient); // Admin updates ingredient inventory


export default router;
