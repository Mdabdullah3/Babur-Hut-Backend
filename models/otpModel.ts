import type { Model } from 'mongoose'
import { Schema, models, model } from 'mongoose'

type OTPDocument = {
	phone: string,
	isVerified: boolean
}

/*
{
	"phone": "+8801957500605"
}
*/

const otpSchema = new Schema<OTPDocument>({
	phone: { 								// Review message
		type: String,
		required: true,
		trim: true,
		unique: true,
		maxLength: 15,
		minLength: 5
	},
	isVerified: {
		type: Boolean,
		default: false
	}
})


export const OtpModel: Model<OTPDocument> = models.Review || model<OTPDocument>('Otp', otpSchema)
export default OtpModel

