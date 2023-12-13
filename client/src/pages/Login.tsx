import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store";
import { login } from "../store/reducers/auth.reducer";

const Login = () => {
	const navigation = useNavigate();
	const dispatch = useAppDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [form, setForm] = useState({
		email: "",
		password: "",
	});

	const handleLogin = () => {
		setIsLoading(true);
		if (form.email && form.password) {
			axios({
				url: `http://localhost:3000/login`,
				method: "POST",
				headers: {
					"Content-Type": "application/json; charset=UTF-8",
					Accept: "application/json",
				},
				data: JSON.stringify({
					email: form.email,
					password: form.password,
				}),
			})
				.then((res) => {
					console.log(res.data.body.token);
					if (res.data.meta.status) {
						axios({
							url: `http://localhost:3000/whoami`,
							method: "GET",
							headers: {
								"Content-Type": "application/json; charset=UTF-8",
								Accept: "application/json",
								Authorization: `Bearer ${res.data.body.token}`,
							},
						})
							.then((resWhoAmI) => {
								if (resWhoAmI.data.meta.status) {
									alert("Welcome");
									localStorage.setItem("token", res.data.body.token);
									dispatch(
										login({
											checked: true,
											authorized: true,
											user: {
												id: parseInt(resWhoAmI.data.body.id, 10) || 0,
												name: resWhoAmI.data.body.username,
												email: resWhoAmI.data.body.email,
											},
										})
									);
                  navigation("/dashboard")
								} else {
									alert("Unauthorized");
								}
							})
							.catch((errWhoAMI) => {
								console.log(errWhoAMI);
								alert("Unauthorized");
							});
					} else {
						alert("Unauthorized");
					}
				})
				.catch((err) => {
					console.log(err);
					alert("Unauthorized");
				});
		} else {
			alert("Please fill required information");
		}
		setIsLoading(false);
	};

	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<div className="border border-gray-700 rounded-md p-4">
				<h3 className="text-4xl font-extrabold text-gray-700 mb-4">
					Welcome User
				</h3>
				<div className="w-full flex flex-col mb-4">
					<input
						type="text"
						placeholder="Email"
						className="w-96 border border-gray-700 rounded-md p-2 mb-2"
						value={form.email}
						onChange={(e) => setForm({ ...form, email: e.target.value })}
					/>
					<input
						type="password"
						placeholder="Password"
						className="w-96 border border-gray-700 rounded-md p-2 mb-2"
						value={form.password}
						onChange={(e) => setForm({ ...form, password: e.target.value })}
					/>
				</div>

				<div className="w-full flex justify-between items-center">
					<button
						disabled={isLoading}
						className="bg-gray-700 disabled:bg-gray-300 rounded-md w-44 py-2 text-white"
						onClick={() => handleLogin()}
					>
						{isLoading ? "Loading..." : "Login"}
					</button>
					<Link
						to="/register"
						className="text-blue-700 hover:underline font-semibold text-sm"
					>
						Register Here
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
