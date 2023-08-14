import React, { useState, useEffect } from "react";
import {
  requestsDelete,
  requestsGet,
  requestsPost,
} from "../requestsFromServer.js";
import "../css/AdminPayments.css";
import Modal from "./Modal";

const AdminPayments = () => {
  const token = sessionStorage.getItem("token");
  const [selectedUser, setSelectedUser] = useState("");
  const [amountToBePaid, setAmountToBePaid] = useState("");
  const [vouchers, setVouchers] = useState([]);
  const [users, setUsers] = useState([{ id: 1, userName: "kfhv" }]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await requestsGet(`/admin/users?token=${token}`);
      if (response.status !== 200) {
        console.error("Error fetching users:");
      } else {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchVouchers = async () => {
    try {
      const response = await requestsGet(`/admin/vouchers?token=${token}`);
      if (response.status !== 200) {
        console.error("Error fetching vouchers:");
      } else {
        const fetchedVouchers = await response.json();
        setVouchers(fetchedVouchers);
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  const handleAddPayment = async () => {
    try {
      const paymentData = {
        customer_id: selectedUser,
        amount_to_be_paid: amountToBePaid,
      };

      const response = await requestsPost(
        `/admin/setNewPaymentVoucher?token=${token}`,
        paymentData
      );
      if (response.status !== 200) {
        setModalMessage("Error creating a new voucher");
        setModalVisible(true);
      } else {
        const newVoucher = await response.json();
        setVouchers([...vouchers, newVoucher.voucher]);
      }
    } catch (error) {
      console.error("Error adding payment:", error);
      setModalMessage("Error adding payment");
      setModalVisible(true);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchVouchers();
  }, []);

  const handleDeleteVoucher = async (voucherId) => {
    try {
      const response = await requestsDelete(
        `/admin/vouchers/${voucherId}?token=${token}`
      );
      if (response.status === 204) {
        setVouchers((prevVouchers) =>
          prevVouchers.filter((voucher) => voucher.voucher_id !== voucherId)
        );
      } else {
        console.error("Error deleting voucher");
        setModalMessage("Error deleting voucher");
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error deleting voucher:", error);
      setModalMessage("Error deleting voucher");
      setModalVisible(true);
    }
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  return (
    <div className="admin-payments-container">
      <div className="payment-form">
        <h2>Add Payment</h2>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.customer_id} value={user.customer_id}>
              {user.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={amountToBePaid}
          onChange={(e) => setAmountToBePaid(e.target.value)}
          placeholder="Amount to be paid"
        />
        <button className="add-payment-button" onClick={handleAddPayment}>
          Add Payment
        </button>
      </div>

      <div className="voucher-list">
        <h2>Voucher List</h2>
        <table>
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Amount</th>
              <th>Paid</th>
              <th>Created At</th>
              <th>Payment Made At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {vouchers
              .sort(
                (a, b) =>
                  new Date(b.voucher_created_at) -
                  new Date(a.voucher_created_at)
              )
              .map((voucher) => (
                <tr key={voucher.voucher_id}>
                  <td>{voucher.customer_id}</td>
                  <td>{voucher.amount_to_be_paid}</td>
                  <td>{voucher.paid ? "Paid" : "Not Paid"}</td>
                  <td>
                    {new Date(voucher.voucher_created_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </td>
                  <td>
                    {voucher.payment_made_at
                      ? new Date(voucher.payment_made_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "Not paid yet"}
                  </td>
                  <td>
                    <button
                      className="delete-voucher-button"
                      onClick={() => handleDeleteVoucher(voucher.voucher_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {modalVisible && <Modal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default AdminPayments;
