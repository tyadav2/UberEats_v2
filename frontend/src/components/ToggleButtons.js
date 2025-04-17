import React, { useState } from "react";

function ToggleButtons() {
  const [selected, setSelected] = useState("delivery");

  return (
    <div className="toggle-buttons flex gap-2">
      <button
        className={`px-4 py-2 rounded-full transition-all duration-300 ${
          selected === "delivery"
            ? "bg-white text-green-600 border-2 border-green-600 shadow-md"
            : "bg-white text-black border-2 border-gray-300 hover:bg-gray-100"
        }`}
        onClick={() => setSelected("delivery")}
      >
        Delivery
      </button>
      <button
        className={`px-4 py-2 rounded-full transition-all duration-300 ${
          selected === "pickup"
            ? "bg-white text-green-600 border-2 border-green-600 shadow-md"
            : "bg-white text-black border-2 border-gray-300 hover:bg-gray-100"
        }`}
        onClick={() => setSelected("pickup")}
      >
        Pickup
      </button>
    </div>
  );
}

export default ToggleButtons;
