import type { ProductDocument } from '../types/product'
import type { Model } from 'mongoose'
import { model, models, Schema } from 'mongoose'
import slug from 'slugify'
import { product } from '../data/product'


/*
{
	"user": "alskdjfalksdjfaksjdf",
	"name": "my-product-name",
	"slug": "my-product-name",
	"price": 40,
	"quantity": 2,
	"summary": "summary description between 10-150",
	"description": "description between 10-1000",

	"category": "shirt",
	"brand": "niki",
	"size": "xl",

	"coverPhoto": "/upload/images/cover-photo.jpg",
	"images": [
		"/upload/images/photo-1.jpg",
		"/upload/images/photo-2.jpg",
		"/upload/images/photo-3.jpg",
	],
	"isLiked": true,
}
*/


const productSchema = new Schema<ProductDocument>({
	vendorId: {
		type: String,
		required: true,
		unique: true,
	},

	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	name: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		minlength: 5
	},
	slug: { 							// create from name property via pre('save') hook 
		type: String,
		unique: true,
		trim: true,
		lowercase: true,
		// minlength: 5, 		// if add validation then failed slug mising
		default: '',
	},
	price: {
		type: Number,
		required: true,
		min: 1,
		// set: function(price: number) { 		// because we set: price: Float! in GraphQL Schema
		// 	return price.toFixed(2)
		// }
	},
	quantity: {
		type: Number,
		default: 1
	},
	summary: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		minlength: 10,
		maxlength: 150
	},
	description: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		minlength: 10,
		maxlength: 1000
	},

	category: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		// enum: product.categories
	},
	brand: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		// enum: ['niki', 'adidas', 'ramond', 'oliver', 'zara', 'casely']
		enum: product.brands
	},
	size: {
		type: String,
		required: true,
		default: 'xs',
		// enum: ['xs', 'sm', 'lg', 'xxl']
		enum: product.sizes
	},
	// { public_id, secureUrl, altImageName, width, height }
	coverPhoto: {
		public_id: {
			type: String,
			required: true,
		},
		secure_url: {
			type: String,
			required: true,
		}

	},
	images: [{
		public_id: {
			type: String,
			required: true,
		},
		secure_url: {
			type: String,
			required: true,
		}
	}],

	video: {
		public_id: {
			type: String,
			// required: true,
		},
		secure_url: {
			type: String,
			// required: true,
		}

	},


	stock: { 								// increase stock on every Product.create() & reduce on Product.findAndDelete()
		type: Number,
		min: 0,
		default: 0,
	},
	sold: { 								// will be calculated from 'payments' collection
		type: Number,
		min: 0,
		default: 0,
	},
	revenue: { 							// will be calculated from 'payments' collection
		type: Number,
		min: 0,
		default: 0,
	},
	numReviews: [{ 					// calculated from reviews collection
		type: Number,
	}],
	ratings: { 							// will be calculated from 'reviews' collection
		type: Number,
		default: 4
	},

	specifications: {
		screenSize: String,
		batteryLife: String,
		cameraResolution: String,
		storageCapacity: String,
		os: String,
		size: String,
		material: String,
		color: String,
		gender: String
	},

	likes: [{ 													
		type: Schema.Types.ObjectId,
		ref: 'User',
	}],

}, {
	timestamps: true,
	toJSON: {
		virtuals: true 	// Step-1: required for virtual field 'reviews'
	}
})

// productSchema.pre('save', function(this) {
productSchema.pre('save', function(next) {
	this.price = +this.price 								// convert to number
	this.quantity = +this.quantity

	const slugString = this.slug.trim() ? this.slug : this.name
	this.slug = slug(slugString, { lower: true })

	next()
})

// // Step-2: Generate virtual field: 'reviews' from Review model where Review.product === product._id
productSchema.virtual('reviews', {
	ref: 'Review',
	foreignField: 'product',
	localField: '_id'
})

productSchema.pre('find', function (this: ProductDocument, next) {

	this.populate('reviews')
	this.populate('user')

	next()
})

// Step-3: GET or visiable reviews fieild 			: globally or on perticular review
// productSchema.pre(/find*/, async function( next ) {
// // productSchema.pre(/findOne/, async function( next ) {

// 	// this.populate('reviews', '-createdAt -updatedAt -__v', Review)
// 	this.populate({
// 		model: Review,
// 		path: 'reviews',
// 		select: '-updatedAt -__v'
// 	})

// 	next()
// })

export const Product: Model<ProductDocument> = models.Product || model<ProductDocument>('Product', productSchema)
export default Product


