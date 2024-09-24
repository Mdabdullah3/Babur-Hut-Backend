import type { RequestHandler } from 'express';
import { appError, catchAsync } from './errorController';
import PackageProduct from '../models/packageProductModel';
import { apiFeatures } from '../utils';


// GET 	/api/package-products
export const getPackageProducts: RequestHandler = catchAsync( async (req, res, _next) => {
	// const eventProducts = await PackageProduct.find()
	const filter = {}
	const packageProducts = await apiFeatures(PackageProduct, req.query, filter)
	const total = await PackageProduct.countDocuments()

	res.status(200).json({
		status: 'success',
		total,
		data: packageProducts
	})
})

// => POST /api/package-products/meny
export const getlPackageProductsByIds:RequestHandler = catchAsync( async (req, res, _next) => {

	const packageProductIds = req.body.packageProductIds || []
	const packageProducts = await PackageProduct.find({_id: { $in: packageProductIds }})

	res.json({
		status: 'success',
		total: packageProducts.length,
		data: packageProducts,
	})
})

// GET 	/api/package-products/:packageProductId
export const getPackageProductById: RequestHandler = catchAsync( async (req, res, next) => {
	const { packageProductId = ''} = req.params

	const packageProduct = await PackageProduct.findById(packageProductId)
	if(!packageProduct) return next(appError('no packageProduct document found'))

	res.status(200).json({
		status: 'success',
		data: packageProduct
	})
})

// POST 	/api/package-products
export const addPackageProduct: RequestHandler = catchAsync( async (req, res, next) => {
	const packageProduct = await PackageProduct.create(req.body)
	if(!packageProduct) return next(appError('no packageProduct document found'))

	res.status(201).json({
		status: 'success',
		data: packageProduct
	})
})

// PATCH 	/api/package-products/:packageProductId
export const updatePackageProduct: RequestHandler = catchAsync( async (req, res, next) => {
	const { packageProductId = ''} = req.params

	const packageProduct = await PackageProduct.findByIdAndUpdate(packageProductId, req.body, { new: true })
	if(!packageProduct) return next(appError('no packageProduct document update failed'))

	res.status(201).json({
		status: 'success',
		data: packageProduct
	})
})

// DELETE 	/api/package-products/:packageProductId
export const deletePackageProduct: RequestHandler = catchAsync( async (req, res, next) => {
	const { packageProductId = ''} = req.params

	const packageProduct = await PackageProduct.findByIdAndDelete(packageProductId)
	if(!packageProduct) return next(appError('no packageProduct document deletation failed'))

	res.status(204).json({
		status: 'success',
		data: packageProduct
	})
})



