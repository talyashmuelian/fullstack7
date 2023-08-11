import React, { useState, useEffect } from "react";
import { requestsGet, requestsPost } from "../requestsFromServer.js";
import "../css/MakeAppointment.css";
import Modal from "./Modal";

const MakeAppointment = () => {
  const [futureQueues, setFutureQueues] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [selectedQueueForReplace, setSelectedQueueForReplace] = useState(null);
  const [myFutureQueues, setMyFutureQueues] = useState([]);
  const [isRequestExchangeOpen, setIsRequestExchangeOpen] = useState(false);
  const [customer_id, setCustomer_id] = useState(
    JSON.parse(localStorage.getItem("currentUserID"))
  );
  const [formData, setFormData] = useState({
    additionalInfo: "",
    reminder: 0,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    fetchFutureQueues();
    fetchMyFutureQueues();
  }, [customer_id]);

  const fetchFutureQueues = async () => {
    try {
      const response = await requestsGet("/appointments/availableAppointments");
      const response1 = await requestsGet("/appointments/occupiedAppointments");
      let data = await response.json();
      let data1 = await response1.json();
      data = data.map((d) => ({ ...d, isOccupied: false }));
      data1 = data1.map((d) => ({ ...d, isOccupied: true }));
      const allQueues = [...data, ...data1];

      allQueues.sort((a, b) => a.date_time.localeCompare(b.date_time));

      setFutureQueues(allQueues);
    } catch (error) {
      console.error("Error fetching future queues:", error);
    }
  };

  const fetchMyFutureQueues = async () => {
    console.log(customer_id);
    try {
      const response = await requestsGet(
        `/appointments/futureAppointments/${customer_id}`
      );
      let data = await response.json();

      setMyFutureQueues([...data]);
    } catch (error) {
      console.error("Error fetching my future queues:", error);
    }
  };

  const handleQueueButtonClick = (queue) => {
    if (queue.isOccupied) {
      setIsRequestExchangeOpen(true);
      setSelectedQueueForReplace(queue);
    } else {
      openAppointmentForm(queue);
    }
  };

  const openAppointmentForm = (queue) => {
    setSelectedQueue(queue);
  };

  const deleteObjectById = (idToDelete) => {
    const updatedList = futureQueues.filter(
      (obj) => obj.appointment_id !== idToDelete
    );
    setFutureQueues(updatedList);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await requestsPost("/appointments/makeAppointment", {
        customer_id: customer_id,
        appointment_id: selectedQueue.appointment_id,
        ...formData,
      });
      setModalMessage("Appointment added successfully!");
      setModalVisible(true);
      deleteObjectById(selectedQueue.appointment_id);
      setSelectedQueue(null);
      console.log("Appointment added successfully!", response);
    } catch (error) {
      console.error("Error adding appointment:", error);
    }
  };

  const handleRequestExchangeSubmit = async (queue) => {
    try {
      const response = await requestsPost("/requests/createRequest", {
        sender_client_id: customer_id,
        recipient_appointment_id: selectedQueueForReplace.appointment_id,
        sender_appointment_id: queue.appointment_id,
      });
      if (response.status == 200) {
        console.log("Exchange request submitted!", response);
        setModalMessage("Exchange request submitted successfully!");
        setModalVisible(true);
      } else if (response.status == 201) {
        console.log(
          "The request already exists. Wait patiently for a reply",
          response
        );
        setModalMessage(
          "The request already exists. Wait patiently for a reply"
        );
        setModalVisible(true);
      } else if (response.status == 400) {
        alert(
          "This appointment belongs to you. You cannot ask for a replacement yourself"
        );
        setModalMessage(
          "This appointment belongs to you. You cannot ask for a replacement yourself"
        );
        setModalVisible(true);
      }
      setIsRequestExchangeOpen(false);
    } catch (error) {
      console.error("Error submitting exchange request:", error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div>
      {futureQueues.map((queue) => (
        <div className="queue-item" key={queue.appointment_id}>
          <div className="queue-info">
            <span className="queue-date">
              {new Date(queue.date_time).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </span>
            <span className="queue-status">
              {queue.isOccupied ? "Occupied" : "Available"}
            </span>
          </div>
          {queue.isOccupied ? (
            <button
              className="queue-action-button"
              onClick={() => handleQueueButtonClick(queue)}
            >
              Request a Replacement
            </button>
          ) : (
            <button
              className="queue-action-button"
              onClick={() => handleQueueButtonClick(queue)}
            >
              Call for a Appointment
            </button>
          )}
        </div>
      ))}
      {selectedQueue && (
        <div>
          <h2>Setting an Appointment</h2>
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              placeholder="additionalInfo"
              value={formData.additionalInfo}
              onChange={(e) =>
                setFormData({ ...formData, additionalInfo: e.target.value })
              }
            />
            <label>I want a reminder?</label>
            <input
              type="checkbox"
              placeholder="reminder"
              value={formData.reminder}
              onChange={(e) => {
                let temp;
                if (!e.target.checked) {
                  temp = 0;
                } else temp = 1;
                setFormData({ ...formData, reminder: temp });
              }}
            />
            <button type="submit">Set an Appointment</button>
          </form>
        </div>
      )}
      {isRequestExchangeOpen && (
        <div>
          <h2>Which queue do you wish to exchange with?</h2>
          {myFutureQueues.map((queue) => (
            <div className="queue-item" key={queue.appointment_id}>
              <div className="queue-info">
                <span className="queue-date">
                  {new Date(queue.date_time).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </span>
              </div>
              <button
                className="queue-action-button"
                onClick={() => handleRequestExchangeSubmit(queue)}
              >
                Submit an exchange request with this appointment
              </button>
            </div>
          ))}
        </div>
      )}
      {modalVisible && <Modal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default MakeAppointment;
