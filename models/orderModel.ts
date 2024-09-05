import type { OrderDocument } from '../types/order'
import type { Model } from 'mongoose'
import { model, models, Schema } from 'mongoose'
import isEmail from 'validator/lib/isEmail'
import { sanitizeSchema } from '../services/sanitizeService'


/*
{
	"user": "user.id",
	"product": "product.id",
	// "transactionId": "transactionId",

	"price": "my-product-name",
	"currency": "BDT",
	"paymentType":  "cash-on-delivery",  					// ['courier', 'cash-on-delivery']
	"status": "pending", 													// ['pending', 'completed', 'shipped', 'cancelled'],

	"shippingInfo" : {
		"name": "riajul islam",
		"email": "riajul@gmail.com",
		"phone": "01957500605",

		"method": "Courier",
		"address1": "shipping address",
		"address2": "",
		"city": "Dhaka",
		"state": "Dhaka",
		"postcode": 1000,
		"country": "Bangladesh",

		"deliveryFee": 40
	}
}

{
  "user" : "667e915a3204d8967daaf4a1",
  "product" : "667ea9b1df5d6c0e864f1841",

	"price": 525,
	"currency": "BDT",
	"paymentType":  "cash-on-delivery",  
	"status": "pending", 

	"shippingInfo" : {
		"name": "riajul islam",
		"email": "riajul@gmail.com",
		"phone": "01957500605",

		"method": "Courier",
		"address1": "shipping address",
		"address2": "",
		"city": "Dhaka",
		"state": "Dhaka",
		"postcode": 1000,
		"country": "Bangladesh",

		"deliveryFee": 40
	}
}
*/

/*
[
	{
		"user" : "667e915a3204d8967daaf4a1",
		"product" : "667ea9b1df5d6c0e864f1841",

		"price": 525,
		"currency": "BDT",
		"paymentType":  "cash-on-delivery",  
		"status": "pending", 

		"shippingInfo" : {
			"name": "riajul islam",
			"email": "riajul@gmail.com",
			"phone": "01957500605",

			"method": "Courier",
			"address1": "shipping address",
			"address2": "",
			"city": "Dhaka",
			"state": "Dhaka",
			"postcode": 1000,
			"country": "Bangladesh",

			"deliveryFee": 40
		}
	},

	{
		"user" : "667e915a3204d8967daaf4a1",
		"product" : "667ea9b1df5d6c0e864f1841",

		"price": 525,
		"currency": "BDT",
		"paymentType":  "cash-on-delivery",  
		"status": "pending", 

		"shippingInfo" : {
			"name": "riajul islam",
			"email": "riajul@gmail.com",
			"phone": "01957500605",

			"method": "Courier",
			"address1": "shipping address",
			"address2": "",
			"city": "Dhaka",
			"state": "Dhaka",
			"postcode": 1000,
			"country": "Bangladesh",

			"deliveryFee": 40
		}
	}
]
*/


// this model is replaced by paymentModel
const orderSchema = new Schema<OrderDocument>({
	user: { 																	// customer
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
		required: true,
	},
	variantId: {
		type: Schema.Types.ObjectId,
	},
	transactionId: {
		type: String,
		required: true,
		// unique: true,
	},

	price: {
		type: Number,
		required: true,
		min: 1,
	},
	currency: {
		type: String,
		trim: true,
		lowercase: true,
		minlength: 2,
		maxlength: 4,
		default: 'bdt'
	},

	paymentType: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
		enum: ['courier', 'cash-on-delivery'],
		default: 'cash-on-delivery'
	},
	status: {
		type: String,
		lowercase: true,
		trim: true,
		enum: ['pending', 'completed', 'shipped', 'cancelled'],
		default: 'pending'
	},

	shippingInfo: {
		name: {
			type: String,
			trim: true,
			lowercase: true,
			required: true,
		},
		email: {
			type: String,
			lowercase: true,
			trim: true,
			validate: isEmail
		},
		phone: {
			type: String,
			trim: true,
			lowercase: true,
			required: true,
		},

		method: {
			type: String,
			trim: true,
			lowercase: true,
			// enum: ['courier'], 					// need from frontend
			required: true,
		},
		deliveryFee: {
			type: String,
			trim: true,
			lowercase: true,
			// enum: ['courier'], 					// need from frontend
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
			// required: true,
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

orderSchema.plugin(sanitizeSchema)

orderSchema.pre('save', function(next) {
	this.price = +this.price 								// convert to number
	// this.quantity = +this.quantity


	next()
})

export const Order: Model<OrderDocument> = models.Order || model<OrderDocument>('Order', orderSchema)
export default Order



