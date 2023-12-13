import { useRoutes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect } from "react";
import Loading from "./pages/Loading";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "./store";
import { login, logout } from "./store/reducers/auth.reducer";

const Router = () => {
	const dispatch = useAppDispatch();
	const { checked, authorized } = useAppSelector((state) => state.auth.value);

	const token = localStorage.getItem("token");

	const handleAuthCheck = (accessToken: string) => {
		axios({
			url: `http://localhost:3000/whoami`,
			method: "GET",
			headers: {
				"Content-Type": "application/json; charset=UTF-8",
				Accept: "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		})
			.then((res) => {
				if (res.data.meta.status) {
					dispatch(
						login({
							checked: true,
							authorized: true,
							user: {
								id: parseInt(res.data.body.id, 10) || 0,
								name: res.data.body.username,
								email: res.data.body.email,
							},
						})
					);
				} else {
					dispatch(logout());
				}
			})
			.catch((err) => {
				console.log(err);
				dispatch(logout());
			});
	};

	useEffect(() => {
		if (token) {
			handleAuthCheck(token);
		} else {
			dispatch(logout());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token]);

	return (
		<>
			{!checked ? (
				<Loading />
			) : checked && authorized ? (
				<AuthRouter />
			) : (
				<GuestRouter />
			)}
		</>
	);
};

const AuthRouter = () => {
	return useRoutes([
		{
			path: "/",
			element: <Navigate to="dashboard" replace />,
		},
		{
			path: "dashboard",
			element: <Dashboard />,
		},
		{
			path: "*",
			element: <Navigate to="/" replace />,
		},
	]);
};

const GuestRouter = () => {
	return useRoutes([
		{
			path: "/",
			element: <Navigate to="login" replace />,
		},
		{
			path: "login",
			element: <Login />,
		},
		{
			path: "register",
			element: <Register />,
		},
		{
			path: "*",
			element: <Navigate to="/" replace />,
		},
	]);
};

export default Router;
