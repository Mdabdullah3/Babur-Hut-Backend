import type { Types, Document } from 'mongoose'

// export type NotificationDocument = {
// 	populate(arg0: string): unknown
// 	_id: Types.ObjectId
// 	id: string
// 	createdAt: Date
// 	updatedAt: Date

// 	entryId: Types.ObjectId
// 	userFrom: Types.ObjectId
// 	userTo: Types.ObjectId
// 	type: string
// 	isOpened: boolean
// }
export type NotificationDocument = Document & {
	entryId: Types.ObjectId 										// new Types.ObjectId('66911496ca3e9dbe71533baf')
	userFrom: Types.ObjectId
	userTo: Types.ObjectId
	type: string
	isOpened: boolean
}

export type CreateNotification = {
	type: string 																// ['new-review', 'follow', 'call']
	entryId: Types.ObjectId 										// if new-review, that entryId => Review._id
	userFrom: Types.ObjectId 										// Who liked it ?
	userTo: Types.ObjectId 											// which user create this tweet ?
}
