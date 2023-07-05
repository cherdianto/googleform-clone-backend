import express from 'express'
import { addAnswer } from '../controllers/AnswerController.js'
import verifyToken from '../middlewares/verifyToken.js'
const router = express.Router()

router.post('/:formId', verifyToken, addAnswer )

export default router