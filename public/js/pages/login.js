import { showError, redirectTo, } from '/js/module/utils.js'

const form = document.querySelector('[name=local-login]')
form.addEventListener('submit', async (evt) => {
	evt.preventDefault()

	const formData = new FormData(evt.target)
	const fields = Object.fromEntries(formData)
	console.log(fields)

	try {
		const res = await fetch('/api/auth/login', {
			method: 'POST',
			body: JSON.stringify(fields),
			headers: {
				'content-type': 'application/json',
				'accept': 'application/json',
			}
		})
		if( !res.ok ) throw await res.json()

		const data = await res.json()
		redirectTo('/')
		console.log(data)

	} catch (err) {
		showError(err.message)
		console.log(err)
	}

	//- if(res.redirected) 
	//- location.href = '/'

})