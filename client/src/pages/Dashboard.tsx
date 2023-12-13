import { useAppDispatch, useAppSelector } from "../store";
import { logout } from "../store/reducers/auth.reducer";

const Dashboard = () => {
	const { user } = useAppSelector((state) => state.auth.value);

	const dispatch = useAppDispatch();

	const handleLogout = () => {
		dispatch(logout());
		localStorage.clear();
	};

	return (
		<div className="w-screen h-screen bg-gray-800 flex items-center justify-center">
			<div className="space-y-3">
				<h1 className="text-5xl text-white font-semibold">Dashboard</h1>
				<pre className=" font-serif text-white text-lg cursor-pointer">
					{JSON.stringify(user)}
				</pre>
				<button
					className="bg-red-700 disabled:bg-gray-300 rounded-md w-44 py-2 text-white"
					onClick={() => handleLogout()}
				>
					Logout
				</button>
			</div>
		</div>
	);
};

export default Dashboard;
