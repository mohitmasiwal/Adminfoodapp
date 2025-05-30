 import React, { useEffect, useState } from "react";
import { db } from "../firebase/Firebase";
import { ref, onValue, update } from "firebase/database";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    const ordersRef = ref(db, "orders/");
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setAllOrders([]);
        return;
      }

      const formattedOrders = Object.entries(data).map(([orderId, orderData]) => ({
        orderId,
        ...orderData,
      }));

      setAllOrders(formattedOrders);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    const orderRef = ref(db, `orders/${orderId}`);
    await update(orderRef, { status: newStatus });
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">All Orders</h2>
      {allOrders.length === 0 ? (
        <p className="text-center text-gray-400">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {allOrders.map((order) => (
            <div
              key={order.orderId}
              className="bg-gray-800 shadow-md rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors duration-300"
            >
              {/* Name and Phone Number at top, both bold */}
              <p className="text-white font-bold text-lg">
                {order.name || "Unknown Name"}
              </p>
              <p className="text-gray-300 font-semibold mb-4">
                Phone: {order.phone || "Unknown Phone"}
              </p>

              <p className="font-semibold text-gray-200">User ID: <span className="font-normal">{order.uid}</span></p>
              <p className="text-gray-300">Order ID: {order.orderId}</p>

              <p className="mt-2">
                Status:{" "}
                <span className="font-medium capitalize text-blue-400">{order.status}</span>
              </p>
              <p className="text-gray-400">
                Created At:{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "Unknown"}
              </p>

              <div className="mt-4">
                <p className="font-semibold text-gray-200 mb-2">Items:</p>
                {order.items ? (
                  <ul className="list-disc pl-6 text-gray-300">
                    {Object.entries(order.items).map(([id, { item, quantity }]) => (
                      <li key={id}>
                        {item?.name || "Unknown"} - Qty: {quantity}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No items in this order.</p>
                )}
              </div>

              <div className="mt-6">
                <select
                  onChange={(e) => handleStatusUpdate(order.orderId, e.target.value)}
                  defaultValue={order.status}
                  className="w-full md:w-64 p-2 rounded bg-gray-700 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
