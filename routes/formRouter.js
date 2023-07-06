import express from 'express';
import {
  createForm,
  showForm,
  showForms,
  deleteForm,
  updateForm,
  showToUser,
} from '../controllers/FormController.js';
import {
  addOption,
  deleteOption,
  updateOption,
} from '../controllers/OptionController.js';
import {
  addQuestion,
  deleteQuestion,
  showQuestions,
  updateQuestion,
} from '../controllers/QuestionController.js';
import verifyToken from '../middlewares/verifyToken.js';
import { addInvite, deleteInvite } from '../controllers/InviteController.js';

const router = express.Router();

router.post('/', verifyToken, createForm); // create new form
router.get('/', verifyToken, showForms); // show all user forms
router.get('/:formId', verifyToken, showForm); // show single user form
router.get('/:formId/users', verifyToken, showToUser); // show single user form
router.delete('/:formId', verifyToken, deleteForm); // delete single user form
router.put('/:formId', verifyToken, updateForm); // update single user form

// QUESTIONS
router.get('/:formId/questions', verifyToken, showQuestions);
router.post('/:formId/questions', verifyToken, addQuestion);
router.post('/:formId/questions/:questionId', verifyToken, updateQuestion);
router.delete('/:formId/questions/:questionId', verifyToken, deleteQuestion);

// OPTIONS
// router.get('/:formId/questions', verifyToken, showQuestions)
// router.post('/:formId/questions', verifyToken, addQuestion)
router.post('/:formId/questions/:questionId/options', verifyToken, addOption);
router.post(
  '/:formId/questions/:questionId/options/:optionId',
  verifyToken,
  updateOption
);
router.delete(
  '/:formId/questions/:questionId/options/:optionId',
  verifyToken,
  deleteOption
);
// router.delete('/:formId/questions/:questionId', verifyToken, deleteQuestion)

// INVITES
router.post('/:formId/invites', verifyToken, addInvite); // invite email
router.delete('/:formId/invites', verifyToken, deleteInvite); // invite email

export default router;
