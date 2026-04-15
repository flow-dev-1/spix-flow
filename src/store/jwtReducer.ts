import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null as string | null,
    otpModal: false,
  },
  reducers: {
    setToken: (state, action) => { state.token = action.payload; },
    clearToken: (state) => { state.token = null; },
    otpSuccess: (state) => { state.otpModal = false; },
    closeOtpSuccess: (state) => { state.otpModal = false; },
  },
});

export const { otpSuccess, closeOtpSuccess, setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
