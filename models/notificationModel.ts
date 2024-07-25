import type { CreateNotification, NotificationDocument } from '../types/notification'
import type { Model } from 'mongoose'
import { Schema, model } from 'mongoose'

/*
{
	"customId": 'bhc000001',
	"status": 'active',
	"discount": 42,
}
*/



type NotificationModel =  Model<NotificationDocument> & {
  createNotification(payload: CreateNotification): Promise<NotificationDocument>;
}

const notificationSchema = new Schema<NotificationDocument>({
	type: { 													// set how many type of notification can be allowed by enum value
		type: String,
		trim: true,
		lowercase: true,
		required: true,
		// enum: ['new-review', 'new-comment', 'payment-request']
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
			type: 'new-message', 										// ['new-review', 'new-comment', 'payment-request']
			entryId: messageId, 										// if type ='new-review' then entryId=review._id
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


// const Notification: Model<NotificationDocument> = models.Notification || model<NotificationDocument, NotificationModel>('Notification', notificationSchema)
const Notification: NotificationModel = model<NotificationDocument, NotificationModel>('Notification', notificationSchema)
export default Notification
