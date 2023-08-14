import React, { useState, useEffect } from "react";
import {
  requestsGet,
  requestsPost,
  requestsPut,
} from "../requestsFromServer.js";
import "../css/CustomerPayments.css";
import Modal from "./Modal";

const CustomerPayments = () => {
  const [customer_id, setCustomer_id] = useState(
    JSON.parse(localStorage.getItem("currentUserID"))
  );
  const [vouchers, setVouchers] = useState([]);
  const [paidVouchers, setPaidVouchers] = useState([]);
  const [unpaidVouchers, setUnpaidVouchers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
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
    try {
      console.log("before fetch pay");
      let response = await requestsPut(`/payments/pay/${voucherId}`, {});
      console.log("after fetch pay");
      if (response.status !== 200) {
        setModalMessage("error handleing payment");
        setModalVisible(true);
      } else {
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
      setModalMessage("error handleing payment");
      setModalVisible(true);
    }
  };
  const closeModal = () => {
    setModalVisible(false);
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
      {modalVisible && <Modal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default CustomerPayments;
