import express from 'express';
import { createExpense, getExpense, getExpenses, removeExpense, updateExpense } from '../controllers/expense';

const router = express.Router();

router.get('/', getExpenses);
router.get('/:id', getExpense);
router.post('/', createExpense);
router.patch('/:id', updateExpense);
router.delete('/:id', removeExpense);

export = router;