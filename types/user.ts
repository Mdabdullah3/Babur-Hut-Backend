
import { Types, Document } from 'mongoose'

type Image = {
	public_id: string
	secure_url: string
}
// export type Info = {
// 	name: string
// 	value: string
// }
// export type Experience = {
// 	_id: Types.ObjectId
// 	title: string
// 	companyName: string
// 	joiningDate: Date
// 	currentStatus: 'active' | 'inactive'
// 	jobLocation: string
// 	logoBackgroundColor: string
// }

// enum Role {
// 	admin='admin',
// 	guest='guest',
// 	user='user'
// }

type Location = {
	address1: string
	address2: string
	city: string
	state: string
	postcode: number,
	country: string
}

export type LogedInUser = {
	role: string
  _id: Types.ObjectId
  name: string
  email: string
  phone: string
	location: Location
  createdAt: Date
  updatedAt: Date
}



export type UserDocument = Document & {
	_id: Types.ObjectId
	createdAt: Date
	updatedAt: Date

	name: string
	slug: string
	email: string
	password: string
	confirmPassword?: string
	avatar: Image
	clientId: string 							// social media login 
	role: string
	isActive: boolean
	isVerified: boolean
	passwordResetToken?: string

	phone: string
	location: Location,
	gender: 'male' | 'female' | 'other' | 'undefined'

	comparePassword: (password: string) => Promise<boolean>
	getPasswordResetToken: () => Promise<string>

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
	}

	likes: Types.ObjectId[]
}
// export type UserDocument = {
// 	_id: Types.ObjectId
// 	createdAt: Date
// 	updatedAt: Date

// 	name: string
// 	email: string
// 	password: string
// 	confirmPassword?: string
// 	avatar: Image
// 	clientId: string 							// social media login 
// 	role: string

// 	// title: string
// 	// about: string
// 	// skills: string[]
// 	// infoItems: Info[],
// 	// experiences: Experience[]
// }

export type CreateUser = {
	name: string
	email: string
	username: string
	password: string
	confirmPassword: string
	avatar: string
	role: string
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
	}
}

export type UpdateUser = {
	name: string
	email: string
	avatar: string
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
	}
}
// type SignUpInput = {
// 	name: string
// 	email: string
// 	password: string
// 	confirmPassword: string
// }

// type LoginInput = {
// 	email: string
// 	password: string
// }

// type UpdateMeInput = {
// 	userId: String
// 	name: string
// }


// export type GetUserArgs = {
// 	userId: string
// }
// export type SignUpArgs = {
// 	input: SignUpInput
// }
// export type LoginArgs = {
// 	input: LoginInput
// }

// export type UpdateMeArgs = {
// 	input: UpdateMeInput
// }
// export type DeleteMeArgs = {
// 	userId: string
// }