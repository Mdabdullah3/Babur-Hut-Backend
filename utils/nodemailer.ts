import { createTransport } from 'nodemailer'

/*
	try {

		await sendMail({
			from: 'robitops10@gmail.com',
			to: 'your_target_user@gmail.com',
			subject: 'Testing | sending OTP via email',
			text: `otp: ${otp}`
		})

	} catch (err) {
		...
	}
*/

export const sendMail = async ({
	from='<robitops10@gmail.com>',  											// from the application
	to='',  																							// to sender email
	subject='password-reset(only valid for 10 minutes)',  //
	text='default message' 																//
} = {}) => {


	const host = process.env.MAIL_HOST!
	const port = parseInt(process.env.MAIL_PORT!)
	const user = process.env.MAIL_USER!
	const pass = process.env.MAIL_PASS!

	if(!host || !port || !user || !pass) throw new Error(`hey!, nodemailer missing credentials`)

	const transporter = createTransport({
		// service: 'Gmail',
		host,
		port,
		auth: { user, pass }
	})

	await transporter.sendMail({from, to, subject, text})
}







/*

import nodemailer, { Transporter } from 'nodemailer';

// Create a transporter
const transporter: Transporter = nodemailer.createTransport({
	host: 'your-smtp-host.com', // Replace with your SMTP server hostname
	port: 587, // Replace with the appropriate port (e.g., 587 for TLS)
	auth: {
		user: 'your@gmail.com',
		pass: 'your-password'
	}
});

// Example email configuration
const mailOptions = {
	from: 'robitops10@gmail.com',
	to: 'recipient@example.com',
	subject: 'Hello from Nodemailer',
	text: 'This is a test email sent via Nodemailer in TypeScript!'
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error sending email:', error);
    } else {
        console.log('Email sent:', info.response);
    }
});



type Payload = {
	from: string
	to: string
	subject: string
	text: string

}
export const sendMail = async (payload: Payload) => {
	const {
		from='<robitops10@gmail.com>', 
		to='', 
		subject='password-reset(only valid for 10 minutes)',
		text='default message'
	} = payload

	const {
		MAIL_HOST,
		MAIL_PORT,
		MAIL_USER,
		MAIL_PASS,
	} = process.env

	if(!MAIL_PORT) return

	const transporter: Transporter = nodemailer.createTransport({
		host: MAIL_HOST,
		port: parseInt(MAIL_PORT),
		auth: {
			user: MAIL_USER,
			pass: MAIL_PASS,
		}
	})

	// const transporter: Transporter = nodemailer.createTransport({
	// 	// service: 'Gmail',
	// 	host: '',
	// 	port: process.env.MAIL_PORT,
	// 	auth: {
	// 		user: process.env.MAIL_USER,
	// 		pass: process.env.MAIL_PASS,
	// 	},
	// })

	await transporter.sendMail({from, to, subject, text})
}
*/