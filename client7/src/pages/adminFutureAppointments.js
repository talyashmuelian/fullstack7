import React, { useState, useEffect } from "react";
import {
  requestsDelete,
  requestsGet,
  requestsPost,
} from "../requestsFromServer.js";
import "../css/adminFutureAppointments.css";
import Modal from "./Modal";

const AdminFutureAppointments = () => {
  const [queues, setQueues] = useState([]);
  const [expandedDate, setExpandedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const response = await requestsGet(
          `/Admin/AdminFutureAppointments?token=${token}`
        );
        if (response.status !== 200) {
          console.log("error get AdminFutureAppointments");
          return;
        }
        let data = await response.json();
        let data1 = data.futureAppointments;
        setQueues(data1);
      } catch (error) {
        console.error("Error fetching queues:", error);
      }
    };

    fetchQueues();
  }, []);

  const cancelAppointment = async (appointment_id) => {
    console.log(appointment_id);
    try {
      const response = await requestsDelete(
        `/Admin/cancelAppointment/${appointment_id}?token=${token}`
      );
      if (response.status == 200) {
        setModalMessage("The appointment was successfully canceled");
        setModalVisible(true);
      }
      setQueues((prevQueues) =>
        prevQueues.filter((queue) => queue.appointment_id !== appointment_id)
      );
    } catch (error) {
      console.error("Error canceling queue:", error);
    }
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const queuesByDate = queues.reduce((acc, queue) => {
    const date = new Date(queue.date_time).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(queue);
    return acc;
  }, {});

  const sortedDates = Object.keys(queuesByDate).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  return (
    <div className="admin-future-appointments">
      {sortedDates.map((date) => (
        <div className="date-group" key={date}>
          <div
            className="date-title"
            onClick={() => setExpandedDate(expandedDate === date ? null : date)}
          >
            {date}{" "}
            <span className="expand-arrow">
              {expandedDate === date ? "▼" : "▶"}
            </span>
          </div>
          {expandedDate === date && (
            <div className="queues-list">
              {queuesByDate[date]
                .sort((a, b) => new Date(a.date_time) - new Date(b.date_time))
                .map((queue) => (
                  <div className="queue" key={queue.date_time}>
                    <div className="queue-time">
                      {new Date(queue.date_time).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="queue-details">
                      {queue.isOccupied ? (
                        <>
                          <div>Name: {queue.name}</div>
                          <div>ID Number: {queue.id_number}</div>
                          <div>Phone: {queue.phone}</div>
                          <div>Email: {queue.email}</div>
                          <div>Additional Info: {queue.additionalInfo}</div>
                          <button
                            className="cancel-button"
                            onClick={() =>
                              cancelAppointment(queue.appointment_id)
                            }
                          >
                            Cancel Appointment
                          </button>
                        </>
                      ) : (
                        <div className="queue-available">
                          The appointment is still available
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
      {modalVisible && <Modal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default AdminFutureAppointments;
