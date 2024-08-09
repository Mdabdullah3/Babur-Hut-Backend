import { filterObjectByArray } from '../utils'
import type { CreateCagetory, UpdateCagetory, UpdateSubCagetory } from '../types/category'


// => POST /api/categories/
export const filterBodyForAddCategory = (body: CreateCagetory) => {
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
		'image',
	]

	return filterObjectByArray(body, allowedFields)
}


