import express from 'express';
import { createReport, getReports, removeReport, updateReport } from '../controllers/report';

const router = express.Router();

router.get('/', getReports);
router.post('/', createReport);
router.patch('/', updateReport);
router.delete('/:id', removeReport);

export = router;