/* DTO = Data Transfer Object */
import type { PaymentUpdate } from '../types/_payment'
import { filterObjectByArray } from '../utils'


// => PATCH /api/reviews/:id
export const filterBodyForUpdatePayment = (body: PaymentUpdate) => {
	const allowedFields = [
		'status',
	]

	return filterObjectByArray(body, allowedFields)
}


