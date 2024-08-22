import type { RequestHandler } from 'express'
import { appError, catchAsync } from './errorController'
import { filterBodyForUpdatePackage } from '../dtos/packageDto'
import { promisify } from 'util';
import { apiFeatures, getDataUrlSize } from '../utils';
import Package from '../models/packageModel'
import * as fileService from '../services/fileService'


// GET 	/api/packages
export const getAllPackages:RequestHandler = catchAsync(async (req, res, _next) => {
	// const packages = await Package.find()
	const packages = await apiFeatures(Package, req.query, {})
	const total = await Package.countDocuments()

	res.status(200).json({
		status: 'success',
		total,
		data: packages,
	})
})

// POST 	/api/packages
export const addPackage:RequestHandler = catchAsync(async (req, res, next) => {
	try {
		if(req.body.image) {
			// check file size
			const imageSize = getDataUrlSize(req.body.image)
			const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))

			// upload file and return { error, image: { public_i, secure_url }}
			const { error: _avatarError, image: image } = await fileService.handleBase64File(req.body.image, '/packages')
			// if(avatarError || !image) return next(appError(avatarError))

			if(image) req.body.image = image
		}

		const packageDoc = await Package.create(req.body)
		if(!packageDoc) return next(appError('package create failed'))

		res.status(201).json({
			status: 'success',
			data: packageDoc,
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
	try {
		if(req.body.image) {
			// check file size
			const imageSize = getDataUrlSize(req.body.image)
			const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))

			// upload file and return { error, image: { public_i, secure_url }}
			const { error: _avatarError, image: image } = await fileService.handleBase64File(req.body.image, '/packages')
			// if(avatarError || !image) return next(appError(avatarError))

			if(image) req.body.image = image
		}

		const packageId = req.params.packageId
		const filteredBody = filterBodyForUpdatePackage(req.body) 

		const allowedFields = [
			'name',
			'status',
			'duration',
			'price',
			'maxProduct',
		]

		const packageDoc = await Package.findById(packageId )
		if(!packageDoc) return next(appError('packageDoc not found'))

		const updatedPackageDoc = await Package.findByIdAndUpdate(packageId, filteredBody, { new: true })
		if(!updatedPackageDoc) return next(appError(`Package update failed, allowedFields:${allowedFields.join(',')} `))

		// delete old image
		if(req.body.image && packageDoc.image?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(packageDoc.image.secure_url)
			}, 1000);
		}

		res.status(201).json({
			status: 'success',
			data: updatedPackageDoc,
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

// DELETE 	/api/packages/:packageId
export const deletePackage:RequestHandler = catchAsync(async (req, res, next) => {
	try {
		const packageId = req.params.packageId

		const filteredBody = req.body

		const packageDoc = await Package.findByIdAndDelete(packageId, filteredBody)
		if(!packageDoc) return next(appError('Package deletation failed'))

		// delete old image
		if(packageDoc.image?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(packageDoc.image.secure_url)
			}, 1000);
		}

		res.status(204).json({
			status: 'success',
			data: packageDoc,
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