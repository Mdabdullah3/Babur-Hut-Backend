import { Document } from 'mongoose'


export type DeliveryFee = {
	district: string
	deliveryFee: number
}
export type DeliveryFeeDocument = Document & DeliveryFee
