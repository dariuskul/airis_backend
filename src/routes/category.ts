import express from 'express';
import { createCategory, getCategories } from '../controllers/category';

const router = express.Router();

router.post('/', createCategory);
router.get('/', getCategories);
router.patch('/:id', getCategories);
router.delete('/', getCategories);


export = router;