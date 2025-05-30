 import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, fetchRecipe } from "../redux/categoriesSlice";
import { addToCart } from "../redux/CartSlice";

const UserPage = () => {
  const dispatch = useDispatch();
  const { categories, recipe } = useSelector((state) => state.categories);
  const cartItems = useSelector((state) => state.cart.items || {});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchRecipe());
  }, [dispatch]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleRecipeClick = (id) => {
    setExpandedRecipeId((prevId) => (prevId === id ? null : id));
  };

  const selectedItems =
    categories.find((cat) => cat.id === selectedCategory)?.items || {};

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-white">🍽️ Our Menu</h1>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className={`px-6 py-3 rounded-xl text-lg font-semibold shadow transition duration-200 ${
              selectedCategory === cat.id
                ? "bg-blue-600 text-white"
                : "bg-gray-800 hover:bg-gray-700 text-gray-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Items of selected category */}
      {selectedCategory ? (
        Object.keys(selectedItems).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-14">
            {Object.entries(selectedItems).map(([id, item]) => (
              <div
                key={id}
                className="bg-gray-800 rounded-lg shadow-lg p-4 hover:shadow-xl transition"
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-md mb-3"
                  />
                )}
                <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
                <p className="text-green-400 font-bold mt-2">₹{item.price}</p>
                <button
                  onClick={() => dispatch(addToCart({ itemId: id, item }))}
                  className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No items in this category.</p>
        )
      ) : (
        <p className="text-center text-gray-400">Select a category to view items.</p>
      )}

      {/* Recipe Section */}
      <h2 className="text-3xl font-bold mt-16 mb-8 text-center text-white">🔥 Top Recipes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recipe.map((rec) => (
          <div
            key={rec.id}
            onClick={() => handleRecipeClick(rec.id)}
            className="bg-gray-800 rounded-lg shadow-lg p-4 hover:shadow-xl transition cursor-pointer"
          >
            {rec.imageUrl && (
              <img
                src={rec.imageUrl}
                alt={rec.name}
                className="w-full h-48 object-cover rounded-md mb-3"
              />
            )}
            <h3 className="text-xl font-semibold text-white">{rec.name}</h3>
            {expandedRecipeId === rec.id && (
              <>
                <p className="text-gray-400 text-sm mt-2">{rec.description}</p>
                <p className="text-green-400 font-bold mt-2">₹{rec.price}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPage;
