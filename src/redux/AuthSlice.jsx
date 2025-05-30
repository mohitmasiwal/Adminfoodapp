 import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uid: null,
  role: null,        
  loading: false,
  error: null,
    displayName: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.uid = action.payload.uid;
      state.role = action.payload.role;   
      state.loading = false;
      state.error = null;
       state.displayName = action.payload.displayName;
      
    },
    logout(state) {
      state.uid = null;
      state.role = null;                
      state.loading = false;
      state.error = null;
       state.displayName = null;
    },
    updateDisplayName: (state, action) => {
  state.displayName = action.payload;
},

    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { login, logout, setLoading, setError,updateDisplayName  } = authSlice.actions;
export default authSlice.reducer;
