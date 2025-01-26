import crypto from 'crypto'
import axios from 'axios'

// const { SMS_SID='', SMS_SECRET='', SMS_FROM_NUMBER } = process.env
// const twilio = require('twilio')(SMS_SID, SMS_SECRET, { })


export const generateOTP = async () => {
	return crypto.randomInt(1000, 9999)
}

export const sendSMS = async (phone: string, otp: number) => {
	const OTP_SECRET = process.env.OTP_SECRET
	if(!OTP_SECRET) throw new Error(`OTP_SECRET Error: ${OTP_SECRET}`)

  try {
    const { data } = await axios.post( 'https://api.sms.net.bd/sendsms', { 
			api_key: OTP_SECRET,
			msg: `Your Ready How OTP Code is ${otp}`,
			to: phone 
		});

		return data

  } catch (error) {
   	return error
	}
}



// export const sendSMS = async (phone: string, otp: number) => {
// 	return await twilio.messages.create({
// 		to: phone,
// 		from: SMS_FROM_NUMBER,
// 		body: `your coderhouse otp: ${otp}`
// 	})

// 	const body = `Your baburhaatbd OTP Code is ${otp}`
// 	body
// }



