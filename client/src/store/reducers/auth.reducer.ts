import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IAuthPayload {
	checked: boolean;
	authorized: boolean;
	user: {
		id: number;
		name: string;
		email: string;
	};
}

interface IAuthState {
	value: IAuthPayload;
}

const initialState: IAuthState = {
	value: {
		checked: false,
		authorized: false,
		user: {
			id: 0,
			name: "",
			email: "",
		},
	},
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login: (state, action: PayloadAction<IAuthPayload>) => {
			const { user, checked, authorized } = action.payload;
			state.value = {
				checked,
				authorized,
				user: user,
			};
		},
		logout: (state) => {
			state.value = {
				user: {
					id: 0,
					name: "",
					email: "",
				},
				checked: true,
				authorized: false,
			};
		},
	},
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
