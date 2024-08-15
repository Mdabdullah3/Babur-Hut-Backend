import type { OrderDocument } from '../types/order'
import type { Model } from 'mongoose'
import { model, models, Schema } from 'mongoose'


/*
{
	"user": "user.id",
	"product": "product.id",
	"transactionId": "transactionId",

	"price": "my-product-name",
	"currency": 'BDT',

	"shippingInfo" : {
		"method": "Courier",
		"address1": "shipping address",
		"address2": "",
		"city": "Dhaka",
		"state": "Dhaka",
		"postcode": 1000,
		"country": "Bangladesh",
	}
}

*/


// this model is replaced by paymentModel
const orderModel = new Schema<OrderDocument>({

	user: { 																	// customer
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		unique: true,
	},
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
		required: true,
		unique: true,
	},

	customers: [{ 													
		type: Schema.Types.ObjectId,
		ref: 'User',
	}],

	transactionId: {
		type: Schema.Types.ObjectId,
		required: true,
		unique: true,
	},

	currency: {
		type: String,
		trim: true,
		lowercase: true,
		minlength: 2,
		maxlength: 4,
		default: 'bdt'
	},
	price: {
		type: Number,
		required: true,
		min: 1,
		// set: function(price: number) { 		// because we set: price: Float! in GraphQL Schema
		// 	return price.toFixed(2)
		// }
	},

	shippingInfo: {
		method: {
			type: String,
			trim: true,
			lowercase: true,
			enum: ['Courier'], 					// need from frontend
			required: true,
		},
		address1: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			minlength: 8,
			maxlength: 200
		},
		address2: {
			type: String,
			trim: true,
			lowercase: true,
			default: ''
		},
		city: {
			type: String,
			trim: true,
			lowercase: true,
			minlength: 3,
			maxlength: 200,
			required: true,
		},
		state: {
			type: String,
			trim: true,
			lowercase: true,
			minlength: 3,
			maxlength: 200,
			required: true,
		},
		postcode: {
			type: Number,
			min: 100,
			max: 99999,
			required: true,
		},
		country: {
			type: String,
			trim: true,
			lowercase: true,
			minlength: 3,
			maxlength: 200,
			default: 'bangladesh',
		},
	}

}, {
	timestamps: true
})


export const Order: Model<OrderDocument> = models.Order || model<OrderDocument>('Order', orderModel)
export default Order



