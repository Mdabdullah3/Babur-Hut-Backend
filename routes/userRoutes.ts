import { Router } from 'express'
import * as userController from '../controllers/userController'
import * as authController from '../controllers/authController'

import { router as reviewRouter } from '../routes/reviewRoutes'
import { router as productRouter } from '../routes/productRoutes'
import { router as paymentRouter } from '../routes/paymentRoutes'

// => /api/users/
export const router = Router()

router.get('/me', authController.protect, userController.getMe)
router.patch('/me', authController.protect, userController.updateMe, userController.updateUserById)
router.delete('/me', authController.protect, userController.deleteMe, userController.deleteUserById)

router.use('/:userId/reviews', reviewRouter)
router.use('/:userId/products', productRouter)
router.use('/:userId/payments', paymentRouter)


router.route('/')
	.get(
		authController.protect,
		// authController.restrictTo('admin'), 
		userController.getAllUsers
	)

router.route('/:id')
	.get(userController.getUserById)
	.patch(
		authController.protect,
		userController.updateUserById
	)
	.delete(
		authController.protect,
		userController.deleteUserById
	)
