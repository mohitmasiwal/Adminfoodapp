 // redux/ordersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDatabase, ref, get } from "firebase/database";

export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (uid) => {
    const db = getDatabase();
    const snapshot = await get(ref(db, "orders"));

    const allOrders = snapshot.val() || {};
    const userOrders = {};

    Object.entries(allOrders).forEach(([orderId, order]) => {
      if (order.uid === uid) {
        userOrders[orderId] = order;
      }
    });

    return userOrders;
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    userOrders: {},
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default ordersSlice.reducer;
