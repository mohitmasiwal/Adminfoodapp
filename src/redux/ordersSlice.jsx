 import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDatabase, ref, onValue, update } from "firebase/database";

// Fetch all orders (admin)
export const fetchAllOrders = createAsyncThunk("orders/fetchAll", async () => {
  const db = getDatabase();
  const ordersRef = ref(db, "orders");

  return new Promise((resolve) => {
    onValue(
      ordersRef,
      (snapshot) => {
        const data = snapshot.val() || {};
        const ordersArray = [];

        for (const uid in data) {
          for (const orderId in data[uid]) {
            ordersArray.push({
              uid,
              orderId,
              ...data[uid][orderId],
            });
          }
        }

        resolve(ordersArray);
      },
      { onlyOnce: true }
    );
  });
});

// Fetch orders of a single user by UID (user page)
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (uid) => {
    const db = getDatabase();
    const userOrdersRef = ref(db, `orders/${uid}`);

    return new Promise((resolve) => {
      onValue(
        userOrdersRef,
        (snapshot) => {
          const data = snapshot.val() || {};
          const ordersArray = [];

          for (const orderId in data) {
            ordersArray.push({
              uid,
              orderId,
              ...data[orderId],
            });
          }

          resolve(ordersArray);
        },
        { onlyOnce: true }
      );
    });
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ uid, orderId, status }) => {
    const db = getDatabase();
    const orderRef = ref(db, `orders/${uid}/${orderId}`);
    await update(orderRef, { status });
    return { uid, orderId, status };
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    allOrders: [],
    userOrders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchAllOrders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // fetchUserOrders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // updateOrderStatus
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { uid, orderId, status } = action.payload;

        // Update in allOrders
        const allOrder = state.allOrders.find(
          (o) => o.uid === uid && o.orderId === orderId
        );
        if (allOrder) allOrder.status = status;

        // Update in userOrders
        const userOrder = state.userOrders.find(
          (o) => o.uid === uid && o.orderId === orderId
        );
        if (userOrder) userOrder.status = status;
      });
  },
});

export default ordersSlice.reducer;
