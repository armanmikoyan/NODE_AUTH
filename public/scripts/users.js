fetch('/get_users', {
	headers: {
		Authorization: localStorage.getItem('token'), // Replace this with the actual token
		'Content-Type': 'application/json'
	}
})
	.then((resp) => resp.json())
	.then((data) => {
		const userTableBody = document.getElementById('userTableBody');
		data.forEach((user) => {
			const row = document.createElement('tr');
			const usernameCell = document.createElement('td');
			usernameCell.textContent = user.username;
			const passwordCell = document.createElement('td');
			passwordCell.textContent = user.password;
			row.appendChild(usernameCell);
			row.appendChild(passwordCell);
			userTableBody.appendChild(row);
			createUserWindow(localStorage.getItem('name'));
		});
	})
	.catch((err) => {
		console.error('Error retrieving users:', err);
	});

function createUserWindow(user) {
	const header = document.querySelector('.header');
	header.innerHTML = '';
	const userWindow = document.createElement('div');
	userWindow.classList.add('user-window');

	const welcomeMessage = document.createElement('p');
	welcomeMessage.textContent = `Welcome, ${user}!`;

	const logoutButton = document.createElement('button');
	logoutButton.textContent = 'Logout';
	logoutButton.addEventListener('click', handleLogout);
	userWindow.appendChild(welcomeMessage);
	userWindow.appendChild(logoutButton);
	header.appendChild(userWindow);
}

function handleLogout() {
	localStorage.removeItem('token')
	localStorage.removeItem('name')
	window.location.href = "login"
}
