import { useState } from "react";
import axios from "axios";

function OrderForm() {
  const [restaurantId, setRestaurantId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  const placeOrder = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.post("http://localhost:5000/api/orders/place",
      { restaurantId, totalAmount },
      { headers: { Authorization: token } }
    );
    console.log(response.data);
  };

  return (
    <div>
      <input type="number" placeholder="Restaurant ID" onChange={(e) => setRestaurantId(e.target.value)} />
      <input type="number" placeholder="Total Amount" onChange={(e) => setTotalAmount(e.target.value)} />
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
}

export default OrderForm;
