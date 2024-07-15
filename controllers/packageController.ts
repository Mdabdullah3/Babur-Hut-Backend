import type { RequestHandler } from 'express'
import { appError, catchAsync } from './errorController'
import Package from '../models/packageModel'
import { filterBodyForUpdatePackage } from '../dtos/packageDto'

// GET 	/api/packages
export const getAllPackages:RequestHandler = catchAsync(async (_req, res, _next) => {
	const packages = await Package.find()

	res.status(200).json({
		status: 'success',
		total: packages.length,
		data: packages,
	})
})

// POST 	/api/packages
export const addPackage:RequestHandler = catchAsync(async (req, res, next) => {

	const packageDoc = await Package.create(req.body)
	if(!packageDoc) return next(appError('package create failed'))

	res.status(201).json({
		status: 'success',
		data: packageDoc,
	})
})


// GET 	/api/packages/:packageId
export const getPackageById:RequestHandler = catchAsync(async (req, res, next) => {
	const packageId = req.params.packageId

	const packageDoc = await Package.findById(packageId)
	if(!packageDoc) return next(appError(`Package not found by id: ${packageDoc}`))

	res.status(200).json({
		status: 'success',
		data: packageDoc,
	})
})


// PATCH 	/api/packages/:packageId
export const updatePackage:RequestHandler = catchAsync(async (req, res, next) => {
	const packageId = req.params.packageId

	const filteredBody = filterBodyForUpdatePackage(req.body) 

	const allowedFields = [
		'name',
		'status',
		'duration',
		'price',
		'maxProduct',
	]

	const packageDoc = await Package.findByIdAndUpdate(packageId, filteredBody, { new: true })
	if(!packageDoc) return next(appError(`Package update failed, allowedFields:${allowedFields.join(',')} `))

	res.status(201).json({
		status: 'success',
		data: packageDoc,
	})
})

// DELETE 	/api/packages/:packageId
export const deletePackage:RequestHandler = catchAsync(async (req, res, next) => {
	const packageId = req.params.packageId

	const filteredBody = req.body

	const packageDoc = await Package.findByIdAndDelete(packageId, filteredBody)
	if(!packageDoc) return next(appError('Package deletation failed'))

	res.status(204).json({
		status: 'success',
		data: packageDoc,
	})
})