 import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebase/Firebase";  
import { ref, push, set, get } from "firebase/database";

 
export const addRecipe = createAsyncThunk(
  "recipes/addRecipe",
  async ({ name, description, imageUrl }, { rejectWithValue }) => {
    try {
      const recipeRef = push(ref(db, "recipes"));
      const newRecipe = { name, description, imageUrl };
      await set(recipeRef, newRecipe);
      return { id: recipeRef.key, ...newRecipe };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

 
export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async (_, { rejectWithValue }) => {
    try {
      const snapshot = await get(ref(db, "recipes"));
      const data = snapshot.val() || {};
      const recipes = Object.entries(data).map(([id, recipe]) => ({
        id,
        ...recipe,
      }));
      return recipes;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const recipeSlice = createSlice({
  name: "recipes",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      
      .addCase(addRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(addRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       

      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default recipeSlice.reducer;
