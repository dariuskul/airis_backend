import express from 'express';
import { createProduct, getProduct, getProducts, removeProduct, updateProduct } from '../controllers/product';
import { authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', authorize(), getProducts);
router.get('/:id', authorize(), getProduct);
router.post('/', authorize(), createProduct);
router.patch('/:id', authorize(), updateProduct);
router.delete('/:id', authorize(), removeProduct);

export = router;