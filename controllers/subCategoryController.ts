import type { RequestHandler } from 'express'
import { appError, catchAsync } from './errorController'
import SubCategory from '../models/subCategoryModel'
import { filterBodyForUpdateSubCategory } from '../dtos/categoryDto'
// import Category from '../models/categoryModel'

// GET 	/api/sub-categories
export const getAllSubCagegories:RequestHandler = catchAsync(async (_req, res, _next) => {
	const subCategories = await SubCategory.find()

	res.status(200).json({
		status: 'success',
		total: subCategories.length,
		data: subCategories,
	})
})

// POST 	/api/sub-categories
export const addSubCategory:RequestHandler = catchAsync(async (req, res, next) => {

	//--- For vendorId
	// const currentDocuments = await Category.countDocuments()
	// const	customId = generateSequentialCustomId({ 
	// 	categoryName: 'Category', 
	// 	countDocuments: currentDocuments
	// })
	// req.body.customId = customId

	const { category: categoryId } = req.body
	if(!categoryId) return next(appError('you must provide category ID'))

	const subCategory = await SubCategory.create(req.body)
	if(!subCategory) return next(appError('subCategory create failed'))

	// -----[ Create virtual fields instead, super easy to manage ]
	// // Add subCagegory as child of Category
	// const updatedCategory = await Category.findByIdAndUpdate( categoryId, {
	// 	"$addToSet": { subCategories: subCategory._id }
	// }, { new: true })
	// if(!updatedCategory) return next(appError('update cagegory failed'))


	res.status(201).json({
		status: 'success',
		data: subCategory,
	})
})


// GET 	/api/sub-categories/:subCategoryId
export const getSubCategoryById:RequestHandler = catchAsync(async (req, res, next) => {
	const subCategoryId = req.params.subCategoryId

	const subCategory = await SubCategory.findById(subCategoryId)
	if(!subCategoryId) return next(appError(`category not found by id: ${subCategoryId}`))


	res.status(200).json({
		status: 'success',
		data: subCategory,
	})
})


// PATCH 	/api/sub-categories/:subCategoryId
export const updateSubCategoryById:RequestHandler = catchAsync(async (req, res, next) => {
	const subCategoryId = req.params.subCategoryId

	const filteredBody = filterBodyForUpdateSubCategory(req.body) 

	const allowedFields = [
		'name',
		'shippingCharge',
		'vat',
		'status',
		'commission',
	]

	// console.log(filteredBody)

	const subCategory = await SubCategory.findByIdAndUpdate(subCategoryId, filteredBody, { new: true })
	if(!subCategory) return next(appError(`subCagegory update failed, allowedFields:${allowedFields.join(',')} `))

	res.status(201).json({
		status: 'success',
		data: subCategory,
	})
})

// DELETE 	/api/sub-categories/:subCategoryId
export const deleteSubCategoryById:RequestHandler = catchAsync(async (req, res, next) => {
	const subCategoryId = req.params.subCategoryId

	const subCategory = await SubCategory.findByIdAndDelete(subCategoryId)
	if(!subCategory) return next(appError('category deletation failed'))

	// // Remove subCagegory from child of Category
	// const updatedCategory = await Category.findByIdAndUpdate( subCategory.category, {
	// 	"$pull": { subCategories: subCategory._id }
	// }, { new: true })
	// if(!updatedCategory) return next(appError('update cagegory failed'))


	res.status(204).json({
		status: 'success',
		data: subCategory,
	})
})