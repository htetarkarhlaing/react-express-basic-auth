import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
	const navigation = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [form, setForm] = useState({
    username: "",
		email: "",
		password: "",
	});

	const handleRegister = () => {
		setIsLoading(true);
		if (form.email && form.password && form.username) {
			axios({
				url: `http://localhost:3000/register`,
				method: "POST",
				headers: {
					"Content-Type": "application/json; charset=UTF-8",
					Accept: "application/json",
				},
				data: JSON.stringify({
          username: form.username,
					email: form.email,
					password: form.password,
				}),
			})
				.then((res) => {
					if(res.data.meta.status) {
            alert("You can login now");
            navigation("/login")
          }
          else {
            alert("Email already exist");
          }
				})
				.catch((err) => {
					console.log(err);
					alert("User is not allowed to register.");
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
					Register
				</h3>
				<div className="w-full flex flex-col mb-4">
        <input
						type="text"
						placeholder="Username"
						className="w-96 border border-gray-700 rounded-md p-2 mb-2"
						value={form.username}
						onChange={(e) => setForm({ ...form, username: e.target.value })}
					/>
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
						onClick={() => handleRegister()}
					>
						{isLoading ? "Loading..." : "Submit"}
					</button>
					<Link
						to="/login"
						className="text-blue-700 hover:underline font-semibold text-sm"
					>
						Login Here
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Register;
