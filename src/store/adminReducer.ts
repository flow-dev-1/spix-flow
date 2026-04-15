import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    isAdmin: null as boolean | null,
    code: null as string | null,
  },
  reducers: {
    setCode: (state, action) => { state.isAdmin = true; state.code = action.payload; },
    clearCode: (state) => { state.isAdmin = null; state.code = null; },
  },
});

export const { setCode, clearCode } = adminSlice.actions;
export default adminSlice.reducer;

export const adminData = (state: any) => state.admin;
