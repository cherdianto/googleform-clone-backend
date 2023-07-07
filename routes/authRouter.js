import express from 'express'
import { register, login, logout, refreshToken, changePassword } from '../controllers/AuthController.js'
import verifyToken from '../middlewares/verifyToken.js'
const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.post('/change-password', changePassword)
router.get('/refreshToken', refreshToken)

export default router