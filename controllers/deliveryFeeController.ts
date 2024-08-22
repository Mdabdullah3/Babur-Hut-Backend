import type { RequestHandler } from 'express';
import { appError, catchAsync } from './errorController';
import { apiFeatures } from '../utils';
import DeliveryFee from '../models/deliveryFeeModel';

import { deliveryFeesData } from '../data/deliveryFees';


// GET 	/api/delivery-fees
export const getDeliveryFees: RequestHandler = catchAsync( async (req, res, _next) => {
	// const deliveryFees = await DeliveryFee.find()
	const filter = {}
	const deliveryFees = await apiFeatures(DeliveryFee, req.query, filter)
	const total = await DeliveryFee.countDocuments()

	res.status(200).json({
		status: 'success',
		total,
		data: deliveryFees
	})
})

// GET 	/api/delivery-fees/:deliveryFeeId
export const getDeliveryFeeById: RequestHandler = catchAsync( async (req, res, next) => {
	const { deliveryFeeId = ''} = req.params

	const deliveryFee = await DeliveryFee.findById(deliveryFeeId)
	if(!deliveryFee) return next(appError('no deliveryFee document found'))

	res.status(200).json({
		status: 'success',
		data: deliveryFee
	})
})

// POST 	/api/delivery-fees
export const addDeliveryFee: RequestHandler = catchAsync( async (req, res, next) => {
	const deliveryFee = await DeliveryFee.create(req.body)
	if(!deliveryFee) return next(appError('no deliveryFee document found'))

	res.status(201).json({
		status: 'success',
		data: deliveryFee
	})
})

// PATCH 	/api/delivery-fees/:deliveryFeeId
export const updateDeliveryFee: RequestHandler = catchAsync( async (req, res, next) => {
	const { deliveryFeeId = ''} = req.params

	const deliveryFee = await DeliveryFee.findByIdAndUpdate(deliveryFeeId, req.body, { new: true })
	if(!deliveryFee) return next(appError('no deliveryFee document update failed'))

	res.status(201).json({
		status: 'success',
		data: deliveryFee
	})
})


// PATCH 	/api/delivery-fees/update-many
export const updateManyDeliveryFee: RequestHandler = catchAsync( async (req, res, next) => {
	const deliveryFeeIds = req.body.deliveryFeeIds
	if(!deliveryFeeIds?.length) return next(appError('must provide: deliveryFeeIds'))


	const deliveryFee = await DeliveryFee.updateMany(
		{
			_id: { $in: [...deliveryFeeIds ] },
		},
		{ 
			$set: { deliveryFee: req.body.deliveryFee }
		}
	)
	if(!deliveryFee) return next(appError('no deliveryFee document update failed'))

	res.status(201).json({
		status: 'success',
		data: deliveryFee
	})
})


// DELETE 	/api/delivery-fees/:deliveryFeeId
export const deleteDeliveryFee: RequestHandler = catchAsync( async (req, res, next) => {
	const { deliveryFeeId = ''} = req.params

	const deliveryFee = await DeliveryFee.findByIdAndDelete(deliveryFeeId)
	if(!deliveryFee) return next(appError('no deliveryFee document deletation failed'))

	res.status(204).json({
		status: 'success',
		data: deliveryFee
	})
})




// GET 	/api/delivery-fees/reset
export const resetDeliveryFee: RequestHandler = catchAsync( async (_req, res, next) => {

	const deletedAll = await DeliveryFee.deleteMany({})
	if(!deletedAll) return next(appError('deleting previous deliveryFee documents failed'))

	const deliveryFee = await DeliveryFee.create(deliveryFeesData)
	if(!deliveryFee) return next(appError('no deliveryFee document found'))

	res.status(201).json({
		status: 'success',
		data: deliveryFee
	})
})
