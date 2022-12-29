import express from 'express'
import { createForm, showForm } from '../controllers/formController.js'
import verifyToken from '../middlewares/verifyToken.js'

const router = express.Router()

router.post('/', verifyToken, createForm)
router.get('/:id', verifyToken, showForm)

export default router