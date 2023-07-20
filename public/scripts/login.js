const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;

	const user = {
		username,
		password
	};
	fetch('/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(user)
	})
		.then((resp) => {
			if (!resp.ok) {
				throw new Error('invalid login or password');
			}
			return resp.json();
		})
		.then((data) => {
			localStorage.setItem('token', data);
			localStorage.setItem('name', username);
			window.location.href = "users_table"
		
		})
		.catch((err) => {
			alert(err);
		});

	loginForm.reset();

});
