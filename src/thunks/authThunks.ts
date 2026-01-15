import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../services/supabase";

import type {
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../services/types/auth.types";

//  Session Thunk
export const checkSessionThunk = createAsyncThunk<
  User | null,
  void,
  { rejectValue: string }
>("auth/checkSession", async (_, { rejectWithValue }) => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      return rejectWithValue(error.message);
    }

    if (!session || !session.user) {
      return null;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (profileError) return rejectWithValue(profileError.message);

    return {
      id: session.user.id,
      email: session.user.email!,
      profile: profileData,
    };
  } catch (error) {
    return rejectWithValue("Session check failed");
  }
});

// Register Thunk
export const registerThunk = createAsyncThunk<
  void, // no user returned
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

    if (error) return rejectWithValue(error.message);
    if (!data.user || !data.user.email)
      return rejectWithValue("Registration failed");

    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
    });

    if (profileError) return rejectWithValue(profileError.message);

    // Force sign out
    await supabase.auth.signOut();

    return;
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

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError) return rejectWithValue(profileError.message);

  // "!" non null operator
  return {
    id: data.user.id,
    email: data.user.email!,
    profile: profileData,
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
