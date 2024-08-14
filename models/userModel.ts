import type { UserDocument } from '../types/user'
import type { Model } from 'mongoose'
import { model, models, Schema } from 'mongoose'
import bcryptjs from 'bcryptjs'
import crypto from 'node:crypto'

import isEmail from 'validator/lib/isEmail'

// // Method-1.1:
// interface UserDocumentMethods extends Document {
//   comparePassword: (plainTextPassword: string) => Promise<boolean>
// }

// // Method-1.2:
// type UserDocumentMethods = Document & {
//   comparePassword: (password: string) => Promise<boolean>
// }


/* Method-2: Define that method directly in Schema models type

export type UserDocument = Document & {
	name: string
	email: string
	password: string
	confirmPassword?: string
	avatar: Image
	clientId: string 							// social media login 
	role: string
	passwordResetToken: string

	comparePassword: (password: string) => Promise<boolean>
}
*/ 



/*
{

"name" : "Riajul Islam",
"email" : "riajul@gmail.com",
"password" : "asdfasdf",
"confirmPassword?" : "asdfasdf",
"coverPhoto" : "",
"avatar" : "",
"phone" : "",
"gender" : "",
"location: {
	address1: string
	address2: string
	city: string
	state: string
	postcode: number,
	country: string
},

otherPermissions : {
	isVendor: boolean,
	isCustomer: boolean,
	isCategories: boolean,
	isProducts: boolean,
	isOrders: boolean,
	isReviews: boolean,
	isVouchers: boolean,
	isAdManager: boolean,
	isRoleManager: boolean,
	isMessageCenter: boolean,
	isFinance: boolean,
	isShipment: boolean,
	isSupport: boolean,
	isEventManager: boolean,
	isMessage: boolean,
},

idCardFrontPageImage: "image.png",
idCardBackPageImage: "image.png",
idCardNumber: "2434212412",
bankStatementImage: "image.png",
accountHolderName: "John Doe",
accountNumber: "2434212412",
routingNumber: "2434212412",
bankName: "Bank Name",
bankBranch: "Bank Branch", 

status: "pending", 
}
*/

const userSchema = new Schema<UserDocument>({
	clientId: String, 		// for social media login
	customId: String, 		// a formated user id for UI
	name: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
	},
	email: {
		type: String,
		// required: true,
		lowercase: true,
		trim: true,
		unique: true,
		validate: isEmail
	},
	password: {
		type: String,
		required: true,
		minlength: 8,
		select: false
	},
	confirmPassword: {
		type: String,
		// required: true,
		validate: function(this: UserDocument, val: string, ) {
			return this.password === val
		},
	},
	passwordResetToken: String,

	role: {
		type: String,
		enum: ['admin', 'vendor', 'user'],
		default: 'user',
		trim: true,
		lowercase: true,
	},
	isActive: {
		type: Boolean,
		default: false
	},
	isVerified: {
		type: Boolean,
		default: false
	},

	coverPhoto: {
		public_id: String,
		secure_url: String,
		alt: String,
		size: String
	},
	avatar: {
		public_id: String,
		secure_url: String,
		alt: String,
		size: String
	},

	phone: {
		type: String,
		default: ''
	},

	location: {
		address1: {
			type: String,
			trim: true,
			lowercase: true,
			minlength: 4,
			maxlength: 200,
			default: 'unknown'
		},
		address2: {
			type: String,
			trim: true,
			lowercase: true,
			maxlength: 200,
			default: ''
		},
		city: {
			type: String,
			trim: true,
			lowercase: true,
			minlength: 3,
			maxlength: 200,
			default: 'dhaka',
		},
		state: {
			type: String,
			trim: true,
			lowercase: true,
			minlength: 3,
			maxlength: 200,
			default: 'dhaka',
		},
		postcode: {
			type: Number,
			min: 100,
			max: 99999,
			default: 1212,
		},
		country: {
			type: String,
			trim: true,
			lowercase: true,
			minlength: 3,
			maxlength: 200,
			default: 'bangladesh',
		},
	},

	gender: {
		type: String,
		enum: ['male', 'female', 'other', 'undefined'],
		lowercase: true,
		default: 'undefined'
	},

	otherPermissions : {
		isVendor: Boolean,
		isCustomer: Boolean,
		isCategories: Boolean,
		isProducts: Boolean,
		isOrders: Boolean,
		isReviews: Boolean,
		isVouchers: Boolean,
		isAdManager: Boolean,
		isRoleManager: Boolean,
		isMessageCenter: Boolean,
		isFinance: Boolean,
		isShipment: Boolean,
		isSupport: Boolean,
		isEventManager: Boolean,
		isMessage: Boolean,
	},

	likes: [{ 													
		type: Schema.Types.ObjectId,
		ref: 'Product',
	}],

	orders: [{ 													
		type: Schema.Types.ObjectId,
		ref: 'Payment',
	}],


	// Bank Info
	idCardFrontPageImage: {
		public_id: String,
		secure_url: String,
		alt: String,
		size: String
	},
	idCardBackPageImage: {
		public_id: String,
		secure_url: String,
		alt: String,
		size: String
	},
	bankStatementImage: {
		public_id: String,
		secure_url: String,
		alt: String,
		size: String
	},
	idCardNumber: {
		type: String,
		lowercase: true,
		trim: true,
	},
	accountHolderName: {
		type: String,
		lowercase: true,
		trim: true,
	},
	accountNumber: {
		type: String,
		lowercase: true,
		trim: true,
	},
	routingNumber: {
		type: String,
		lowercase: true,
		trim: true,
	},
	bankName: {
		type: String,
		lowercase: true,
		trim: true,
	},
	bankBranch: {
		type: String,
		lowercase: true,
		trim: true,
	},

	status: {
		type: String,
		lowercase: true,
		trim: true,
		default: 'unknown'
	},


}, {
	timestamps: true
})

