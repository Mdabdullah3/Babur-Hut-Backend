import { Router } from 'express'
import * as authController from '../controllers/authController'
import * as paymentController from '../controllers/paymentController'


// => /api/payments/
export const router = Router({ mergeParams: true })

router.use(authController.protect)

router.route('/')
	.get(paymentController.getAllPayments)

router.route('/:paymentId')
	.get(paymentController.getPaymentById)
	.delete(
		authController.restrictTo('admin'),
		paymentController.deletePaymentById
	)

router
	.post('/request', paymentController.createPaymentRequest)
	.post('/success/:transactionId', paymentController.paymentSuccessHandler)
	.post('/cancel/:transactionId', paymentController.paymentCancelHandler)


