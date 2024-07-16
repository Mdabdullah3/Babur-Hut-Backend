import { filterObjectByArray } from '../utils'
import type { UpdateCagetory, UpdateSubCagetory } from '../types/category'


// => PATCH /api/categories/:id
export const filterBodyForUpdateCategory = (body: UpdateCagetory) => {
	const allowedFields = [
		'name',
		'shippingCharge',
		'vat',
		'status',
		'commission',
		'image',
	]

	return filterObjectByArray(body, allowedFields)
}



// => PATCH /api/sub-categories/:id
export const filterBodyForUpdateSubCategory = (body: UpdateSubCagetory) => {
	const allowedFields = [
		'name',
		'shippingCharge',
		'vat',
		'status',
		'commission',
	]

	return filterObjectByArray(body, allowedFields)
}


