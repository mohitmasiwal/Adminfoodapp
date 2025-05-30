import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/AuthSlice";
import categoriesReducer from "../redux/categoriesSlice";
import  cartReducer from "../redux/CartSlice";
import   recipeReducer from "../redux/RecipeSlice";
import   ordersReducer from "../redux/ordersSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
     categories: categoriesReducer,
       cart: cartReducer,
        recipe: recipeReducer,
        orders: ordersReducer,
  },
});

export default store;
