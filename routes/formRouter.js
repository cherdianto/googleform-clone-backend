import express from 'express'
import { createForm, showForm, showForms, deleteForm, updateForm } from '../controllers/formController.js'
import verifyToken from '../middlewares/verifyToken.js'

const router = express.Router()

router.post('/', verifyToken, createForm) // create new form
router.get('/', verifyToken, showForms) // show all user forms
router.get('/:formId', verifyToken, showForm) // show single user form
router.delete('/:formId', verifyToken, deleteForm) // delete single user form
router.put('/:formId', verifyToken, updateForm) // update single user form

export default router