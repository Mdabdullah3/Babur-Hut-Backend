import { Types, Document } from 'mongoose'


export type FinanceDocument = Document & {
	user: Types.ObjectId,
	order: Types.ObjectId,

	name: string
	brand: string
	phone: string
	email: string
	profit: string
	orderCost: string
}

export type UpdateFinance = {
	user: Types.ObjectId,
	order: Types.ObjectId,

	name: string
	brand: string
	phone: string
	email: string
	profit: string
	orderCost: string
}
