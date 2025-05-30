 import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRecipe } from "../redux/RecipeSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const Recipee = () => {
  const dispatch = useDispatch();
  const [showrecipee, setShowrecipee] = useState(false);

  const nameRef = useRef(null);
  const detailsRef = useRef(null);
  const imageUrlRef = useRef(null);

  const recipeslist = useSelector((state) => state.recipe?.list || []);
  console.log(recipeslist);

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = nameRef.current.value.trim();
    const details = detailsRef.current.value.trim();
    const imageUrl = imageUrlRef.current.value.trim();

    if (!name || !details || !imageUrl) {
      toast.error("All fields are required", { theme: "dark" });
      return;
    }

    const recipe = { name, description: details, imageUrl };
    dispatch(addRecipe(recipe));
    toast.success("Recipe logged successfully!");

    // Clear inputs
    nameRef.current.value = "";
    detailsRef.current.value = "";
    imageUrlRef.current.value = "";
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 rounded-xl shadow-lg bg-gray-900 text-white">
      <ToastContainer position="top-center" theme="dark" />
      
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-3">🍽️ Add New Recipe</h2>
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          ➕ Add Categories
        </Link>
      </div>

      {!showrecipee && (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Recipe Name"
              ref={nameRef}
              className="w-full p-3 border border-gray-500 rounded-lg bg-gray-800 text-white"
            />
            <textarea
              placeholder="Details of the Recipe"
              ref={detailsRef}
              className="w-full p-3 border border-gray-500 rounded-lg bg-gray-800 text-white"
              rows={4}
            />
            <input
              type="text"
              placeholder="Image URL"
              ref={imageUrlRef}
              className="w-full p-3 border border-gray-500 rounded-lg bg-gray-800 text-white"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              ➕ Add Recipe
            </button>
          </form>

          <div
            onClick={() => setShowrecipee(true)}
            className="cursor-pointer mt-8 flex flex-col items-center"
          >
            <img
              src="https://th.bing.com/th/id/OIP.x6CoeW_PB3-eOorFwwb6kQHaD8?pid=ImgDet&w=184&h=97&c=7&dpr=1.3"
              alt="Show Recipes"
              className="w-32 h-auto border border-blue-400 rounded-md"
            />
            <p className="mt-2 text-blue-400 hover:underline">Show Recipes</p>
          </div>
        </>
      )}

      {showrecipee && (
        <div className="mt-8">
          <button
            onClick={() => setShowrecipee(false)}
            className="mb-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            🔙 Go Back
          </button>

          <div className="space-y-6">
            {recipeslist.map((ele, i) => (
              <div
                key={i}
                className="p-4 border border-blue-600 rounded-lg bg-gray-800 shadow-sm"
              >
                <h3 className="text-2xl font-semibold text-yellow-300">{ele.name}</h3>
                <p className="text-gray-300 mt-2">{ele.description}</p>
                <img
                  src={ele.imageUrl}
                  alt={ele.name}
                  className="w-20  h-auto mt-4 rounded-md border border-gray-600"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipee;
