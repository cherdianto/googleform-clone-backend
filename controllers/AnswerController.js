import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Answer from '../models/Answer.js';
import User from '../models/User.js';
import Form from '../models/Form.js';
import formAccess from '../libraries/formAccess.js';
import duplicateAnswer from '../libraries/duplicateAnswer.js';
import requiredAnswer from '../libraries/requiredAnswer.js';
import optionAnswer from '../libraries/optionAnswer.js';
import invalidQuestionId from '../libraries/invalidQuestionId.js';
import emailAnswerInvalid from '../libraries/emailAnswerInvalid.js';

function ErrorDetail(message, question, Error) {
  this.status = false;
  this.message = message;
  this.question = question;
  this.stack = Error.stack;
}

export const addAnswer = asyncHandler(async (req, res) => {
  const formId = req.params.formId;
  const userId = req.jwt.id;
  const answers = req.body.answers;

  if (!formId) {
    res.status(400);

    throw new Error('FORM_ID_REQUIRED');
  }

  if (!mongoose.Types.ObjectId.isValid(formId)) {
    res.status(400);
    throw new Error('INVALID_ID');
  }

  const form = await Form.findById(formId);
  if (!form) {
    res.status(400);
    throw new Error('FORM_NOT_FOUND');
  }

  // is the user have the access to the form?
  const hasFormAccess = await formAccess(form, userId);
  if (!hasFormAccess) {
    res.status(400);
    throw new Error('NO_ACCESS_TO_THE_FORM');
  }

  // has duplicate answer?
  const hasDuplicateAnswer = await duplicateAnswer(answers);
  if (hasDuplicateAnswer) {
    res.status(400);
    throw new Error('DUPLICATE_ANSWER');
  }

  // is there any empty required answer
  const hasEmptyRequiredAnswer = await requiredAnswer(form, answers);
  if (hasEmptyRequiredAnswer) {
    res.status(400);
    throw new ErrorDetail('ANSWER_REQUIRED', hasEmptyRequiredAnswer, Error());
  }

  // is there any wrong option answer?
  const hasWrongOptionAnswer = await optionAnswer(form, answers);
  if (hasWrongOptionAnswer) {
    res.status(400);
    throw new ErrorDetail('WRONG_OPTION_ANSWER', hasWrongOptionAnswer, Error());
  }

  // is there any invalid question ID on the answers?
  const hasInvalidQuestionId = await invalidQuestionId(form, answers);
  if (hasInvalidQuestionId) {
    res.status(400);
    throw new ErrorDetail('INVALID_QUESTION_ID', hasInvalidQuestionId, Error());
  }

  // is the answer for the email type correct?
  const hasInvalidEmailAnswer = await emailAnswerInvalid(form, answers);
  if (hasInvalidEmailAnswer.length > 0) {
    console.log(hasInvalidEmailAnswer);
    res.status(400);
    throw new ErrorDetail(
      'EMAIL_IS_NOT_VALID',
      hasInvalidEmailAnswer[0].question,
      Error()
    );
  }

  let fields = {};
  answers.forEach((answer) => {
    fields[answer.questionId] = answer.value;
  });

  const answer = await Answer.create({
    userId,
    formId,
    ...fields,
  });

  if (!answer) {
    res.status(500);
    throw new Error('ANSWER_FAILED');
  }

  res.status(200).json({
    status: true,
    message: 'ANSWER_SUCCESS',
    answer,
  });
});
