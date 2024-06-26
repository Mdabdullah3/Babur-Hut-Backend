/* DTO = Data Transfer Object */
import type { CreateProduct, ProductDocument, UpdateProduct } from '../types/product'
import { filterObjectByArray } from '../utils'


export const filterProductDocument = (product: ProductDocument) => {
	const allowedFields = [
		'user', 				// user._id
		'product', 			// product._id
		'review',
		
		'_id',
		'id',
		'createdAt',
	]
	return filterObjectByArray(product, allowedFields)
}

// => POST /api/products
export const filterBodyForCreateProduct = (body: CreateProduct) => {
	const allowedFields = [
		'user', 				// user._id
		'name',
		'slug',
		'price',
		'summary',
		'description',
		'category',
		'brand',
		'size',
		'quantity',
		'coverPhoto',
		'images',
	]

	return filterObjectByArray(body, allowedFields)
}

// => PATCH /api/products/:id
export const filterBodyForUpdateProduct = (body: UpdateProduct) => {
	const allowedFields = [
		'name',
		'slug',
		'price',
		'summary',
		'description',
		'category',
		'brand',
		'size',
		'quantity',
		'coverPhoto',
		'images',
	]

	return filterObjectByArray(body, allowedFields)
}


