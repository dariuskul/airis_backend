import express from 'express';
import { createProduct, getProduct, getProducts, removeProduct, updateProduct } from '../controllers/product';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.patch('/:id', updateProduct);
router.delete('/:id', removeProduct);

export = router;