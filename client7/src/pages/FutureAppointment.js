import React, { useState, useEffect } from "react";
import {
  requestsGet,
  requestsPost,
  requestsDelete,
} from "../requestsFromServer.js";
import "../css/FutureAppointment.css";
import Modal from "./Modal";

const FutureAppointment = () => {
  const [queues, setQueues] = useState([]);
  const [customer_id, setCustomer_id] = useState(
    JSON.parse(localStorage.getItem("currentUserID"))
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const fetchQueues = async () => {
    try {
      const response = await requestsGet(
        `/appointments/futureAppointments/${customer_id}`
      );
      let data = await response.json();

      data.sort((a, b) => a.date_time.localeCompare(b.date_time));

      setQueues([...data]);
    } catch (error) {
      console.error("Error fetching queues:", error);
    }
  };

  const cancelQueue = async (appointment_id) => {
    try {
      const response = await requestsDelete(
        `/appointments/cancelAppointment/${appointment_id}`
      );
      if (response.status === 200) {
        console.log("Appointment canceled successfully", response);
        setModalMessage("Appointment canceled successfully!");
        setModalVisible(true);
      }
      fetchQueues();
    } catch (error) {
      console.error("Error canceling queue:", error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    fetchQueues();
  }, []);

  return (
    <div className="history-container">
      <h2>Future Appointment</h2>
      {queues.length === 0 ? (
        <p>No future queues</p>
      ) : (
        queues.map((queue) => (
          <div className="queue-row" key={queue.appointment_id}>
            <span>
              {new Date(queue.date_time).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </span>
            <button
              className="queue-action-button"
              onClick={() => cancelQueue(queue.appointment_id)}
            >
              Cancel Appointment
            </button>
          </div>
        ))
      )}
      {modalVisible && <Modal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default FutureAppointment;
