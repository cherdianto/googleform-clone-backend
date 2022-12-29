import express from 'express'
import { createForm, showForm, showForms, deleteForm, updateForm } from '../controllers/formController.js'
import { addQuestion, deleteQuestion, showQuestions, updateQuestion } from '../controllers/QuestionController.js'
import verifyToken from '../middlewares/verifyToken.js'

const router = express.Router()

router.post('/', verifyToken, createForm) // create new form
router.get('/', verifyToken, showForms) // show all user forms
router.get('/:formId', verifyToken, showForm) // show single user form
router.delete('/:formId', verifyToken, deleteForm) // delete single user form
router.put('/:formId', verifyToken, updateForm) // update single user form

// QUESTIONS
router.get('/:formId/questions', verifyToken, showQuestions)
router.post('/:formId/questions', verifyToken, addQuestion)
router.post('/:formId/questions/:questionId', verifyToken, updateQuestion)
router.delete('/:formId/questions/:questionId', verifyToken, deleteQuestion)

export default router