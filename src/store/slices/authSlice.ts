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
    builder
      .addCase(checkSessionThunk.pending, (state) => {
        state.loading = true;
      })

      .addCase(
        checkSessionThunk.fulfilled,
        (state, action: PayloadAction<User | null>) => {
          state.user = action.payload;
          state.loading = false;
        }
      )

      .addCase(checkSessionThunk.rejected, (state) => {
        state.user = null;
        state.loading = false;
      })

      // Register
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(registerThunk.fulfilled, (state) => {
        state.user = null
        state.loading = false;
      })

      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })

      // login
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.loading = false;
      })

      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      // logout
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
      })

      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
