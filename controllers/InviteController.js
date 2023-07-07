import mongoose from 'mongoose';
import Form from '../models/Form.js';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import isEmailValid from '../libraries/isEmailValid.js';

export const addInvite = asyncHandler(async (req, res) => {
  if (!req.params.formId) {
    res.status(400);
    throw new Error('ID_IS_REQUIRED');
  }

  if (!req.body.email) {
    res.status(400);
    throw new Error('EMAIL_IS_REQUIRED');
  }

  if (!isEmailValid(req.body.email)) {
    res.status(400);
    throw new Error('INVALID_EMAIL');
  }

  //   check if the email already exist on the database
  const isEmailInvited = await Form.findOne({
    _id: req.params.formId,
    userId: req.jwt.id,
    invites: { $in: req.body.email },
  });

  if (isEmailInvited) {
    res.status(400);
    throw new Error('EMAIL_ALREADY_INVITED');
  }

  //   check if user invite the owner of the form
  const isSelfInvite = await User.findOne({
    _id: req.jwt.id,
    email: req.body.email,
  });

  if (isSelfInvite) {
    res.status(400);
    throw new Error('CANNOT_INVITE_OWNER');
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.formId)) {
    res.status(400);
    throw new Error('INVALID_ID');
  }

  const form = await Form.findOneAndUpdate(
    {
      _id: req.params.formId,
      userId: req.jwt.id,
    },
    {
      $push: { invites: req.body.email },
    },
    { new: true }
  );

  if (!form) {
    res.status(400);
    throw new Error('INVITE_FAILED');
  }

  return res.status(200).json({
    status: true,
    message: 'INVITE_SUCCESS',
    email: req.body.email,
  });
});

export const deleteInvite = asyncHandler(async (req, res) => {
  if (!req.params.formId) {
    res.status(400);
    throw new Error('ID_IS_REQUIRED');
  }

  if (!req.body.email) {
    res.status(400);
    throw new Error('EMAIL_IS_REQUIRED');
  }

  const regex = /[a-z0-9]+@[a-z]{2,3}/;
  if (regex.test(req.body.email) === false) {
    res.status(400);
    throw new Error('INVALID_EMAIL');
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.formId)) {
    res.status(400);
    throw new Error('INVALID_ID');
  }

  //   check if the email exist on the database
  const isEmailExist = await Form.findOne({
    _id: req.params.formId,
    userId: req.jwt.id,
    invites: { $in: req.body.email },
  });

  if (!isEmailExist) {
    res.status(400);
    throw new Error('EMAIL_NOT_EXIST');
  }

  const form = await Form.findOneAndUpdate(
    {
      _id: req.params.formId,
      userId: req.jwt.id,
    },
    {
      $pull: { invites: req.body.email },
    },
    { new: true }
  );

  if (!form) {
    res.status(400);
    throw new Error('DELETE_INVITE_FAILED');
  }

  return res.status(200).json({
    status: true,
    message: 'DELETE_INVITE_SUCCESS',
    email: req.body.email,
  });
});

export const indexInvite = asyncHandler(async (req, res) => {
  if (!req.params.formId) {
    res.status(400);
    throw new Error('ID_IS_REQUIRED');
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.formId)) {
    res.status(400);
    throw new Error('INVALID_ID');
  }

  //   check if the email exist on the database
  const form = await Form.findOne({
    _id: req.params.formId,
    userId: req.jwt.id,
  }).select('invites');

  if (!form) {
    res.status(400);
    throw new Error('INVITES_NOT_FOUND');
  }

  return res.status(200).json({
    status: true,
    message: 'INVITES_FOUND',
    invites: form.invites,
  });
});
