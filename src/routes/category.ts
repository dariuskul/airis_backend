import express from 'express';
import { createCategory, getCategories, updateCategory } from '../controllers/category';
import { authorize } from '../middleware/auth';

const router = express.Router();

router.post('/', authorize(['Admin']), createCategory);
router.get('/', authorize(['Admin']), updateCategory);
router.patch('/:id', authorize(), getCategories);
router.delete('/', authorize(), getCategories);


export = router;