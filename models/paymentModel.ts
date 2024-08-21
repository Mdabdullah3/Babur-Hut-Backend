import { Schema, model } from 'mongoose';

import { IProduct, IShippingInfo, IOrder } from '../types/_test'


// Create the Product schema
const productSchema = new Schema<IProduct>({
	product: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	quantity: {
		type: Number,
		required: true
	}
});


// Create the Shipping Info schema
const shippingInfoSchema = new Schema<IShippingInfo>({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: true
	},
	method: {
		type: String,
		required: true
	},
	address1: {
		type: String,
		required: true
	},
	address2: String,
	city: {
		type: String,
		required: true
	},
	state: {
		type: String,
		required: true
	},
	postcode: {
		type: Number,
		required: true
	},
	country: {
		type: String,
		required: true
	},
	deliveryFee: {
		type: Number,
		required: true
	}
});

// Create the Order schema
const paymentSchema = new Schema<IOrder>({
	products: [productSchema],
	status: {
		type: String,
		lowercase: true,
		trim: true,
		enum: ['pending', 'completed', 'shipped', 'cancelled'],
		default: 'pending'
	},
	currency: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
	},
	paymentType: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	shippingInfo: shippingInfoSchema,


	orderCost: {
		type: Number,
		required: false
	},
	profit: {
		type: Number,
		required: false
	},
	brand: {
		type: String,
		required: false,
		lowercase: true,
		trim: true,
	}
}, { timestamps: true });



paymentSchema.pre(/^find/, function (this: IProduct, next) {
	this.populate('products.product')
	this.populate('user')

	next()
})


// Create and export the Order model
const Payment = model<IOrder>('Payment', paymentSchema);
export default Payment;
