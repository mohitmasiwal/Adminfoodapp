 import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchCategories,
    addCategory,
    addItem,
    deleteItem,
    editItem,
    deletefullcatgery
} from "../redux/categoriesSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";  



const Admin = () => {
    const categoryRef = useRef(null);
    const itemNameRef = useRef(null);
    const itemPriceRef = useRef(null);
    const itemDescRef = useRef(null);
    const itemImageURLRef = useRef(null);  

    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector((state) => state.categories);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleAddCategory = () => {
        const category = categoryRef.current.value.trim();
        if (!category) {
            toast.error("Please enter a category name");
            return;
        }
        dispatch(addCategory(category))
            .unwrap()
            .then(() => {
                toast.success("Category added!");
                categoryRef.current.value = "";
            })
            .catch((err) => toast.error("Error: " + err));
    };

    const handleAddOrEditItem = () => {
        if (!selectedCategory) {
            toast.error("Please select a category first");
            return;
        }

        const name = itemNameRef.current.value.trim();
        const price = itemPriceRef.current.value.trim();
        const description = itemDescRef.current.value.trim();
        const imageUrl = itemImageURLRef.current.value.trim();

        if (!name || !price) {
            toast.error("Please enter item name and price");
            return;
        }

        const itemData = { name, price, description, imageUrl };

        if (editingItem) {
            dispatch(
                editItem({
                    categoryId: editingItem.categoryId,
                    itemId: editingItem.itemId,
                    updatedItem: itemData,
                })
            )
                 
                .then(() => {
                    toast.success("Item updated!");
                    clearItemForm();
                })
                .catch((err) => toast.error("Error: " + err));
        } else {
            dispatch(
                addItem({
                    categoryId: selectedCategory,
                    item: itemData,
                })
            )
                .unwrap()
                .then(() => {
                    toast.success("Item added!");
                    clearItemForm();
                })
                .catch((err) => toast.error("Error: " + err));
        }
    };

    const clearItemForm = () => {
        itemNameRef.current.value = "";
        itemPriceRef.current.value = "";
        itemDescRef.current.value = "";
        itemImageURLRef.current.value = "";
        setEditingItem(null);
    };

    const handleEditClick = (categoryId, itemId, item) => {
        setSelectedCategory(categoryId);
        setEditingItem({ categoryId, itemId, item });
        itemNameRef.current.value = item.name;
        itemPriceRef.current.value = item.price;
        itemDescRef.current.value = item.description || "";
        itemImageURLRef.current.value = item.imageUrl || "";
    };

    const handleDeleteClick = (categoryId, itemId) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            dispatch(deleteItem({ categoryId, itemId }))
                .unwrap()
                .then(() => toast.success("Item deleted!"))
                .catch((err) => toast.error("Error: " + err));
        }
    };

    const handleDeletecatgery = (categoryId) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            dispatch(deletefullcatgery(categoryId))
                .then(() => toast.success("Category deleted!"))
                .catch((err) => toast.error("Error: " + err));
        }
    };

    return (
        <>
            <ToastContainer position="top-center" />
            <div className="min-h-screen p-4 md:p-10">
                <div className="max-w-3xl mx-auto  bg-gray-800 text-gray-600 p-6 rounded-2xl shadow-lg space-y-6">
                    <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Add your meals</h2>
                    <div className="text-center mb-4">
  <Link
    to="/recipee"
    className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
  >
    Go to Add Recipee Page
  </Link>
</div>
     
            
                    <div>
                        <input
                            type="text"
                            placeholder="New Category (e.g. Dinner)"
                            ref={categoryRef}
                            disabled={loading}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            onClick={handleAddCategory}
                            disabled={loading}
                            className="w-full mt-2 bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            Add Category
                        </button>
                    </div>

                    {/* Add or Edit Item */}
                    <div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="Item Name (e.g. Malai Roti)"
                            ref={itemNameRef}
                            disabled={loading || !selectedCategory}
                            className="w-full p-3 border border-gray-300 rounded-md mb-2"
                        />

                        <input
                            type="number"
                            placeholder="Price"
                            ref={itemPriceRef}
                            disabled={loading || !selectedCategory}
                            className="w-full p-3 border border-gray-300 rounded-md mb-2"
                        />

                        <textarea
                            placeholder="Description (optional)"
                            ref={itemDescRef}
                            disabled={loading || !selectedCategory}
                            className="w-full p-3 border border-gray-300 rounded-md mb-2"
                        />

                        <input
                            type="text"
                            placeholder="Image URL (optional)"
                            ref={itemImageURLRef}
                            disabled={loading || !selectedCategory}
                            className="w-full p-3 border border-gray-300 rounded-md mb-4"
                        />

                        <button
                            onClick={handleAddOrEditItem}
                            disabled={loading || !selectedCategory}
                            className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
                        >
                            {editingItem ? "Update Item" : "Add Item"}
                        </button>
                        {editingItem && (
                            <button
                                onClick={clearItemForm}
                                disabled={loading}
                                className="w-full mt-2 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    {/* Display Categories and Items */}
                    <div className="">
                        <div>

                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800 mt-8">Current Menu</h3>
                        {categories.length === 0 && <p>No categories added yet.</p>}

                        {categories.map((cat) => (
                            <div key={cat.id} className="bg-gray-50 p-4 rounded-3xl mt-4 ">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-2xl pl-7 text-blue-950 font-serif font-bold ">{cat.name}</h4>
                                    <button
                                        onClick={() => handleDeletecatgery(cat.id)}
                                        className= "p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <ul className="space-y-4">
                                    {Object.keys(cat.items).length === 0 && <li className="text-gray-500">No items yet</li>}
                                    {Object.entries(cat.items).map(([key, item]) => (
                                        <li key={key} className="border-b pb-4">
                                            <div className=" rounded-xl flex flex-col md:flex-row md:justify-between  shadow-2xl hover:bg-gray-300 hover:text-white pl-4   gap-8">
                                                <div>
                                                    <p className="font-semibold text-lg">{item.name} - ₹{item.price}</p>
                                                    <p className="text-gray-600 text-sm">{item.description}</p>
                                                    <div className="space-x-2 mt-2 flex">
  <button
    onClick={() => handleEditClick(cat.id, key, item)}
    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
  >
    <Pencil size={16} />
  </button>
  <button
    onClick={() => handleDeleteClick(cat.id, key)}
    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
  >
    <Trash2 size={16} />
  </button>
</div>

  </div>
  {item.imageUrl && (
     <img src={item.imageUrl} alt={item.name}  className="w-24 h-24 object-cover rounded-md border" />
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                 <Link
    to="/orders"
    className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
  >
    Go to Orders Section
  </Link>
            </div>
        </>
    );
};

export default Admin;
