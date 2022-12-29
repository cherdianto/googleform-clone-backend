import express from 'express'
import { createForm } from '../controllers/formController.js'
import verifyToken from '../middlewares/verifyToken.js'

const router = express.Router()

router.post('/create', verifyToken, createForm)

export default router