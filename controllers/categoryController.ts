import type { RequestHandler } from 'express'
import { appError, catchAsync } from './errorController'
import Category from '../models/categoryModel'
import { filterBodyForUpdateCategory } from '../dtos/categoryDto'

// GET 	/api/categories
export const getAllCagegories:RequestHandler = catchAsync(async (_req, res, _next) => {
	const categories = await Category.find()
	.populate('subCategories')

	res.status(200).json({
		status: 'success',
		total: categories.length,
		data: categories,
	})
})

// POST 	/api/categories
export const addCategory:RequestHandler = catchAsync(async (req, res, next) => {

	//--- For vendorId
	// const currentDocuments = await Category.countDocuments()
	// const	customId = generateSequentialCustomId({ 
	// 	categoryName: 'Category', 
	// 	countDocuments: currentDocuments
	// })
	// req.body.customId = customId

	const category = await Category.create(req.body)
	if(!category) return next(appError('category create failed'))

	res.status(201).json({
		status: 'success',
		data: category,
	})
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

	res.status(204).json({
		status: 'success',
		data: category,
	})
})