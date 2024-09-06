import { Types, Document } from 'mongoose'

type Image = {
	public_id: string
	secure_url: string
}



export type CategoryDocument = Document & {
	name: string
	shippingCharge: string
	shippingChargeType: string
	vat: string
	vatType: string
	status: string,
	commission: string,
	commissionType: string,
	image: Image
	icon: string

	transactionCost: string
	transactionCostType: string
	transactionId: string

	isHomeShown: boolean
	iconImage: Image
}

export type CreateCagetory = {
	name: string
	shippingCharge: string
	shippingChargeType: string
	vat: string
	vatType: string
	status: string,
	commission: Date,
	commissionType: string,
	image: Image
	icon: string
	transactionCost: string
	transactionCostType: string
	transactionId: string

	isHomeShown: boolean
	iconImage: Image
}
export type UpdateCagetory = {
	name: string
	shippingCharge: string
	shippingChargeType: string
	vat: string
	vatType: string
	status: string,
	commission: Date,
	commissionType: string,
	image: Image
	icon: string
	transactionCost: string
	transactionCostType: string
	transactionId: string

	isHomeShown: boolean
	iconImage: Image
}


export type SubCategoryDocument = Document & {
	category: Types.ObjectId
	name: string
	shippingCharge: string
	shippingChargeType: string
	vat: string
	vatType: string
	status: string,
	commission: string,
	commissionType: string,
	image: Image
	icon: string
	transactionCost: string
	transactionCostType: string
}

export type UpdateSubCagetory = {
	name: string
	shippingCharge: string
	shippingChargeType: string
	vat: string
	vatType: string
	status: string,
	commission: Date,
	commissionType: string,
	image: Image
	icon: string
	transactionCost: string
	transactionCostType: string
}



