/* DTO = Data Transfer Object */
import { filterObjectByArray } from '../utils'
import type { UpdateVoucher } from '../types/voucher'


// => PATCH /api/reviews/:id
export const filterBodyForUpdateVoucher = (body: UpdateVoucher) => {
	const allowedFields = [
		'user',
		'voucherId',
		'redeemCode',
		'status',
		'discount',
		'startDate',
		'endDate',
 		'discountType',
 		'minimumPurchase',
	]

	return filterObjectByArray(body, allowedFields)
}


