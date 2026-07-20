import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      const payload = action.payload || {};
      const userData = payload.user || payload;

      state.user = userData;
      state.token = payload.token || payload.accessToken || userData?.token || null;

      if (state.token) {
        localStorage.setItem("token", state.token);
      } else {
        localStorage.removeItem("token");
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    }
  }
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;