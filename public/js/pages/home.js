import { showError, redirectTo, } from '/js/module/utils.js'

const button = document.querySelector('[name=logout]')
button.addEventListener('click', async (evt) => {
	evt.preventDefault()

	try {
		const res = await fetch('/api/auth/logout', { method: 'POST' })
		//- if(!res.ok) throw new Error('logout filed')
		if(!res.ok) throw await res.json()

		const data = await res.json()
		console.log(data)
		redirectTo('/login')

	} catch (err) {
		showError(err.message)
		console.log(err)
	}
})
