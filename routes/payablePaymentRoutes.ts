import { Router } from 'express'
import * as payablePaymentController from '../controllers/payablePaymentController'

// => /api/payablePayments/
export const router = Router({ mergeParams: true })

router.route('/')
	.get(payablePaymentController.getFinances)
	.post(payablePaymentController.addFinance)

router.route('/:payablePaymentId')
	.get(payablePaymentController.getFinanceById)
	.patch(payablePaymentController.updateFinance)
	.delete(payablePaymentController.deleteFinance)
