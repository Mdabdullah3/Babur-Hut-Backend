import { Router } from 'express'
import * as financeController from '../controllers/financeController'

// => /api/others/
export const router = Router({ mergeParams: true })

router.route('/')
	.get(financeController.getFinances)
	.post(financeController.addFinance)

router.route('/:financeId')
	.get(financeController.getFinanceById)
	.patch(financeController.updateFinance)
	.delete(financeController.deleteFinance)
