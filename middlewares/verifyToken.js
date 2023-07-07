import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

const env = dotenv.config().parsed

const verifyToken = (req, res, next) => {
    // console.log(req.headers)
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token) {
        res.status(401)
        throw new Error('UNAUTHORIZED')
    }

    jwt.verify(token, env.ACCESS_SECRET_KEY, (error, decoded) => {
        if(error){

            const errorJwt = ['invalid signature', 'jwt malformed', 'jwt must be provided', 'invalid token']

            if(error.message == 'jwt expired'){
                res.status(401)
                throw new Error("TOKEN_EXPIRED")
            } else if(errorJwt.includes(error.message)){
                res.status(402)
                throw new Error("INVALID_TOKEN")
            }
        }

        // decoded = { id: '63acbc2a1979ffaa12742a62', iat: 1672336638, exp: 1672337538 }
        req.jwt = decoded
        next()
    })
}

export default verifyToken