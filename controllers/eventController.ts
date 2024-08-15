import type { RequestHandler } from 'express';
import { appError, catchAsync } from './errorController';
import { getDataUrlSize } from '../utils';
import * as fileService from '../services/fileService'
import Event from '../models/eventModel';
import { promisify } from 'util';


// GET 	/api/events
export const getEvents: RequestHandler = catchAsync( async (_req, res, _next) => {
	const events = await Event.find()

	res.status(200).json({
		status: 'success',
		total: events.length,
		data: events
	})
})

// GET 	/api/events/:eventId
export const getEventById: RequestHandler = catchAsync( async (req, res, next) => {
	const { eventId = ''} = req.params

	const event = await Event.findById(eventId)
	if(!event) return next(appError('no event document found'))

	res.status(200).json({
		status: 'success',
		data: event
	})
})

// POST 	/api/events
export const addEvent: RequestHandler = catchAsync( async (req, res, next) => {
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

		const event = await Event.create(req.body)
		if(!event) return next(appError('no event document found'))

		res.status(201).json({
			status: 'success',
			data: event
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

// PATCH 	/api/events/:eventId
export const updateEvent: RequestHandler = catchAsync( async (req, res, next) => {
	try {
		const { eventId = ''} = req.params

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

		const event = await Event.findById(eventId )
		if(!event) return next(appError('product not found'))

		const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, { new: true })
		if(!updatedEvent) return next(appError('no event document update failed'))

		// delete old image
		if(updatedEvent.image && event.image?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(event.image.secure_url)
			}, 1000);
		}


		res.status(201).json({
			status: 'success',
			data: updatedEvent
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

// DELETE 	/api/events/:eventId
export const deleteEvent: RequestHandler = catchAsync( async (req, res, next) => {
	try {
		const { eventId = ''} = req.params

		const event = await Event.findByIdAndDelete(eventId)
		if(!event) return next(appError('no event document deletation failed'))

		// delete old image
		if(event.image?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(event.image.secure_url)
			}, 1000);
		}

		res.status(204).json({
			status: 'success',
			data: event
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



