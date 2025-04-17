import { useEffect, useState } from "react";
import axios from "axios";

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/orders/my-orders",
        { headers: { Authorization: token } }
      );
      setOrders(response.data);
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Order History</h2>
      <ul>
        {orders.map((o) => (
          <li key={o.id}>Order {o.id}: ${o.totalAmount}</li>
        ))}
      </ul>
    </div>
  );
}

export default OrderHistory;
