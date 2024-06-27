import type { RequestHandler } from 'express'
import type { ProductDocument, Image} from '../types/product'
import Product from '../models/productModel'
// import crypto from 'crypto'
import { appError, catchAsync } from './errorController'
import { apiFeatures, getDataUrlSize } from '../utils'
import { isValidObjectId } from 'mongoose'
import * as productDto from '../dtos/productDto'
import * as fileService from '../services/fileService'
import { promisify } from 'node:util'

// type ResponseType<T> = {
// 	status: 'success' | 'failed' | 'error'
// 	data: T 
// }


// => GET 	/api/products/get-random-products
export const gerRandomProducts:RequestHandler = catchAsync(async (_req, res, _next) => {
	const products = await Product.aggregate().sample(1)
	res.json({
		status: 'success',
		total: products.length,
		data: products,
	})
})

// => GET /api/products
export const getAllProducts:RequestHandler = catchAsync( async (req, res, _next) => {
	// const products = await Product.find<ProductDocument>()
	const filter = {}
	const products:ProductDocument[] = await apiFeatures(Product, req.query, filter)

	res.json({
		status: 'success',
		total: products.length,
		data: products,
	})
})

/* => POST /api/products
req.body = {
	"user": logedInUser.productId,
	"name": "it is my sample product (delete)",
	"price": 500,
	"quantity": 5,
	"summary": "summary description between 10-150",
	"description": "description between 10-1000",

	"category": "pant",
	"brand": "niki",
	"size": "xs",

	"coverPhoto": "data:jpg/images;alkjdfajd...=",
	"images": [
		"data:jpg/images;alkjdfajd...=",
		"data:jpg/images;rraksdjfasdkjf...=",
		"data:jpg/images;fflkjdfajd...=",
	]
}
*/
export const addProduct:RequestHandler = async (req, res, next) => {
	try {
		if(!req.body.coverPhoto) return next(appError('coverPhoto field required'))
		if(!req.body.images?.length) return next(appError('you must pass images of array'))
		if(req.body.images.length > 3 ) return next(appError('only allow upto 3 images'))

		const imageSize = getDataUrlSize(req.body.coverPhoto)
		const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
		if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))

		const { error: avatarError, image: coverPhoto } = await fileService.handleBase64File(req.body.coverPhoto, '/products')
		if(avatarError || !coverPhoto) return next(appError(avatarError))

		req.body.coverPhoto = coverPhoto

		const images = req.body.images.map( async (dataUrl: string) => {
			// Check image size
			const imageSize = getDataUrlSize(dataUrl)
			const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))

			// save image into disk
			const { error:imageError, image } = await fileService.handleBase64File(dataUrl, '/products')
			if(imageError || !image) throw new Error(imageError) 

			return image
		})

		req.body.images = await Promise.all( images )
		console.log(req.body)
		const product = await Product.create(req.body)
		if(!product) return next(appError('product not found'))

		
		res.json({
			status: 'success',
			data: product
		})

	} catch (err) {
		setTimeout(() => {
			promisify(fileService.removeFile)(req.body.coverPhoto.secure_url)
			req.body.images.forEach( (image: Image) => {
				promisify(fileService.removeFile)(image.secure_url)
			})
		}, 1000)

		if(err instanceof Error) next(appError(err.message))
		if(typeof err === 'string') next(appError(err))
	}
}

// => GET /api/products/:productId
export const getProductByIdOrSlug:RequestHandler = catchAsync(async (req, res, next) => {
	const productId = req.params.productId

	const filter = (isValidObjectId(productId)) ?  { _id: productId } : { slug: productId }
	const products = await apiFeatures(Product, req.query, filter).limit(1)
	if(!products.length) return next(appError('product not found'))
	
	res.status(200).json({
		status: 'success',
		data: products[0]
	})
})

/* => PATCH /api/products/:productId
const allowedFields = [
	'name',
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
req.body = {
	... addProduct
}
*/
export const updateProductByIdOrSlug:RequestHandler = async (req, res, next) => {
	const productId = req.params.productId

	try {
		if(req.body.coverPhoto) {
			// check file size
			const imageSize = getDataUrlSize(req.body.coverPhoto)
			const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))

			// upload file and return { error, image: { public_i, secure_url }}
			const { error: _avatarError, image: coverPhoto } = await fileService.handleBase64File(req.body.coverPhoto, '/products')
			// if(avatarError || !coverPhoto) return next(appError(avatarError))

			if(coverPhoto) req.body.coverPhoto = coverPhoto
		}

		if(req.body.images?.length) {
			const images = req.body.images.map( async (dataUrl: string) => {
				// Check image size
				const imageSize = getDataUrlSize(dataUrl)
				const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
				if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))

				// save image into disk
				const { error: _imageError, image } = await fileService.handleBase64File(dataUrl, '/products')
				// if(imageError || !image) throw new Error(imageError) 

				if(image) return image
			})
			req.body.images = await Promise.all( images )
		}

		const filteredBody = productDto.filterBodyForUpdateProduct(req.body)

		const filter = (isValidObjectId(productId)) ?  { _id: productId } : { slug: productId }

		const product = await Product.findOne(filter )
		if(!product) return next(appError('product not found'))
		
		const updatedProduct = await Product.findOne(filter, filteredBody, { new: true })
		if(!updatedProduct) return next(appError('product not found'))
		
		// delete old images
		setTimeout(() => {
			if(req.body.coverPhoto && product.coverPhoto?.secure_url) {
				promisify(fileService.removeFile)(product.coverPhoto.secure_url)
			}

			if(req.body.images && product.images?.length) {
				product.images.forEach( (image: Image) => {
					promisify(fileService.removeFile)(image.secure_url)
				})
			}
		}, 1000)


		res.status(201).json({
			status: 'success',
			data: updatedProduct
		})

	} catch (error) {
		setTimeout(() => {
			if(req.body.coverPhoto?.secure_url) {
				promisify(fileService.removeFile)(req.body.coverPhoto.secure_url)
			}

			if(req.body.images?.length) {
				req.body.images.forEach( (image: Image) => {
					promisify(fileService.removeFile)(image.secure_url)
				})
			}
		}, 1000);

		if(error instanceof Error) next(appError(error.message))
		if(typeof error === 'string') next(appError(error))
	}
}

// => DELETE /api/products/:productId
export const deleteProductByIdOrSlug:RequestHandler = catchAsync(async (req, res, next) => {
	const productId = req.params.productId

	const filter = (isValidObjectId(productId)) ?  { _id: productId } : { slug: productId }
	const product = await Product.findOneAndDelete(filter)
	if(!product) return next(appError('product not found'))
	

	if(product.coverPhoto) {
		promisify(fileService.removeFile)(product.coverPhoto.secure_url)
	}
	if(product.images.length) {
		product.images.forEach( image => {
			promisify(fileService.removeFile)(image.secure_url)
		})
	}
	// // delete old images
	// setTimeout(() => {
	// 	if(product.coverPhoto?.secure_url) {
	// 		promisify(fileService.removeFile)(product.coverPhoto.secure_url)
	// 	}

	// 	if(product.images?.length) {
	// 		product.images.forEach( (image: Image) => {
	// 			promisify(fileService.removeFile)(image.secure_url)
	// 		})
	// 	}
	// }, 1000)
	
	res.status(204).json({
		status: 'success',
		data: product
	})
})