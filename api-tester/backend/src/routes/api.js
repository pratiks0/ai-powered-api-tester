import express from 'express';
import { sendRequest, getHistory } from '../controllers/apiController.js';

const router = express.Router();

router.post('/request', sendRequest);
router.get('/history', getHistory);

export default router;