import express from 'express';
import { createExpense, getAllUserExpenses, getExpense, getExpenses, removeExpense, updateExpense } from '../controllers/expense';
import { authorize } from '../middleware/auth';
import { auth } from '../services/auth';

const router = express.Router();

router.get('/', authorize(), getAllUserExpenses);
router.get('/', authorize(['Admin']), getExpenses);
router.get('/:id', authorize(), getExpense);
router.post('/', authorize(), createExpense);
router.patch('/:id', authorize(), updateExpense);
router.delete('/:id', authorize(), removeExpense);

export = router;