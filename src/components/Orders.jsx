 import React, { useEffect, useState } from 'react';
import { db } from '../firebase/Firebase';
import { ref, onValue, update } from 'firebase/database';

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    const ordersRef = ref(db, 'orders/');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setAllOrders([]);
        return;
      }

      const formattedOrders = [];
      for (let uid in data) {
        for (let orderId in data[uid]) {
          formattedOrders.push({
            uid,
            orderId,
            ...data[uid][orderId],
          });
        }
      }

      setAllOrders(formattedOrders);
    });

    return () => unsubscribe(); // cleanup listener
  }, []);

  const handleStatusUpdate = async (uid, orderId, newStatus) => {
    const orderRef = ref(db, `orders/${uid}/${orderId}`);
    await update(orderRef, { status: newStatus });
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">All Orders</h2>
      {allOrders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {allOrders.map((order) => (
            <div key={order.orderId} className="bg-white shadow p-4 rounded">
              <p className="font-semibold">User ID: {order.uid}</p>
              <p>Order ID: {order.orderId}</p>
              <p>Status: <span className="font-medium">{order.status}</span></p>
              <p>
                Created At:{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "Unknown"}
              </p>
              <div className="mt-4">
                <p className="font-semibold">Items:</p>
                {order.items ? (
                  <ul className="list-disc pl-6">
                    {Object.values(order.items).map((orderItem, index) => (
                      <li key={index}>
                        {orderItem.item?.name || "Unknown"} - Qty:{" "}
                        {orderItem.quantity}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No items in this order.</p>
                )}
              </div>
              <div className="mt-4">
                <select
                  onChange={(e) =>
                    handleStatusUpdate(order.uid, order.orderId, e.target.value)
                  }
                  defaultValue={order.status}
                  className="p-2 border rounded"
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
