import React, { useState, useEffect } from "react";
import {
  requestsGet,
  requestsPost,
  requestsPut,
} from "../requestsFromServer.js";
import "../css/CustomerPayments.css";

const CustomerPayments = () => {
  const [customer_id, setCustomer_id] = useState(
    JSON.parse(localStorage.getItem("currentUserID"))
  );
  const [vouchers, setVouchers] = useState([]);
  const [paidVouchers, setPaidVouchers] = useState([]);
  const [unpaidVouchers, setUnpaidVouchers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch vouchers from the server and update the state
        let response = await requestsGet(
          `/payments/allVouchers?userId=${customer_id}`
        );
        if (response.status !== 200) {
          console.log("error fetching vouchers");
        } else {
          let data = await response.json();
          setVouchers(data);
          categorizeVouchers(data);
        }
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    }
    fetchData();
  }, []);

  const categorizeVouchers = (vouchers) => {
    const paid = [];
    const unpaid = [];

    vouchers.forEach((voucher) => {
      if (voucher.paid) {
        paid.push(voucher);
      } else {
        unpaid.push(voucher);
      }
    });

    setPaidVouchers(paid);
    setUnpaidVouchers(unpaid);
  };
  const handlePay = async (voucherId) => {
    // Call your server's payment endpoint
    try {
      console.log("before fetch pay");
      let response = await requestsPut(`/payments/pay/${voucherId}`, {});
      console.log("after fetch pay");
      if (response.status !== 200) {
        alert("error handleing payment");
      } else {
        // Update the state to mark the voucher as paid
        const updatedVouchers = vouchers.map((voucher) =>
          voucher.voucher_id === voucherId
            ? {
                ...voucher,
                paid: true,
                payment_made_at: response.payment_made_at,
              }
            : voucher
        );

        setVouchers(updatedVouchers);
        categorizeVouchers(updatedVouchers);
      }
    } catch (error) {
      console.error("Error making payment:", error);
      alert("error handleing payment");
    }
  };

  return (
    <div>
      <div>
        <h2>Paid Vouchers</h2>
        <ul>
          {paidVouchers.map((voucher) => (
            <li key={voucher.voucher_id}>
              {voucher.voucher_id} - {voucher.amount_to_be_paid}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Unpaid Vouchers</h2>
        <ul>
          {unpaidVouchers.map((voucher) => (
            <li key={voucher.voucher_id}>
              {voucher.voucher_id} - {voucher.amount_to_be_paid}{" "}
              {!voucher.paid && (
                <button onClick={() => handlePay(voucher.voucher_id)}>
                  Pay Now
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CustomerPayments;
