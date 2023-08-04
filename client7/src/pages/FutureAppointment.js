import React, { useState, useEffect } from "react";
import { requestsGet, requestsPost } from "../requestsFromServer.js";
import "../css/History.css";

const FutureAppointment = () => {
  const [queues, setQueues] = useState([]);
  const [customer_id, setCustomer_id] = useState(
    JSON.parse(localStorage.getItem("currentUserID"))
  );

  // Function to fetch the list of queues for a particular customer
  const fetchQueues = async () => {
    try {
      const response = await requestsGet(
        `/appointments/futureAppointments/${customer_id}`
      );
      let data = await response.json();
      setQueues([...data]);
    } catch (error) {
      console.error("Error fetching queues:", error);
    }
  };

  // Function to cancel a queue
  const cancelQueue = async (queueId) => {
    // try {
    //   await requestsPost(`/api/queues/${queueId}/cancel`); // Replace "/api/queues/${queueId}/cancel" with the actual endpoint for canceling a queue
    //   fetchQueues(); // Fetch the updated list of queues after cancellation
    // } catch (error) {
    //   console.error("Error canceling queue:", error);
    // }
  };

  // Fetch queues on component mount
  useEffect(() => {
    fetchQueues();
  }, []);

  return (
    <div className="history-container">
      <h2>FutureAppointment</h2>
      {queues.map((queue) => (
        <div className="queue-row" key={queue.appointment_id}>
          <span>{queue.appointment_id}</span>
          <span>{queue.date_time}</span>
          <button onClick={() => cancelQueue(queue.appointment_id)}>
            Cancel Appointment
          </button>
        </div>
      ))}
    </div>
  );
};

export default FutureAppointment;
