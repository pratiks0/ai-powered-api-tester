import express from 'express';
import { sendRequest, getHistory, deleteHistoryItem, clearHistory } from '../controllers/apiController.js';

const router = express.Router();

router.post('/request', sendRequest);
router.get('/history', getHistory);
router.delete('/history/:id', deleteHistoryItem);
router.delete('/history', clearHistory);

export default router;