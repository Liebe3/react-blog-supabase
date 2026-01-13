import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../services/supabase";

import type { LoginCredentials, RegisterCredentials, User } from "../services/types/auth.types";

// Register Thunk
export const registerThunk = createAsyncThunk<
	User,
	RegisterCredentials,
	{ rejectValue: string }> ("auth/register",
		async ({email, password, confirmPassword}, {rejectWithValue}) => {

			if(password !== confirmPassword){
				return rejectWithValue("Passwords do not match")
			}
			
			const {data, error } = await supabase.auth.signUp({email, password})

			if(error){
				return rejectWithValue(error.message)
			}

			if(!data.user || !data.user.email){
				return rejectWithValue("Registration failed")
			}

			return{
				id: data.user.id,
				email: data.user.email!
			}

		}
	);

	// Login Thunk
export const loginThunk = createAsyncThunk<
	User,
	LoginCredentials,
	{	 rejectValue: string }> ("auth/login",
		async ({email, password}, {rejectWithValue}) => {
			const {data, error } = await supabase.auth.signInWithPassword({email, password})

			if(error){
				return rejectWithValue(error.message)
			}

			if(!data.user || !data.user.email){
				return rejectWithValue("No user found")
			}

			// "!" non null operator
			return{
				id: data.user.id,
				email: data.user.email!
			}
		}
)

// Logout Thunk
export const logoutThunk = createAsyncThunk<void, void, {rejectValue: string}>("auth/logout",
	async (_, {rejectWithValue}) => {

		const {error} = await supabase.auth.signOut()

		if(error){
			return rejectWithValue(error.message)
		}
	}
)