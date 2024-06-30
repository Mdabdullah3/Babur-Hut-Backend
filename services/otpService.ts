import crypto from 'crypto'
// import type { Request } from 'express'
// import { sendMail } from '../utils/nodemailer'


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


// export const sendOtpMail = async (req: Request, email: string) => {
//   // send resetToken via email.
//   let text = 'Please copy/paste the bellow url to reset the password: \n'
//       text += `${req.protocol}://${req.get('host')}/api/users/reset-password/${resetToken}`
//   await sendMail({ to: email, text })   // from, to, subject, text
// }
