import express from 'express';
import { createUser, getUser, getUserProducts, getUsers, removeUser, updateUser } from '../controllers/user';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.get('/:userId/reports/:reportId/expense', getUserProducts);
router.post('/', createUser);
router.patch('/', updateUser);
router.delete('/:id', removeUser);

export = router;