import express from 'express'
import { createForm, showForm, showForms } from '../controllers/formController.js'
import verifyToken from '../middlewares/verifyToken.js'

const router = express.Router()

router.post('/', verifyToken, createForm) // create new form
router.get('/', verifyToken, showForms) // show all user forms
router.get('/:id', verifyToken, showForm) // show single user form

export default router