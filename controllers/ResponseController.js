import mongoose from 'mongoose';
import Form from '../models/Form.js';
import Answer from '../models/Answer.js';
import asyncHandler from 'express-async-handler';

export const listResponses = asyncHandler(async (req, res) => {
  try {
    if (!req.params.formId) {
      throw { code: 400, message: 'FORM_ID_REQUIRED' };
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.formId)) {
      throw { code: 400, message: 'INVALID_ID' };
    }

    // check is form exist
    const isFormExist = await Form.findOne({
      _id: req.params.formId,
      userId: req.jwt.id,
    }).populate('answers');

    if (!isFormExist) {
      throw { code: 400, message: 'FORM_NOT_FOUND' };
    }

    // get all form responses
    // const answers = await Answer.find({ formId: req.params.formId });
    // if (!answers) {
    //   throw { code: 400, message: 'ANSWER_NOT_FOUND' };
    // }

    return res.status(200).json({
      status: true,
      message: 'ANSWER_FOUND',
      form: isFormExist,
      total: isFormExist.answers.length,
      answers: isFormExist.answers,
    });
  } catch (error) {
    return res.status(error.code || 500).json({
      status: false,
      message: error.message,
    });
  }
});

export const summaryResponses = asyncHandler(async (req, res) => {
  try {
    if (!req.params.formId) {
      throw { code: 400, message: 'FORM_ID_REQUIRED' };
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.formId)) {
      throw { code: 400, message: 'INVALID_ID' };
    }

    // check is form exist
    const isFormExist = await Form.findOne({
      _id: req.params.formId,
      userId: req.jwt.id,
    }).populate('answers');

    if (!isFormExist) {
      throw { code: 400, message: 'FORM_NOT_FOUND' };
    }

    const summaries = isFormExist.questions.map((question) => {
      const summary = {
        type: question.type,
        questionId: question.id,
        question: question.question,
        answers: isFormExist.answers.map((answer) => answer[question.id]),
      };

      return summary;
    });

    return res.status(200).json({
      status: true,
      message: 'ANSWER_FOUND',
      summaries,
    });
  } catch (error) {
    return res.status(error.code || 500).json({
      status: false,
      message: error.message,
    });
  }
});
