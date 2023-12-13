import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

const users = [
	{
		id: 1,
		username: "Test",
		email: "test@gmail.com",
		password: "test",
	},
];

const secret = "my-very-secure-secret";

// auth middleware
const VerifyAuth = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if (authHeader) {
		const token = authHeader.split(" ")[1];

		jwt.verify(token, secret, (err, user: any) => {
			if (err) {
				res.status(401).json({
					meta: {
						status: false,
						message: "Unauthorized",
					},
				});
			}
			req.params.userId = user.id;
			next();
		});
	} else {
		res.status(401).json({
			meta: {
				status: false,
				message: "Unauthorized",
			},
		});
	}
};

const PORT = 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.status(200).json({
		meta: {
			status: true,
			message: "Hello World",
		},
	});
});

app.post("/login", (req, res) => {
	const { email, password } = req.body;

	const existingUser = users.filter((user) => user.email === email);
	if (existingUser.length > 0) {
		if (existingUser[0].password === password) {
			const token = jwt.sign(
				{
					id: existingUser[0].id,
				},
				secret,
				{
					expiresIn: "7d",
				}
			);
			res.status(200).json({
				meta: {
					status: true,
					message: "Authorized",
				},
				body: {
					token,
				},
			});
		} else {
			res.status(401).json({
				meta: {
					status: false,
					message: "Unauthorized",
				},
			});
		}
	} else {
		res.status(404).json({
			meta: {
				status: false,
				message: "User Not Found",
			},
		});
	}
});

app.post("/register", (req, res) => {
	const { username, email, password } = req.body;
	if (username && email && password) {
		if (users.filter((user) => user.email === email).length > 0) {
			res.status(403).json({
				meta: {
					status: false,
					message: "Email already exist",
				},
			});
		} else {
			users.push({
				id: users.length + 1,
				username,
				email,
				password,
			});
			res.status(201).json({
				meta: {
					status: true,
					message: `Welcome ${username}, you can login now.`,
				},
			});
		}
	} else {
		res.status(403).json({
			meta: {
				status: false,
				message: "Required entities",
			},
		});
	}
});

app.get("/whoami", VerifyAuth, (req, res) => {
	const userId = req.params.userId;
	const existingUser = users.filter(
		(user) => user.id.toString() === userId.toString()
	);
	if (existingUser.length > 0) {
		res.status(200).json({
			meta: {
				status: true,
				message: "Welcome",
			},
			body: existingUser[0],
		});
	} else {
		res.status(404).json({
			meta: {
				status: false,
				message: "User Not Found",
			},
		});
	}
});

app.listen(PORT, () => {
	console.log(`Server is listening on http://localhost:${PORT}`);
});
