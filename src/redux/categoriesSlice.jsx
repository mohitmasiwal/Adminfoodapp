 import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebase/Firebase";
import { ref, get, set, push, remove, update } from "firebase/database";

// Fetch categories
export const fetchCategories = createAsyncThunk("categories/fetch", async () => {
  const snapshot = await get(ref(db, "categories"));
  const data = snapshot.val() || {};
  return Object.entries(data).map(([id, cat]) => ({
    id,
    name: cat.name,
    items: cat.items || {},
  }));
});
 export const fetchRecipe = createAsyncThunk("recipes/fetch", async () => {
  const snapshot = await get(ref(db, "recipes"));
  const data = snapshot.val() || {};
  return Object.entries(data).map(([id, recipe]) => ({
    id,
    ...recipe,
  }));
});


// Add new category
export const addCategory = createAsyncThunk("categories/addCategory", async (name) => {
  const newCatRef = push(ref(db, "categories"));
  await set(newCatRef, { name, items: {} });
  return { id: newCatRef.key, name, items: {} };
});

// Add item to a category
export const addItem = createAsyncThunk("categories/addItem", async ({ categoryId, item }) => {
  const newItemRef = push(ref(db, `categories/${categoryId}/items`));
  await set(newItemRef, item);
  return { categoryId, itemId: newItemRef.key, item };
});

// Delete item from category
export const deleteItem = createAsyncThunk("categories/deleteItem", async ({ categoryId, itemId }) => {
  await remove(ref(db, `categories/${categoryId}/items/${itemId}`));
  return { categoryId, itemId };
});

 
export const deletefullcatgery = createAsyncThunk("categories/deletefullcatgery", async (categoryId) => {
  await remove(ref(db, `categories/${categoryId}`));
  return categoryId;
});

// Edit item in category
export const editItem = createAsyncThunk("categories/editItem", async ({ categoryId, itemId, updatedItem }) => {
  await update(ref(db, `categories/${categoryId}/items/${itemId}`), updatedItem);
  return { categoryId, itemId, updatedItem };
});

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    recipe: [],
    loading: false,
    error: null,
    
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipe.fulfilled, (state, action) => {
  state.recipe = action.payload;  
})

      // Fetching
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Adding category
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })

      // Adding item
      .addCase(addItem.fulfilled, (state, action) => {
        const { categoryId, itemId, item } = action.payload;
        const category = state.categories.find((cat) => cat.id === categoryId);
        if (category) {
          category.items[itemId] = item;
        }
      })

      // Deleting item
      .addCase(deleteItem.fulfilled, (state, action) => {
        const { categoryId, itemId } = action.payload;
        const category = state.categories.find((cat) => cat.id === categoryId);
        if (category && category.items[itemId]) {
          delete category.items[itemId];
        }
      })

      // ✅ Deleting full category
      .addCase(deletefullcatgery.fulfilled, (state, action) => {
        const categoryId = action.payload;
        state.categories = state.categories.filter((cat) => cat.id !== categoryId);
      })

      // Editing item
      .addCase(editItem.fulfilled, (state, action) => {
        const { categoryId, itemId, updatedItem } = action.payload;
        const category = state.categories.find((cat) => cat.id === categoryId);
        if (category && category.items[itemId]) {
          category.items[itemId] = { ...category.items[itemId], ...updatedItem };
        }
      });
  },
});

export default categoriesSlice.reducer;
