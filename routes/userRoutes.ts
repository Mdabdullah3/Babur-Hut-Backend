import { Router } from 'express'
import * as userController from '../controllers/userController'
import * as authController from '../controllers/authController'

// => /api/users/
export const router = Router()

router.get('/me', authController.protect, userController.getMe)

router.route('/')
	.get(
		authController.protect,
		// authController.restrictTo('admin'), 
		userController.getAllUsers
	)

router.route('/:id')
	.get(userController.getUserById)
	.patch(userController.updateUserById)
	.delete(userController.deleteUserById)
