import User from '../models/User.js';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const env = dotenv.config().parsed;

const accessSecretKey = env.ACCESS_SECRET_KEY;
const refreshSecretKey = env.REFRESH_SECRET_KEY;
const accessExpiry = env.ACCESS_EXPIRY;
const refreshExpiry = env.REFRESH_EXPIRY;

const generateAccessToken = (payload) => {
  return jwt.sign(payload, accessSecretKey, {
    expiresIn: accessExpiry,
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, refreshSecretKey, {
    expiresIn: refreshExpiry,
  });
};

export const register = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;

  // check the req.body
  if (!fullname) {
    res.status(400);
    throw new Error('FULLNAME_REQUIRED');
  }

  if (!email) {
    res.status(400);
    throw new Error('EMAIL_REQUIRED');
  }

  if (!password) {
    res.status(400);
    throw new Error('PASSWORD_REQUIRED');
  }

  const userExist = await User.findOne({
    email: email,
  });

  if (userExist) {
    res.status(400);
    throw new Error('DUPLICATE_EMAIL');
  }

  // make salt
  let salt = await bcrypt.genSalt(12);
  // hash the password
  let hashedPassword = await bcrypt.hash(password, salt);

  // store user info to DB
  try {
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    // next, generate tokens (access & refresh)
    const accessToken = generateAccessToken({ id: user._id });

    const refreshToken = generateRefreshToken({ id: user._id });

    res.status(200).json({
      status: true,
      message: 'USER_REGISTER_SUCCESS',
      fullname: user.fullname,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500);
    throw new Error('USER_REGISTER_FAILED');
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  // check the req.body
  if (!email) {
    res.status(400);
    throw new Error('EMAIL_REQUIRED');
  }

  if (!password) {
    res.status(400);
    throw new Error('PASSWORD_REQUIRED');
  }

  // user exist?
  const user = await User.findOne({
    email,
  });

  console.log(user);

  if (!user) {
    console.log('email not foud');
    res.status(400);
    throw new Error('EMAIL_NOT_FOUND');
  }

  // password match?
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error('WRONG_PASSWORD');
  }

  // next, generate tokens (access & refresh)
  const accessToken = generateAccessToken({ id: user._id });

  const refreshToken = generateRefreshToken({ id: user._id });

  // store refreshToken to database
  // const updateDb = await User.updateOne(
  //   {
  //     _id: user._id,
  //   },
  //   {
  //     $set: {
  //       refreshToken,
  //     },
  //   }
  // );

  // if (!updateDb) {
  //   console.log('error here');
  //   res.status(500);
  //   throw new Error('ERROR_UPDATE_DB');
  // }

  // // if updateDB success, thenset cookies
  // res.cookie('refreshToken', refreshToken, {
  //   maxAge: 24 * 60 * 60 * 1000,
  //   httpOnly: true,
  // });

  return res.status(200).json({
    status: true,
    message: 'LOGIN_SUCCESS',
    fullname: user.fullname,
    accessToken,
    refreshToken,
  });
});

export const logout = asyncHandler(async (req, res) => {
  const userRefreshToken = req.cookies.refreshToken;

  if (!userRefreshToken) {
    res.status(204);
    throw new Error('USER_NOT_LOGGED_IN');
  }

  const user = await User.findOne({
    refreshToken: userRefreshToken,
  });
  if (!user) {
    res.status(204);
    throw new Error('USER_NOT_LOGGED_IN');
  }

  // update database
  const updateDb = await User.updateOne(
    {
      _id: user._id,
    },
    {
      $set: {
        refreshToken: '',
      },
    }
  );

  if (!updateDb) {
    res.status(500);
    throw new Error('LOG_OUT_FAILED');
  }

  res.clearCookie('refreshToken');

  return res.status(200).json({
    status: true,
    message: 'LOGGED_OUT_SUCCESS',
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  // form : email, oldpassword, newpassword

  const { email, oldPassword, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error('USER_NOT_FOUND');
  }

  const isMatch = bcrypt.compareSync(oldPassword, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error('WRONG_PASSWORD');
  }

  // make salt
  let salt = await bcrypt.genSalt(12);
  // hash the password
  let hashedPassword = await bcrypt.hash(newPassword, salt);

  // update db
  const updateDb = await User.updateOne(
    { _id: user._id },
    {
      $set: {
        password: hashedPassword,
      },
    }
  );

  if (!updateDb) {
    res.status(500);
    throw new Error('PASSWORD_CHANGE_FAILED');
  }

  res.status(200).json({
    status: true,
    message: 'PASSWORD_CHANGE_SUCCESS',
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const userRefreshToken = req.body.refreshToken;

  try {
    if (!userRefreshToken) {
      throw { code: 400, message: 'REFRESH_TOKEN_REQUIRED' };
    }

    const decoded = jwt.verify(userRefreshToken, refreshSecretKey);

    const accessToken = generateAccessToken({ id: decoded.id });
    const refreshToken = generateRefreshToken({ id: decoded.id });

    res.status(200).json({
      status: true,
      message: 'REFRESH_TOKEN_SUCCESS',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    const errorJwt = [
      'invalid signature',
      'jwt malformed',
      'jwt must be provided',
      'invalid token',
    ];
    if (error.message == 'jwt expired') {
      error.code = 401;
      error.message = 'REFRESH_TOKEN_EXPIRED';
    } else if (errorJwt.includes(error.message)) {
      error.message = 'REFRESH_TOKEN_INVALID';
    }

    return res.status(error.code || 500).json({
      status: false,
      message: error.message,
    });
  }
});
