import type { RequestHandler } from 'express'
import { appError, catchAsync } from './errorController'
import { filterBodyForUpdateCategory } from '../dtos/categoryDto'
import { getDataUrlSize } from '../utils'
import * as fileService from '../services/fileService'
import Category from '../models/categoryModel'
import { promisify } from 'util'

// GET 	/api/categories
export const getAllCagegories:RequestHandler = catchAsync(async (_req, res, _next) => {
	const categories = await Category.find().populate('subCategories')

	res.status(200).json({
		status: 'success',
		total: categories.length,
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

			const { error: _message, image } = await fileService.handleBase64File(req.body.image)
			if(image) req.body.image = image
		}
		const category = await Category.create(req.body)
		if(!category) return next(appError('category create failed'))

		res.status(201).json({
			status: 'success',
			data: category,
		})

	} catch (error) {
		if(req.body.image?.secure_url) {
			promisify(fileService.removeFile)(req.body.image.secure_url)
		}

		if(error instanceof Error) next(appError(error.message))
		if(typeof error === 'string') next(appError(error))
	}
})


// GET 	/api/categories/:categoryId
export const getCategoryById:RequestHandler = catchAsync(async (req, res, next) => {
	const categoryId = req.params.categoryId

	const category = await Category.findById(categoryId)
	if(!categoryId) return next(appError(`category not found by id: ${categoryId}`))

	res.status(200).json({
		status: 'success',
		data: category,
	})
})


// PATCH 	/api/categories/:categoryId
export const updateCategoryById:RequestHandler = catchAsync(async (req, res, next) => {
	const categoryId = req.params.categoryId

	const filteredBody = filterBodyForUpdateCategory(req.body) 

	const allowedFields = [
		'name',
		'shippingCharge',
		'vat',
		'status',
		'commission',
	]

	// console.log(filteredBody)

	const category = await Category.findByIdAndUpdate(categoryId, filteredBody, { new: true })
	if(!category) return next(appError(`cagegory update failed, allowedFields:${allowedFields.join(',')} `))

	res.status(201).json({
		status: 'success',
		data: category,
	})
})

// DELETE 	/api/categories/:categoryId
export const deleteCategoryById:RequestHandler = catchAsync(async (req, res, next) => {
	const categoryId = req.params.categoryId

	const category = await Category.findByIdAndDelete(categoryId)
	if(!category) return next(appError('category deletation failed'))

	if(category.image) {
		promisify(fileService.removeFile)(category.image.secure_url)
	}

	res.status(204).json({
		status: 'success',
		data: category,
	})
})