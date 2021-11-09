import express from 'express';
import { authenticate, createUser, getUser, getUserProducts, getUsers, refreshToken, removeUser, updateUser } from '../controllers/user';
import { ERoles } from '../enums/roles';
import { authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', authorize([ERoles.User]), getUsers);
router.post('/authenticate', authenticate);
router.get('/:id', authorize(), getUser);
router.get('/:userId/reports/:reportId/expense', getUserProducts);
router.post('/register', createUser);
router.patch('/', updateUser);
router.delete('/:id', removeUser);
router.post('/refresh-token', refreshToken);

export = router;