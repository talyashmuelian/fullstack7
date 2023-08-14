import React, { useState, useEffect } from "react";
import {
  requestsGet,
  requestsPost,
  requestsDelete,
  requestsPut,
} from "../requestsFromServer.js";
import "../css/RequestsForMe.css";
import Modal from "./Modal";

const RequestsForMe = () => {
  const [requestsList, setRequestsList] = useState([]);
  const [customer_id, setCustomer_id] = useState(
    JSON.parse(localStorage.getItem("currentUserID"))
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    fetchRequestsData();
  }, []);

  const fetchRequestsData = async () => {
    try {
      const response = await requestsGet(
        `/requests/requestsForMe/${customer_id}`
      );
      let data = await response.json();
      let data1 = data.requests;
      data1.sort((a, b) =>
        a.sender_date_time.localeCompare(b.sender_date_time)
      );

      setRequestsList(data1);
    } catch (error) {
      console.error("Error fetching requests: ", error);
    }
  };

  const handleReplacementRequest = async (request) => {
    try {
      const response = await requestsDelete(
        `/requests/deleteRequest/${request.request_id}`
      );
      fetchRequestsData(); // Fetch the updated list of queues after cancellation
    } catch (error) {
      console.error("Error canceling queue:", error);
    }

    try {
      const response1 = await requestsPut(
        `/appointments/replaceAppointment/${request.sender_appointment_id}/${request.recipient_appointment_id}`,
        {}
      );
      if (response1.status == 200) {
        console.log("The exchange was made successfully", response1);
        setModalMessage("The exchange was made successfully");
        setModalVisible(true);
      }
      fetchRequestsData();
    } catch (error) {
      console.error("Error The exchange was made", error);
    }
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="my-requests-container">
      <h2>Requests For Me</h2>
      {requestsList.length === 0 ? (
        <div className="no-requests">No replacement requests</div>
      ) : (
        requestsList.map((request) => (
          <div key={request.id} className="request-item">
            <div className="request-details">
              <span className="sender-datetime">
                Sender:{" "}
                {new Date(request.sender_date_time).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </span>
            </div>
            <div className="your-datetime">
              Your:{" "}
              {new Date(request.recipient_date_time).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </div>
            <button
              className="replacement-button"
              onClick={() => handleReplacementRequest(request)}
            >
              Confirm replacement?
            </button>
          </div>
        ))
      )}
      {modalVisible && <Modal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default RequestsForMe;
