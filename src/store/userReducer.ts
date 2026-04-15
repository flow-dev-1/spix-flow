import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null as any,
    userType: null as string | null,
    otpModal: false,
    connections: [] as any[],
    isSidebarOpen: false,
  },
  reducers: {
    loginData: (state, action) => { state.userType = action.payload; },
    CloseOtpSuccess: (state) => { state.otpModal = false; },
    loginSuccess: (state, action) => { state.user = action.payload; },
    logoutSuccess: (state) => { state.user = null; state.connections = []; },
    connections: (state, action) => { state.connections = action.payload; },
    toggleSidebar: (state) => { state.isSidebarOpen = !state.isSidebarOpen; },
  },
});

export const { loginSuccess, logoutSuccess, loginData, CloseOtpSuccess, toggleSidebar, connections } = userSlice.actions;
export default userSlice.reducer;
