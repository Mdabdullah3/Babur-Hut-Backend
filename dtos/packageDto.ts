/* DTO = Data Transfer Object */
import { filterObjectByArray } from '../utils'
import type { UpdatePackage } from '../types/package'


// => PATCH /api/reviews/:id
export const filterBodyForUpdatePackage = (body: UpdatePackage) => {
	const allowedFields = [
		'name',
		'status',
		'duration',
		'price',
		'maxProduct',
		'image',
		'description',
	]

	return filterObjectByArray(body, allowedFields)
}


