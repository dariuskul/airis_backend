import express from 'express';
import { createReport, generatePdf, getReports, removeReport, updateReport } from '../controllers/report';

const router = express.Router();

router.get('/', getReports);
router.post('/', createReport);
router.get('/pdf', generatePdf);
router.patch('/', updateReport);
router.delete('/:id', removeReport);

export = router;