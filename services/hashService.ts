import crypto from 'crypto'
import { appError } from '../controllers/errorController'
import dotenv from 'dotenv'
dotenv.config()

const otpSecret = process.env.OTP_SECRET 

export const hashOTP = async (data: string) => {
	if(!otpSecret) throw appError(`otpSecret: ${otpSecret} error`, 400, 'EnvError')

	return crypto.createHmac('sha256', otpSecret).update(data).digest('base64')
}


export const validateOTP = async (data: string, hash: string) => {
	if(!otpSecret) throw appError(`otpSecret: ${otpSecret} error`, 400, 'EnvError')

	const currentHash = crypto.createHmac('sha256', otpSecret).update(data).digest('base64')
	return currentHash === hash
}
