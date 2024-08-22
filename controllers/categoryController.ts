import type { RequestHandler } from 'express'
import { promisify } from 'util'
import { appError, catchAsync } from './errorController'
import { getDataUrlSize } from '../utils'
import Category from '../models/categoryModel'
import * as fileService from '../services/fileService'
import * as categoryDto from '../dtos/categoryDto'



// GET 	/api/categories
export const getAllCagegories:RequestHandler = catchAsync(async (_req, res, _next) => {
	// const categories = await apiFeatures(Category, req.query, {}) 	not populated virtual property, why ?
	const categories = await Category.find()
	const total = await Category.countDocuments()

	res.status(200).json({
		status: 'success',
		total,
		data: categories,
	})
})

// POST 	/api/categories
export const addCategory:RequestHandler = catchAsync(async (req, res, next) => {
	try {
		if(req.body.image) {
			const imageSize = getDataUrlSize(req.body.image)
			const maxImageSize = 1024 * 1024 * 2 			// => 2 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max image size: 2MB(max)'))

			const { error: _errorImage, image } = await fileService.handleBase64File(req.body.image, '/categories')
			if(image) req.body.image = image
		}

		const filteredBody = categoryDto.filterBodyForAddCategory(req.body)
		const category = await Category.create(filteredBody)
		if(!category) return next(appError('category create failed'))

		res.status(201).json({
			status: 'success',
			data: category,
		})

	} catch (error) {
		setTimeout(() => {
			promisify(fileService.removeFile)(req.body.image.secure_url)
		}, 1000);

		if(error instanceof Error) next(appError(error.message))
		if(typeof error === 'string') next(appError(error))
	}
})


// GET 	/api/categories/:categoryId
export const getCategoryById:RequestHandler = catchAsync(async (req, res, next) => {
	const categoryId = req.params.categoryId

	const category = await Category.findById(categoryId)
	if(!category) return next(appError(`category not found by id: ${categoryId}`))

	res.status(200).json({
		status: 'success',
		data: category,
	})
})


// PATCH 	/api/categories/:categoryId
export const updateCategoryById:RequestHandler = catchAsync(async (req, res, next) => {
	try {
		
		const categoryId = req.params.categoryId

		if(req.body.image) {
			const imageSize = getDataUrlSize(req.body.image)
			const maxImageSize = 1024 * 1024 * 2 			// => 2 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max image size: 2MB(max)'))

			const { error: _errorImage, image } = await fileService.handleBase64File(req.body.image, '/categories')
			if(image) req.body.image = image
		}

		const filteredBody = categoryDto.filterBodyForUpdateCategory(req.body) 

		const allowedFields = [
			'name',
			'shippingCharge',
			'vat',
			'status',
			'commission',
			'image'
		]

		const category = await Category.findById(categoryId )
		if(!category) return next(appError('product not found'))

		const updatedCategory = await Category.findByIdAndUpdate(categoryId, filteredBody, { new: true })
		if(!updatedCategory) return next(appError(`cagegory update failed, allowedFields:${allowedFields.join(',')} `))

		// delete old image
		if(req.body.image && category.image?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(category.image.secure_url)
			}, 1000);
		}

		res.status(201).json({
			status: 'success',
			data: updatedCategory,
		})


	} catch (error: unknown) {

		if(req.body.image?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(req.body.image.secure_url)
			}, 1000);
		}

		if(error instanceof Error) next(appError(error.message))
		if(typeof error === 'string') next(appError(error))
	}
})

// DELETE 	/api/categories/:categoryId
export const deleteCategoryById:RequestHandler = catchAsync(async (req, res, next) => {
	try {
		const categoryId = req.params.categoryId

		const category = await Category.findByIdAndDelete(categoryId)
		if(!category) return next(appError('category deletation failed'))

		if(category.image) {
			setTimeout(() => {
				promisify(fileService.removeFile)(category.image.secure_url)
			}, 1000);
		}

		res.status(204).json({
			status: 'success',
			data: category,
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