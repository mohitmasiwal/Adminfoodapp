 import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  placeOrder,
} from "../redux/CartSlice";
import { fetchUserOrders } from "../redux/ordersSlice";
import { auth } from "../firebase/Firebase";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items || {});
  const userOrders = useSelector((state) => state.orders.userOrders || []);
  const loadingOrders = useSelector((state) => state.orders.loading);
  const user = auth.currentUser;
  console.log(userOrders);
  

  useEffect(() => {
    if (user) {
      dispatch(fetchUserOrders(user.uid));
    }
  }, [dispatch, user]);

  const calculateTotal = () => {
    return Object.values(cartItems).reduce((total, { item, quantity }) => {
      const price = Number(item.price);
      return total + price * quantity;
    }, 0);
  };

  const handleOrderNow = () => {
    if (!user || Object.keys(cartItems).length === 0) {
      console.warn("User not authenticated or cart is empty");
      return;
    }

    dispatch(placeOrder({ uid: user.uid, items: cartItems })).then(() => {
      dispatch(clearCart());
      dispatch(fetchUserOrders(user.uid));
    });
  };

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen px-4 py-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-white">🛒 Your Cart</h1>

        {Object.keys(cartItems).length === 0 ? (
          <p className="text-center text-gray-400 text-lg">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-6">
              {Object.entries(cartItems).map(([id, { item, quantity }]) => (
                <div
                  key={id}
                  className="bg-gray-800 rounded-lg shadow-md p-4 flex flex-col md:flex-row items-center gap-6"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1 w-full">
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <p className="text-gray-400">₹{Number(item.price)} each</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => dispatch(decreaseQuantity(id))}
                        className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
                      >
                        -
                      </button>
                      <span>{quantity}</span>
                      <button
                        onClick={() => dispatch(increaseQuantity(id))}
                        className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 text-lg font-bold">
                      ₹{Number(item.price) * quantity}
                    </p>
                    <button
                      onClick={() => dispatch(removeFromCart(id))}
                      className="text-red-400 text-sm hover:underline mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-800 mt-10 rounded-lg shadow-md p-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-2xl font-bold text-white">
                Total: ₹{calculateTotal().toLocaleString()}
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={() => dispatch(clearCart())}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleOrderNow}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
                >
                  Order Now
                </button>
              </div>
            </div>
          </>
        )}

        {/* Order History */}
      <div className="mt-16">
  <h2 className="text-3xl font-bold mb-4 text-white">📦 Your Order History</h2>
  {loadingOrders ? (
    <p className="text-gray-400">Loading orders...</p>
  ) : !userOrders || Object.keys(userOrders).length === 0 ? (
    <p className="text-gray-500">You have no previous orders.</p>
  ) : (
    <div className="space-y-6">
      {Object.entries(userOrders)
        .sort((a, b) => new Date(b[1].createdAt) - new Date(a[1].createdAt)) // newest first
        .map(([orderId, order]) => (
          <div
            key={orderId}
            className="bg-gray-800 border-l-4 border-blue-500 rounded-md p-4"
          >
            <div className="flex justify-between mb-2">
              <p>
                <strong>Order ID:</strong> {orderId}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`font-bold ${
                    order.status === "completed"
                      ? "text-green-400"
                      : order.status === "pending"
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  {order.status}
                </span>
              </p>
            </div>
            <div>
              {order.items &&
                Object.entries(order.items).map(([itemId, { item, quantity }]) => (
                  <div
                    key={itemId}
                    className="flex justify-between text-sm border-b border-gray-700 py-1"
                  >
                    <span>{item.name}</span>
                    <span>
                      {quantity} × ₹{Number(item.price)} = ₹
                      {Number(item.price) * quantity}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  )}
</div>

      </div>
    </div>
  );
};

export default Cart;
