
import { Types, Document } from 'mongoose'

type Image = {
	public_id: string
	secure_url: string
}


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


type OtherPermissions = {
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

	isHasDashboard: boolean
	isHasBanner: boolean
	isHasPropUpAdds: boolean
}


export type UserDocument = Document & {
	_id: Types.ObjectId
	createdAt: Date
	updatedAt: Date

	customId: string
	name: string
	slug: string
	email: string
	password: string
	confirmPassword?: string
	coverPhoto: Image
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

	emailResetToken: string | undefined
	emailResetTokenExpires: Date | undefined
	createEmailResetToken: () => Promise<string>
	handleEmailUpdate: (resetToken: string, email: string) => Promise<boolean>

	otherPermissions : OtherPermissions

	likes: Types.ObjectId[]
	orders: Types.ObjectId[]

	idCardFrontPageImage: Image
	idCardBackPageImage: Image
	bankStatementImage: Image
	idCardNumber: string
	accountHolderName: string
	accountNumber: string
	routingNumber: string
	bankName: string
	bankBranch: string

	status: string
}



export type CreateUser = {
	customId: string
	name: string
	email: string
	username: string
	password: string
	confirmPassword: string
	coverPhoto: string
	avatar: string
	role: string

	otherPermissions : OtherPermissions

	idCardFrontPageImage: Image
	idCardBackPageImage: Image
	bankStatementImage: Image
	idCardNumber: string
	accountHolderName: string
	accountNumber: string
	routingNumber: string
	bankName: string
	bankBranch: string

	status: string
}

export type UpdateUser = {
	customId: string
	name: string
	email: string
	coverPhoto: string
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

	idCardFrontPageImage: Image
	idCardBackPageImage: Image
	bankStatementImage: Image
	idCardNumber: string
	accountHolderName: string
	accountNumber: string
	routingNumber: string
	bankName: string
	bankBranch: string

	status: string
}