import express from "express";
const router = express.Router()
import {
  registerUser,
  loginUser,
} from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'

router.post('/', registerUser)
router.post('/login', loginUser)

export default router