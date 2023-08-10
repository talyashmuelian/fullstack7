import React, { useState } from "react";

const PaymentModal = ({ isOpen, onClose, voucherId }) => {
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Call your backend API to create a payment intent
    const response = await fetch("/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ voucherId }),
    });

    // Payment successful, close the modal
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          {/* <CardElement
            options={
              {
              }
            }
          />*/}
          <button type="submit">Pay Now</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default PaymentModal;
