import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import User from '../db/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const secretKey = 'your-secret-key';
function generateToken(username, id) {
	const payloadData = {
		id,
		username
	};
	return jwt.sign(payloadData, secretKey, { expiresIn: '1h' });
}

const app = express();

app.use(express.static(path.resolve('./public/css')));
app.use(express.static(path.resolve('./public/scripts')));

app.use(express.json());

app.get('/', (req, res) => {
	res.sendFile(path.resolve('./front/log_reg.html'));
});

app.get('/login', (req, res) => {
	res.sendFile(path.resolve('./front/login.html'));
});

app.get('/register', (req, res) => {
	res.sendFile(path.resolve('./front/registration.html'));
});

app.post('/registration', async (req, res) => {
	try {
		const { username, password } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = User({
			username,
			password: hashedPassword
		});
		await newUser.save();
		res.status(201).json('success');
	} catch (error) {
		res.status(500).json('Username is not available');
	}
});

app.post('/login', async (req, res) => {
	try {
		const { username, password } = req.body;
		const validUser = await User.findOne({ username });

		if (!validUser) {
			return res.status(401).json({ message: 'Invalid user' });
		}
		const validPassword = await bcrypt.compare(password, validUser.password);
		if (!validPassword) {
			return res.status(401).json({ message: 'Invalid password' });
		}
		const token = generateToken(username, User._id);
		res.json(token);
	} catch (error) {
		res.status(500).json({ message: 'server error' });
	}
});

//protceted mod

const authenticateToken = (req, res, next) => {
	const token = req.header('Authorization');
	if (!token) {
		return res.status(401).json({ message: 'Access denied. Token missing.' });
	}

	jwt.verify(token, secretKey, (err, user) => {
		if (err) {
			return res.status(403).json({ message: 'Invalid token' });
		}
		req.user = user;
		next();
	});
};

app.get('/get_users', authenticateToken, async (req, res) => {
	try {
		const users = await User.find({}, 'username password');
		res.json(users);
	} catch (error) {
		console.error('Error retrieving users:', error);
		res.status(500).json({ message: 'Server error' });
	}
});

app.get('/users_table', async (req, res) => {
	res.sendFile(path.resolve('./front/users.html'));
});

mongoose
	.connect('mongodb+srv://armanmikoyan2:12345@cluster0.dzwvfie.mongodb.net/')
	.then(() => {
		console.log('connected db');
	})
	.catch((e) => {
		console.log(e);
	});

app.listen(process.env.PORT || 3000, () => {
	console.log('listenning 3000 port');
});
