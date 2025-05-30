 import { createSlice } from "@reduxjs/toolkit";
import { getDatabase, ref, set, remove, update } from "firebase/database";
import { auth } from "../firebase/Firebase";

const initialState = {
  items: {},
  orders: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action) {
      state.items = action.payload;
    },
    addToCart(state, action) {
      const { id, item } = action.payload;
      if (state.items[id]) {
        state.items[id].quantity += 1;
      } else {
        state.items[id] = { item, quantity: 1 };
      }

      const uid = auth.currentUser?.uid;
      if (uid) {
        const db = getDatabase();
        set(ref(db, `carts/${uid}/${id}`), state.items[id]);
      }
    },
    removeFromCart(state, action) {
      const id = action.payload;
      delete state.items[id];

      const uid = auth.currentUser?.uid;
      if (uid) {
        const db = getDatabase();
        remove(ref(db, `carts/${uid}/${id}`));
      }
    },
    increaseQuantity(state, action) {
      const id = action.payload;
      state.items[id].quantity += 1;

      const uid = auth.currentUser?.uid;
      if (uid) {
        const db = getDatabase();
        update(ref(db, `carts/${uid}/${id}`), { quantity: state.items[id].quantity });
      }
    },
    decreaseQuantity(state, action) {
      const id = action.payload;
      if (state.items[id].quantity > 1) {
        state.items[id].quantity -= 1;

        const uid = auth.currentUser?.uid;
        if (uid) {
          const db = getDatabase();
          update(ref(db, `carts/${uid}/${id}`), { quantity: state.items[id].quantity });
        }
      } else {
        delete state.items[id];

        const uid = auth.currentUser?.uid;
        if (uid) {
          const db = getDatabase();
          remove(ref(db, `carts/${uid}/${id}`));
        }
      }
    },
    clearCart(state) {
      const uid = auth.currentUser?.uid;
      state.items = {};

      if (uid) {
        const db = getDatabase();
        remove(ref(db, `carts/${uid}`));
      }
    },
    setorder(state, action) {
      state.orders = action.payload;
    },
  },
});

export const {
  setCart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  setorder,
} = cartSlice.actions;

export const placeOrder = ({ uid, items }) => async () => {
  const db = getDatabase();
  const orderRef = ref(db, `orders/${Date.now()}`);
  const orderData = {
    uid,
    items,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  await set(orderRef, orderData);
};

export default cartSlice.reducer;
