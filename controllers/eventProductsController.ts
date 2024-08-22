import type { RequestHandler } from 'express';
import { appError, catchAsync } from './errorController';
import EventProduct from '../models/eventProductModel';
import { apiFeatures } from '../utils';


// GET 	/api/event-products
export const getEventProducts: RequestHandler = catchAsync( async (req, res, _next) => {
	// const eventProducts = await EventProduct.find()
	const filter = {}
	const eventProducts = await apiFeatures(EventProduct, req.query, filter)
	const total = await EventProduct.countDocuments()

	res.status(200).json({
		status: 'success',
		total,
		data: eventProducts
	})
})

// GET 	/api/event-products/:eventProductId
export const getEventProductById: RequestHandler = catchAsync( async (req, res, next) => {
	const { eventProductId = ''} = req.params

	const eventProduct = await EventProduct.findById(eventProductId)
	if(!eventProduct) return next(appError('no eventProduct document found'))

	res.status(200).json({
		status: 'success',
		data: eventProduct
	})
})

// POST 	/api/event-products
export const addEventProduct: RequestHandler = catchAsync( async (req, res, next) => {
	const eventProduct = await EventProduct.create(req.body)
	if(!eventProduct) return next(appError('no eventProduct document found'))

	res.status(201).json({
		status: 'success',
		data: eventProduct
	})
})

// PATCH 	/api/event-products/:eventProductId
export const updateEventProduct: RequestHandler = catchAsync( async (req, res, next) => {
	const { eventProductId = ''} = req.params

	const eventProduct = await EventProduct.findByIdAndUpdate(eventProductId, req.body, { new: true })
	if(!eventProduct) return next(appError('no eventProduct document update failed'))

	res.status(201).json({
		status: 'success',
		data: eventProduct
	})
})

// DELETE 	/api/event-products/:eventProductId
export const deleteEventProduct: RequestHandler = catchAsync( async (req, res, next) => {
	const { eventProductId = ''} = req.params

	const eventProduct = await EventProduct.findByIdAndDelete(eventProductId)
	if(!eventProduct) return next(appError('no eventProduct document deletation failed'))

	res.status(204).json({
		status: 'success',
		data: eventProduct
	})
})



