import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import {
  listResponses,
  summaryResponses,
} from '../controllers/ResponseController.js';

const router = express.Router();

// RESPONSES
router.get('/:formId/lists', verifyToken, listResponses); // invite email
router.get('/:formId/summaries', verifyToken, summaryResponses); // invite email

export default router;
