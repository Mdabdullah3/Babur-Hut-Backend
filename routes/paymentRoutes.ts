import { Router } from 'express'
import * as authController from '../controllers/authController'
import * as paymentController from '../controllers/paymentController'


// => /api/payments/
export const router = Router({ mergeParams: true })

router.use(authController.protect)

router.route('/')
	.get(paymentController.getAllPayments)
	.post(paymentController.createCashOnPayment)

router
	.get('/request', paymentController.createPaymentRequest)
	.post('/success/:transactionId', paymentController.paymentSuccessHandler)
	.post('/cancel/:transactionId', paymentController.paymentCancelHandler)

router.route('/:paymentId')
	.get(paymentController.getPaymentById)
	.patch(
		// authController.restrictTo('admin'),
		paymentController.updatePaymentById
	)
	.delete(
		// authController.restrictTo('admin'),
		paymentController.deletePaymentById
	)


