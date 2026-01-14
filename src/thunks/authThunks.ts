import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../services/supabase";

import type {
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../services/types/auth.types";

// Register Thunk
export const registerThunk = createAsyncThunk<
  User,
  RegisterCredentials,
  { rejectValue: string }
>(
  "auth/register",
  async (
    { email, password, confirmPassword, profile },
    { rejectWithValue }
  ) => {
    if (password !== confirmPassword) {
      return rejectWithValue("Passwords do not match");
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error("Supabase signup error:", error);
      return rejectWithValue(error.message);
    }

    if (!data.user || !data.user.email) {
      return rejectWithValue("Registration failed");
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
      })
      .select();

    if (profileError) {
      return rejectWithValue(profileError.message);
    }

    return {
      id: data.user.id,
      email: data.user.email!,
      profile: profileData[0],
    };
  }
);

// Login Thunk
export const loginThunk = createAsyncThunk<
  User,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return rejectWithValue(error.message);
  }

  if (!data.user || !data.user.email) {
    return rejectWithValue("No user found");
  }

  // "!" non null operator
  return {
    id: data.user.id,
    email: data.user.email!,
  };
});

// Logout Thunk
export const logoutThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/logout", async (_, { rejectWithValue }) => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return rejectWithValue(error.message);
  }
});
