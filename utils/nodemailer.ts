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
	from='baburhaat24@gmail.com',  										// from the application
	to='',  																							// to sender email
	subject='(only valid for 10 minutes)',  //
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

// host: "smtp.gmail.com",
// port: 587,
// auth: {
// 	user: "baburhaat24@gmail.com",
// 	pass: "rmyh bgpd qyej whzu",
// },

// const sendEmail = async (to, subject, text) => {
//   const msg = { from: "baburhaat24@gmail.com", to, subject, text };
//   await transport.sendMail(msg);
// };

