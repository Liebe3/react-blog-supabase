import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { AuthState, User } from "../../services/types/auth.types";

import {
  checkSessionThunk,
  loginThunk,
  logoutThunk,
  registerThunk,
} from "../../thunks/authThunks";

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // Check Session
    builder.addCase(checkSessionThunk.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      checkSessionThunk.fulfilled,
      (state, action: PayloadAction<User | null>) => {
        state.user = action.payload;
        state.loading = false;
      }
    );

    builder.addCase(checkSessionThunk.rejected, (state) => {
      state.user = null;
      state.loading = false;
    });

    // Register
    builder.addCase(registerThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      registerThunk.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.loading = false;
      }
    );

    builder.addCase(registerThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Registration failed";
    });

    // login
    builder.addCase(loginThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      loginThunk.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.loading = false;
      }
    );

    builder.addCase(loginThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Login failed";
    });

    // logout
    builder.addCase(logoutThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.user = null;
      state.loading = false;
    });

    builder.addCase(logoutThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Logout failed";
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
