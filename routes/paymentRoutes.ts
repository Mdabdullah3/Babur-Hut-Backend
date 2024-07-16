import { Router } from 'express'
import * as authController from '../controllers/authController'
import * as paymentController from '../controllers/paymentController'


// => /api/payments/
export const router = Router()


router
	.post('/request', 
		authController.protect,
		paymentController.createPaymentRequest
	)
	.post('/success/:transactionId', 
		paymentController.paymentSuccessHandler
	)
	.post('/cancel/:transactionId', 
		paymentController.paymentCancelHandler
	)


