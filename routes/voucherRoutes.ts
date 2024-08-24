import { Router } from 'express'
import * as voucherController from '../controllers/voucherController'

// => /api/vouchers/
// => /api/users/:userId/vouchers/
export const router = Router({ mergeParams: true })

router.route('/')
	.get(voucherController.getAllVouchers)
	.post(voucherController.addVoucher)

router.route('/:voucherId')
	.get(voucherController.getVoucherById)
	.patch(voucherController.updateVoucher)
	.delete(voucherController.deleteVoucher)