userSchema.pre('save', async function(next) {
	if( !this.isModified('password') ) return

	this.password = await bcryptjs.hash(this.password, 12)
	this.confirmPassword = undefined
	next()
})

userSchema.methods.comparePassword = async function(this: UserDocument, password: string ) {
	return await bcryptjs.compare(password, this.password)
}

/* 	const user = await User.findOne()
		const token = await user.passwordResetToken() */
userSchema.methods.getPasswordResetToken = async function (this: UserDocument) {
	const resetToken = crypto.randomBytes(32).toString('hex')

	// save the hashed version in database, and return unhashed, so that hash it again then compare it
	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
	await this.save({ validateBeforeSave: false }) 	// validation requires all the fields

	// return to unhashed version to user, which will be send via email (securely)
	return resetToken
}


// type ResetTokenPayload = {
// 	resetToken: string
// 	password: string
// 	confirmPassword: string
// }
// userSchema.methods.handlePasswordResetToken = async function(this:UserDocument, payload: ResetTokenPayload) {
// 	const { resetToken, password, confirmPassword } = payload

// 	// const resetToken = this.passwordResetToken
// 	if(!resetToken) throw new Error('passwordResetToken is empty')

// 	const digestToken = crypto.createHash('sha256').update(resetToken).digest('hex')
// 	if(resetToken !== digestToken) throw new Error('passwordResetToken validation failed, please try again')
	

// 	this.passwordResetToken = undefined
// 	this.updatedAt = new Date()

// 	this.password = password
// 	this.confirmPassword = confirmPassword
// 	await this.save() 				
// 	// await this.save({ validator: true }) 				// it will check password validation, so don't trun off validation

// 	// console.log( this.constructor )
// 	this.password = '' 									// don't show password
// 	this.confirmPassword = ''

// 	return this
// }
// userSchema.methods.passwordResetHandler = async function(password: string, confirmPassword: string) {
// 	this.passwordResetToken = undefined

// 	/* Must need to update passwordChangedAt property, so that password changed after login or not, can be chedked
// 			We can it also in 2 ways/place:
// 				1. here like this 	:	this.passwordChangedAt = new Date()
// 				2. in middleware 		:

// 				.pre('save', function() {
// 					if( !this.isModified('password') ) return
// 					this.passwordChangedAt: new Date();
// 					next()
// 				})
// 						. middleware is the parject place for this job, because it run everytime automatically without any warry.
// 							but because it is only need to update once, so method (1) is ok too */
// 	this.passwordChangedAt = new Date()

// 	this.password = password
// 	this.confirmPassword = confirmPassword
// 	await this.save({ validator: true }) 				// it will check password validation, so don't trun off validation

// 	// console.log( this.constructor )
// 	this.password = undefined 									// don't show password
// 	this.confirmPassword = undefined
// 	return this
// }


export const User: Model<UserDocument>  = models.User|| model<UserDocument>('User', userSchema)
export default User


