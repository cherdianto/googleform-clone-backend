import mongoose from 'mongoose';
import Form from '../models/Form.js';
import Answer from '../models/Answer.js';
import asyncHandler from 'express-async-handler';

export const allResponses = asyncHandler(async (req, res) => {
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
    });

    if (!isFormExist) {
      throw { code: 400, message: 'FORM_NOT_FOUND' };
    }

    // get all form responses
    const answers = await Answer.find({ formId: req.params.formId });
    if (!answers) {
      throw { code: 400, message: 'ANSWER_NOT_FOUND' };
    }

    return res.status(200).json({
      status: true,
      message: 'ANSWER_FOUND',
      form: isFormExist,
      total: answers.length,
      answers,
    });
  } catch (error) {
    return res.status(error.code || 500).json({
      status: false,
      message: error.message,
    });
  }
});
