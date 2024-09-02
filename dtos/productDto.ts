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
		'customId', 				// user._id
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

		'discount',
		'subCategory',
		'warranty',
		'packaging',
		'discountPrice',
  	'status',

		'productVariants',
	]

	return filterObjectByArray(body, allowedFields)
}

// => PATCH /api/products/:id
export const filterBodyForUpdateProduct = (body: UpdateProduct) => {
	const allowedFields = [
		'customId',
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
		'video',
		'specifications',

		'discount',
		'subCategory',
		'warranty',
		'packaging',
		'discountPrice',
  	'status',

		'productVariants',
	]

	return filterObjectByArray(body, allowedFields)
}


