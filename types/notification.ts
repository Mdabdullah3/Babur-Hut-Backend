import type { Types, Document } from 'mongoose'

export type NotificationDocument = Document & {
	entryId: Types.ObjectId
	userFrom: Types.ObjectId
	userTo: Types.ObjectId
	type: string
	isOpened: boolean
}

// export type NotificationDocument = {
// 	_id: Types.ObjectId,
// 	id: string,
// 	createdAt: string,
// 	updatedAt: string

// 	entryId: Types.ObjectId
// 	userFrom: Types.ObjectId
// 	userTo: Types.ObjectId
// 	type: string
// 	isOpened: boolean
// }

export type CreateNotification = {
	type: string 																// ['new-review', 'follow', 'call']
	entryId: Types.ObjectId 										// if new-review, that entryId => Review._id
	userFrom: Types.ObjectId 										// Who liked it ?
	userTo: Types.ObjectId 											// which user create this tweet ?
}

// export type UpdateNotification = {
// 	voucherId: string
// 	status: string
// 	discount: number,
// 	startDate: Date,
// 	endDate: Date,
// }
