
  



const registrationForm = document.getElementById('registrationForm');
registrationForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;
	const newUser = {
		username,
		password
	};

	fetch('/registration', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(newUser)
	})
		.then((resp) => {
			return resp.json();
		})
		.then((data) => {
			alert(data)
		}).catch((err)=>{
			alert(err)
		})
		
	registrationForm.reset();
	window.location.href = "login"
})
