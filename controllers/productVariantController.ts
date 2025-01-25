import type { RequestHandler } from 'express';
import { appError, catchAsync } from './errorController';
import { apiFeatures, getDataUrlSize } from '../utils';
import * as fileService from '../services/fileService'
import ProductVariant from '../models/productVariantModel';
import { promisify } from 'util';


// GET 	/api/product-variants
export const getProductVariants: RequestHandler = catchAsync( async (req, res, _next) => {
	// const productVariants = await ProductVariant.find()
	const productVariants = await apiFeatures(ProductVariant, req.query, {})
	const total = await ProductVariant.countDocuments()

	res.status(200).json({
		status: 'success',
		total,
    count: productVariants.length,
		data: productVariants
	})
})

// GET 	/api/product-variants/:productVariantId
export const getProductVariantById: RequestHandler = catchAsync( async (req, res, next) => {
	const { productVariantId = ''} = req.params

	const productVariant = await ProductVariant.findById(productVariantId)
	if(!productVariant) return next(appError('no productVariant document found'))

	res.status(200).json({
		status: 'success',
		data: productVariant
	})
})

// POST 	/api/product-variants
export const addProductVariant: RequestHandler = catchAsync( async (req, res, next) => {
	try {
		
		if(req.body.image) {
			// check file size
			const imageSize = getDataUrlSize(req.body.image)
			const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))

			// upload file and return { error, image: { public_i, secure_url }}
			const { error: _avatarError, image: image } = await fileService.handleBase64File(req.body.image, '/product-variant')
			// if(avatarError || !image) return next(appError(avatarError))

			if(image) req.body.image = image
		}

		const productVariant = await ProductVariant.create(req.body)
		if(!productVariant) return next(appError('no productVariant document found'))

		res.status(201).json({
			status: 'success',
			data: productVariant
		})

	} catch (err: unknown) {
		
		setTimeout(() => {
			if( !req.body.image?.secure_url.startsWith('http') ) {
				promisify(fileService.removeFile)(req.body.image.secure_url)
			}
		}, 1000)

		if(err instanceof Error) next(appError(err.message))
		if(typeof err === 'string') next(appError(err))

	}
})

// PATCH 	/api/product-variants/:productVariantId
export const updateProductVariant: RequestHandler = catchAsync( async (req, res, next) => {
	try {
		const { productVariantId = ''} = req.params

		if(req.body.image) {
			// check file size
			const imageSize = getDataUrlSize(req.body.image)
			const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))

			// upload file and return { error, image: { public_i, secure_url }}
			const { error: _avatarError, image: image } = await fileService.handleBase64File(req.body.image, '/product-variant')
			// if(avatarError || !image) return next(appError(avatarError))

			if(image) req.body.image = image
		}

		const productVariant = await ProductVariant.findById(productVariantId )
		if(!productVariant) return next(appError('product not found'))

		const updatedProductVariant = await ProductVariant.findByIdAndUpdate(productVariantId, req.body, { new: true })
		if(!updatedProductVariant) return next(appError('no productVariant document update failed'))

		// delete old image
		if(updatedProductVariant.image && productVariant.image?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(productVariant.image.secure_url)
			}, 1000);
		}


		res.status(201).json({
			status: 'success',
			data: updatedProductVariant
		})

	} catch (err: unknown) {
		
		setTimeout(() => {
			if( req.body.image ) {
				promisify(fileService.removeFile)(req.body.image.secure_url)
			}
		}, 1000)

		if(err instanceof Error) next(appError(err.message))
		if(typeof err === 'string') next(appError(err))
	}
})

// DELETE 	/api/product-variants/:productVariantId
export const deleteProductVariant: RequestHandler = catchAsync( async (req, res, next) => {
	try {
		const { productVariantId = ''} = req.params

		const productVariant = await ProductVariant.findByIdAndDelete(productVariantId)
		if(!productVariant) return next(appError('no productVariant document deletation failed'))

		// delete old image
		if(productVariant.image?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(productVariant.image.secure_url)
			}, 1000);
		}

		res.status(204).json({
			status: 'success',
			data: productVariant
		})

	} catch (err: unknown) {
		
		setTimeout(() => {
			if( req.body.image ) {
				promisify(fileService.removeFile)(req.body.image.secure_url)
			}
		}, 1000)

		if(err instanceof Error) next(appError(err.message))
		if(typeof err === 'string') next(appError(err))
	}
})



