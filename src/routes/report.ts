import express from 'express';
import { createReport, generatePdf, getReport, getReports, removeReport, updateReport } from '../controllers/report';
import { authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', authorize(['ADMIN']), getReports);
router.get('/:id', authorize(), getReport);
router.post('/', authorize(), createReport);
router.post('/pdf/user/:id/:send?', authorize(), generatePdf);
router.patch('/:id', authorize(), updateReport);
router.delete('/:id', authorize(), removeReport);

export = router;