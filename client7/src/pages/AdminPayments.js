import React, { useState, useEffect } from "react";
import {
  requestsGet,
  requestsPost,
  requestsPut,
  requestsDelete,
} from "../requestsFromServer.js";
import "../css/AdminPayments.css";

const AdminPayments = () => {
  const token = sessionStorage.getItem("token");
  const [selectedUser, setSelectedUser] = useState("");
  const [amountToBePaid, setAmountToBePaid] = useState("");
  const [vouchers, setVouchers] = useState([]);
  const [users, setUsers] = useState([{ id: 1, userName: "kfhv" }]);

  const fetchUsers = async () => {
    try {
      const response = await requestsGet("/admin/users"); // Adjust the API endpoint
      console.log(response);
      if (response.status !== 200) {
        console.error("Error fetching users:");
      } else {
        const data = await response.json(); // Assuming the response has a 'data' property
        console.log(data);
        setUsers(data); // Update your state with the fetched users
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchVouchers = async () => {
    try {
      const response = await requestsGet("/admin/vouchers"); // Adjust the API endpoint
      if (response.status !== 200) {
        console.error("Error fetching vouchers:");
      } else {
        const fetchedVouchers = await response.json(); // Assuming the response has a 'data' property
        setVouchers(fetchedVouchers);
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      //alert("Error fetching vouchers:", error);
    }
  };

  const handleAddPayment = async () => {
    try {
      const paymentData = {
        customer_id: selectedUser,
        amount_to_be_paid: amountToBePaid,

        // Other data you need to send
      };

      const response = await requestsPost(
        "/payments/setNewPaymentVoucher",
        paymentData
      ); // Adjust the API endpoint
      if (response.status !== 200) {
        alert("error create a new voucer");
      } else {
        const newVoucher = await response.json();
        console.log(newVoucher.voucher);
        setVouchers([...vouchers, newVoucher.voucher]);
      }
      // Handle success, e.g., show a success message, update the list of vouchers
    } catch (error) {
      console.error("Error adding payment:", error);
      alert("Error adding payment:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchVouchers();
  }, []);

  const handleDeleteVoucher = async (voucherId) => {
    try {
      const response = await requestsDelete(`/admin/vouchers/${voucherId}`); // Adjust the API endpoint
      if (response.status === 204) {
        setVouchers((prevVouchers) =>
          prevVouchers.filter((voucher) => voucher.voucher_id !== voucherId)
        );
      } else {
        console.error("Error deleting voucher");
        alert("Error deleting voucher");
      }
    } catch (error) {
      console.error("Error deleting voucher:", error);
      alert("Error deleting voucher:", error);
    }
  };

  return (
    <div>
      {/* Add payment form */}
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
        <button onClick={handleAddPayment}>Add Payment</button>
      </div>

      <div className="voucher-list">
        <h2>Voucher List</h2>
        <table>
          <thead>
            <tr>
              <th>Voucher ID</th>
              <th>Customer ID</th>
              <th>Amount</th>
              <th>Paid</th>
              <th>Created At</th>
              <th>Payment Made At</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((voucher) => (
              <tr key={voucher.voucher_id}>
                <td>{voucher.voucher_id}</td>
                <td>{voucher.customer_id}</td>
                <td>{voucher.amount_to_be_paid}</td>
                <td>{voucher.paid ? "Paid" : "Not Paid"}</td>
                <td>{voucher.voucher_created_at}</td>
                <td>{voucher.payment_made_at || "Not paid yet"}</td>
                <td>
                  <button
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
    </div>
  );
};

export default AdminPayments;
