import express from 'express';
import { createReport, generatePdf, getReport, getReports, getUserExpenes, removeReport, updateReport } from '../controllers/report';

const router = express.Router();

router.get('/', getReports);
router.get('/:id', getReport);
router.post('/', createReport);
router.get('/pdf', generatePdf);
router.patch('/:id', updateReport);
router.delete('/:id', removeReport);

export = router;