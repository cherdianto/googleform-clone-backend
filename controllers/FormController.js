import Form from '../models/Form.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import formAccess from '../libraries/formAccess.js';

// create new form with all default parameter
// why default? because it is autosave, so It has to be something from the very begining
export const createForm = asyncHandler(async (req, res) => {
  const form = await Form.create({
    userId: req.jwt.id,
    title: 'Untitled Form',
    description: null,
    options: [],
    public: true,
  });

  if (!form) {
    res.status(500);
    throw new Error('CREATE_FORM_FAILED');
  }

  res.status(200).json({
    status: true,
    message: 'CREATE_FORM_SUCCESS',
    form,
  });
});

// show single & specific form to user
export const showForm = asyncHandler(async (req, res) => {
  // url : domain/form/:formId

  const formId = req.params.formId;
  const userId = req.jwt.id;

  if (!formId) {
    res.status(400);
    throw new Error('ID_IS_REQUIRED');
  }

  if (!mongoose.Types.ObjectId.isValid(formId)) {
    res.status(400);
    throw new Error('INVALID_ID');
  }

  const form = await Form.findOne({ _id: formId, userId });

  if (!form) {
    res.status(404);
    throw new Error('FORM_NOT_FOUND');
  }

  res.status(200).json({
    status: true,
    message: 'FORM_FOUND',
    form,
  });
});

// show all forms owned by user
export const showForms = asyncHandler(async (req, res) => {
  const userId = req.jwt.id;
  const page = req.query.page ? req.query.page : 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;

  const forms = await Form.paginate(
    { userId },
    {
      page,
      limit,
    }
  );

  if (!forms) {
    res.status(404);
    throw new Error('FORMS_NOT_FOUND');
  }

  res.status(200).json({
    status: true,
    message: 'LIST_FORMS',
    forms,
  });
});

// delete specific form
export const deleteForm = asyncHandler(async (req, res) => {
  // url : domain/form/:formId

  const formId = req.params.formId;
  const userId = req.jwt.id;

  if (!formId) {
    res.status(400);
    throw new Error('ID_IS_REQUIRED');
  }

  if (!mongoose.Types.ObjectId.isValid(formId)) {
    res.status(400);
    throw new Error('INVALID_ID');
  }

  const form = await Form.findOneAndDelete({ _id: formId, userId });

  if (!form) {
    res.status(404);
    throw new Error('FORM_DELETE_FAILED');
  }

  res.status(200).json({
    status: true,
    message: 'FORM_DELETE_SUCCESS',
    form,
  });
});

// update specific form
export const updateForm = asyncHandler(async (req, res) => {
  // url : domain/form/:formId

  // get all the parameter
  const formId = req.params.formId;
  const userId = req.jwt.id;

  // check if formId exist
  if (!formId) {
    res.status(400);
    throw new Error('ID_IS_REQUIRED');
  }

  // check if formId valid
  if (!mongoose.Types.ObjectId.isValid(formId)) {
    res.status(400);
    throw new Error('INVALID_ID');
  }

  // check if formId exist and accessed by valid user, then perform update based on req body
  const form = await Form.findOneAndUpdate({ _id: formId, userId }, req.body, {
    new: true,
  });

  if (!form) {
    res.status(404);
    throw new Error('FORM_UPDATE_FAILED');
  }

  res.status(200).json({
    status: true,
    message: 'FORM_UPDATE_SUCCESS',
    form,
  });
});

export const showToUser = asyncHandler(async (req, res) => {
  // url : domain/form/:formId

  const formId = req.params.formId;
  const userId = req.jwt.id;

  if (!formId) {
    res.status(400);
    throw new Error('ID_IS_REQUIRED');
  }

  if (!mongoose.Types.ObjectId.isValid(formId)) {
    res.status(400);
    throw new Error('INVALID_ID');
  }

  const form = await Form.findOne({ _id: formId });

  if (!form) {
    res.status(404);
    throw new Error('FORM_NOT_FOUND');
  }
  // this will be skipped because any malformed ID will be catched by "invalid_id"

  const hasFormAccess = await formAccess(formId, userId);

  if (!hasFormAccess) {
    res.status(400);
    throw new Error('NO_ACCESS_TO_THE_FORM');
  }

  form.invites = []; // make sure to hide all invited user if the user is not the owner of the form

  res.status(200).json({
    status: true,
    message: 'FORM_FOUND',
    form,
  });
});
