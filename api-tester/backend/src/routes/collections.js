import express from 'express';
import {
  getCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
  addRequest,
  removeRequest
} from '../controllers/collectionController.js';

const router = express.Router();

router.get('/', getCollections);
router.get('/:id', getCollection);
router.post('/', createCollection);
router.put('/:id', updateCollection);
router.delete('/:id', deleteCollection);
router.post('/:id/requests', addRequest);
router.delete('/:id/requests/:requestId', removeRequest);

export default router;