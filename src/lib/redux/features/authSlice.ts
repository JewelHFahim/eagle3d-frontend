import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "admin" | "user";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.initialized = true;
    },
    resetAuth(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.initialized = true;
    },
  },
});

export const { setUser, resetAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
