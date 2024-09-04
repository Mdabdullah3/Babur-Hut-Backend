import type { RequestHandler } from 'express';
import { appError, catchAsync } from './errorController';
import { apiFeatures } from '../utils';
import { getDataUrlSize } from '../utils';
import { promisify } from 'util';
import * as fileService from '../services/fileService'
import Report from '../models/reportModel';


// GET 	/api/reports
export const getReports: RequestHandler = catchAsync( async (req, res, _next) => {

	let filter = {}

	if(req.query.reportsOnly) filter = { product: { $exists: true, $ne: null } } 
	if(req.query.chatsOnly) filter = { product: { $exists: false } } 


	const reports = await apiFeatures(Report, req.query, filter)
	// const total = await Report.countDocuments()

	res.status(200).json({
		status: 'success',
		// total,
		total: reports.length,
		data: reports
	})
})

// GET 	/api/reports/:reportId
export const getReportById: RequestHandler = catchAsync( async (req, res, next) => {
	const { reportId = ''} = req.params

	const report = await Report.findById(reportId)
	if(!report) return next(appError('no report document found'))

	res.status(200).json({
		status: 'success',
		data: report
	})
})

// POST 	/api/reports
export const addReport: RequestHandler = catchAsync( async (req, res, next) => {

	try {
		
		if(req.body.image) {
			// check file size
			const imageSize = getDataUrlSize(req.body.image)
			const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))

			// upload file and return { error, image: { public_i, secure_url }}
			const { error: _avatarError, image: image } = await fileService.handleBase64File(req.body.image, '/events')
			// if(avatarError || !image) return next(appError(avatarError))

			if(image) req.body.image = image
		}

		const report = await Report.create(req.body)
		if(!report) return next(appError('no report document found'))

		res.status(201).json({
			status: 'success',
			data: report
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

// PATCH 	/api/reports/:reportId
export const updateReport: RequestHandler = catchAsync( async (req, res, next) => {
	try {
		
		const { reportId = ''} = req.params

		req.body.user = undefined 	// don't allow to update userId

		if(req.body.image) {
			// check file size
			const imageSize = getDataUrlSize(req.body.image)
			const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))

			// upload file and return { error, image: { public_i, secure_url }}
			const { error: _avatarError, image: image } = await fileService.handleBase64File(req.body.image, '/events')
			// if(avatarError || !image) return next(appError(avatarError))

			if(image) req.body.image = image
		}

		const report = await Report.findById(reportId )
		if(!report) return next(appError('product not found'))

		const updatedReport = await Report.findByIdAndUpdate(reportId, req.body, { new: true })
		if(!updatedReport) return next(appError('report document update failed'))

		// delete old image
		if(req.body.image && report.image?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(report.image.secure_url)
			}, 1000);
		}

		res.status(201).json({
			status: 'success',
			data: updateReport
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

// DELETE 	/api/reports/:reportId
export const deleteReport: RequestHandler = catchAsync( async (req, res, next) => {
	try {
		const { reportId = ''} = req.params

		const report = await Report.findByIdAndDelete(reportId)
		if(!report) return next(appError('no report document deletation failed'))

		// delete old image
		if(report.image?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(report.image.secure_url)
			}, 1000);
		}

		res.status(204).json({
			status: 'success',
			data: report
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



