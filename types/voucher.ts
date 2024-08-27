import { Types, Document } from 'mongoose'

export type VoucherDocument = Document & {
	user: Types.ObjectId,
	customId: string
	voucherId: string
	status: string
	redeemCode: string
	discount: number,
	startDate: Date,
	endDate: Date,
 	discountType: string
 	minimumPurchase:string
}


export type UpdateVoucher = {
	user: Types.ObjectId,
	voucherId: string
	status: string
	redeemCode: string
	discount: number,
	startDate: Date,
	endDate: Date,
 	discountType: string
 	minimumPurchase:string
}
