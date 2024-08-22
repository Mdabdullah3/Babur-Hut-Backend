import type { RequestHandler } from 'express'
import { promisify } from 'util'
import { appError, catchAsync } from './errorController'
import { filterBodyForUpdateSubCategory } from '../dtos/categoryDto'
import { apiFeatures, getDataUrlSize } from '../utils'
import * as fileService from '../services/fileService'
import SubCategory from '../models/subCategoryModel'

// GET 	/api/sub-categories
export const getAllSubCagegories:RequestHandler = catchAsync(async (req, res, _next) => {
	// const subCategories = await SubCategory.find()
	const subCategories = await apiFeatures(SubCategory, req.query, {})
	const total = await SubCategory.countDocuments()

	res.status(200).json({
		status: 'success',
		total,
		data: subCategories,
	})
})

// POST 	/api/sub-categories
export const addSubCategory:RequestHandler = catchAsync(async (req, res, next) => {

	try {
		if(req.body.image) {
			const imageSize = getDataUrlSize(req.body.image)
			const maxImageSize = 1024 * 1024 * 2 			// => 2 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max image size: 2MB(max)'))

			const { error: _errorImage, image } = await fileService.handleBase64File(req.body.image, '/subCategories')
			if(image) req.body.image = image
		}

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

	} catch (error: unknown) {
		setTimeout(() => {
			promisify(fileService.removeFile)(req.body.image.secure_url)
		}, 1000);

		if(error instanceof Error) next(appError(error.message))
		if(typeof error === 'string') next(appError(error))
	}
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
	try {
		const subCategoryId = req.params.subCategoryId

		const allowedFields = [
			'name',
			'shippingCharge',
			'vat',
			'status',
			'commission',
			'image',
			'icon',
		]

		if(req.body.image) {
			const imageSize = getDataUrlSize(req.body.image)
			const maxImageSize = 1024 * 1024 * 2 			// => 2 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max image size: 2MB(max)'))

			const { error: _errorImage, image } = await fileService.handleBase64File(req.body.image, '/subCcategories')
			if(image) req.body.image = image
		}

		const filteredBody = filterBodyForUpdateSubCategory(req.body) 

		const subCategory = await SubCategory.findById(subCategoryId)
		if(!subCategory) return next(appError(`no subCagegory found by id:${subCategoryId} `))

		const updatedSubCategory = await SubCategory.findByIdAndUpdate(subCategoryId, filteredBody, { new: true })
		if(!updatedSubCategory) return next(appError(`subCagegory update failed, allowedFields:${allowedFields.join(',')} `))

		// delete old image
		if(req.body.image && subCategory.image?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(subCategory.image.secure_url)
			}, 1000);
		}

		res.status(201).json({
			status: 'success',
			data: updatedSubCategory,
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