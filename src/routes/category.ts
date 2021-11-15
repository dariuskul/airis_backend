import express from 'express';
import { createCategory, getCategories, removeCategory, updateCategory } from '../controllers/category';
import { authorize } from '../middleware/auth';

const router = express.Router();

router.post('/', authorize(['Admin']), createCategory);
router.get('/', authorize(), getCategories);
router.patch('/:id', authorize(['Admin']), updateCategory);
router.delete('/:id', authorize(['Admin']), removeCategory);


export = router;