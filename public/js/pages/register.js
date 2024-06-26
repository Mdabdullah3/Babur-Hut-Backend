import { $, readAsDataURL, showError, redirectTo } from '/js/module/utils.js'


const form = $('form')



const sendRegisterRequest = async (fields) => {
	try {
		const res = await fetch('/api/auth/register', {
			method: 'POST',
			body: JSON.stringify(fields),
			headers: {
				'content-type': 'application/json',
				'accept': 'application/json',
			}
		})
		if( !res.ok ) throw await res.json()

		const data = await res.json()
		console.log(data)
		redirectTo('/login')

	} catch( err ) {
		console.log(err)
		showError(err.message)
	}

}

form.addEventListener('submit', async (evt) => {
	evt.preventDefault()

	const formData = new FormData(evt.target)
	const fields = Object.fromEntries( formData )

	fields.avatar = await readAsDataURL(fields.avatar)
	sendRegisterRequest(fields)
})
