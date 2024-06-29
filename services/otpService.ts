import crypto from 'crypto'


// const { SMS_SID='', SMS_SECRET='', SMS_FROM_NUMBER } = process.env
// const twilio = require('twilio')(SMS_SID, SMS_SECRET, { })

export const generateOTP = async () => {
	return crypto.randomInt(1000, 9999)
}

export const sendSMS = async (phone: string, otp: number) => {
	// return await twilio.messages.create({
	// 	to: phone,
	// 	from: SMS_FROM_NUMBER,
	// 	body: `your coderhouse otp: ${otp}`
	// })

	console.log({ phone, otp })
}
