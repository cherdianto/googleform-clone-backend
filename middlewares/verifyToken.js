import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const env = dotenv.config().parsed;

// const verifyToken = (req, res, next) => {
//   // console.log(req.headers)
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     console.log('token null');
//     res.status(401);
//     throw new Error('UNAUTHORIZED');
//   }

//   jwt.verify(token, env.ACCESS_SECRET_KEY, (error, decoded) => {
//     if (error) {
//       console.log(error.message);
//       const errorJwt = [
//         'invalid signature',
//         'jwt malformed',
//         'jwt must be provided',
//         'invalid token',
//       ];

//       if (error.message == 'jwt expired') {
//         res.status(401);
//         throw new Error('TOKEN_EXPIRED');
//       } else if (errorJwt.includes(error.message)) {
//         res.status(402);
//         throw new Error('INVALID_TOKEN');
//       }
//     }

//     // decoded = { id: '63acbc2a1979ffaa12742a62', iat: 1672336638, exp: 1672337538 }
//     req.jwt = decoded;
//     next();
//   });
// };

// export default verifyToken;

const verifyToken = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw { code: 401, message: 'UNAUTHORIZED' };
    }

    const token = req.headers.authorization.split(' ')[1];
    console.log(token);

    const verify = jwt.verify(token, env.ACCESS_SECRET_KEY);
    req.jwt = verify;
    next();
  } catch (error) {
    console.log(error.message);
    const errorJwt = [
      'invalid signature',
      'jwt malformed',
      'jwt must be provided',
      'invalid token',
    ];

    if (error.message == 'jwt expired') {
      error.code = 401;
      error.message = 'ACCESS_TOKEN_EXPIRED';
    } else if (errorJwt.includes(error.message)) {
      error.code = 401;
      error.message = 'INVALID_ACCESS_TOKEN';
    }

    console.log(error.message)
    return res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export default verifyToken;
