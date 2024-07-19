import type { CreateNotification, NotificationDocument } from '../types/notification'
import type { Model } from 'mongoose'
import { Schema, models, model } from 'mongoose'

/*
{
	"customId": 'bhc000001',
	"status": 'active',
	"discount": 42,
}
*/

const notificationSchema = new Schema<NotificationDocument>({
	type: { 													// set how many type of notification can be allowed by enum value
		type: String,
		trim: true,
		lowercase: true,
		required: true,
		// enum: [''],
	},
	entryId: { 												// To identify each notification, it is belongs to which type of allowed 'type'
		type: Schema.Types.ObjectId, 		// 		for example: if type='new-review', then entryId=review._id
		required: true
	},
	userFrom: { 											// who create this notification 
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	userTo: { 												// to user the notification will be given
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	isOpened: { 		 									// to check is notification virewd or not, if viewed, then delete
		type: Boolean,
		default: false
	},

}, {
	timestamps: true,
})


/*
// GET /api/tweets/:id/retweet
	...
	if(!deletedTweet) {
		await Notification.createNotification({
			type: 'new-message', 										// ['new-message', 'follow', 'call']
			entryId: messageId, 										// Who which message this notification belongs to
			userFrom: logedInUserId, 								// Who liked it ?
			userTo: activeUserId, 									// which user create this tweet ?
		})
	}
*/ 
notificationSchema.statics.createNotification = async function ( payload: CreateNotification ) {
	await this.deleteOne(payload) 	// if same notification already exist, then delete that before create new one
	return this.create(payload)
}

notificationSchema.pre(/^find/, function(this: NotificationDocument, next) {
	this.populate('userFrom userTo')

	next()
})


export const Notification: Model<NotificationDocument> = models.Notification || model<NotificationDocument>('Notification', notificationSchema)
export default Notification
