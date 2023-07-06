import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { allResponses } from '../controllers/ResponseController.js';

const router = express.Router();

// RESPONSES 
router.get('/:formId', verifyToken, allResponses); // invite email

export default router;
