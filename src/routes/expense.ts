import express from 'express';
import { createExpense, getExpense, getExpenses, removeExpense, updateExpense } from '../controllers/expense';
import { authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', authorize(['Admin']), getExpenses);
router.get('/:id', authorize(), getExpense);
router.post('/', authorize(), createExpense);
router.patch('/:id', authorize(), updateExpense);
router.delete('/:id', authorize(), removeExpense);

export = router;