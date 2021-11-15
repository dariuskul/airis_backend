import express from 'express';
import { authenticate, createUser, getUser, getUserProducts, getUsers, refreshToken, removeUser, updateUser } from '../controllers/user';
import { ERoles } from '../enums/roles';
import { authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', authorize([ERoles.Admin]), getUsers);
router.post('/authenticate', authenticate);
router.get('/:id', authorize(), getUser);
router.get('/:userId/reports/:reportId/expense', authorize(), getUserProducts);
router.post('/register', createUser);
router.patch('/:id', authorize(), updateUser);
router.delete('/:id', authorize(), removeUser);
router.post('/refresh-token', authorize(), refreshToken);

export = router;