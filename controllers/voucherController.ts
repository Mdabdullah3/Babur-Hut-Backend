import type { RequestHandler } from 'express'
import { appError, catchAsync } from './errorController'
import Voucher from '../models/voucherModel'
import { generateSequentialCustomId } from '../utils'
import { filterBodyForUpdateVoucher } from '../dtos/voucherDto'

// GET 	/api/vouchers
export const getAllVouchers:RequestHandler = catchAsync(async (_req, res, _next) => {
	const vouchers = await Voucher.find()

	res.status(200).json({
		status: 'success',
		total: vouchers.length,
		data: vouchers,
	})
})

// POST 	/api/vouchers
export const addVoucher:RequestHandler = catchAsync(async (req, res, next) => {

	//--- For vendorId
	const { discount } = req.body
	if(!discount) return next(appError('discount missing needed'))

	const currentDocuments = await Voucher.countDocuments()
	const	customId = generateSequentialCustomId({ 
		categoryName: 'Voucher', 
		countDocuments: currentDocuments
	})
	req.body.customId = customId

	const voucher = await Voucher.create(req.body)
	if(!voucher) return next(appError('voucher create failed'))

	res.status(201).json({
		status: 'success',
		data: voucher,
	})
})


// GET 	/api/vouchers/:voucherId
export const getVoucherById:RequestHandler = catchAsync(async (req, res, next) => {
	const voucherId = req.params.voucherId

	const voucher = await Voucher.findById(voucherId)
	if(!voucherId) return next(appError(`voucher not found by id: ${voucherId}`))

	res.status(200).json({
		status: 'success',
		data: voucher,
	})
})


// PATCH 	/api/vouchers/:voucherId
export const updateVoucher:RequestHandler = catchAsync(async (req, res, next) => {
	const voucherId = req.params.voucherId

	const filteredBody = filterBodyForUpdateVoucher(req.body) 

	const allowedFields = [
		'voucherId',
		'status',
		'discount',
		'startDate',
		'endDate',
	]

	// console.log(filteredBody)

	const voucher = await Voucher.findByIdAndUpdate(voucherId, filteredBody, { new: true })
	if(!voucher) return next(appError(`voucher update failed, allowedFields:${allowedFields.join(',')} `))

	res.status(201).json({
		status: 'success',
		data: voucher,
	})
})

// DELETE 	/api/vouchers/:voucherId
export const deleteVoucher:RequestHandler = catchAsync(async (req, res, next) => {
	const voucherId = req.params.voucherId

	const filteredBody = req.body

	const voucher = await Voucher.findByIdAndDelete(voucherId, filteredBody)
	if(!voucher) return next(appError('voucher deletation failed'))

	res.status(204).json({
		status: 'success',
		data: voucher,
	})
})