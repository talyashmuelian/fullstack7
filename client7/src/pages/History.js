import React, { useState, useEffect } from "react";
import { requestsGet, requestsPost } from "../requestsFromServer.js";
import "../css/History.css";

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [customer_id, setCustomer_id] = useState(
    JSON.parse(localStorage.getItem("currentUserID"))
  );

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    try {
      // Assuming requests Get function returns an array of queue objects with appointment_id and date_time properties
      const response = await requestsGet(
        `/appointments/history/${customer_id}`
      );

      let data = await response.json();
      setHistoryData([...data]);
    } catch (error) {
      console.error("Error fetching history data:", error);
    }
  };

  return (
    <div className="history-container">
      <h2>History</h2>
      <div className="history-list">
        {historyData.length === 0 ? (
          <div className="no-history">No history</div>
        ) : (
          historyData.map((queue) => (
            <div key={queue.appointment_id} className="history-item">
              <span className="queue-id">
                appointment ID: {queue.appointment_id}{" "}
              </span>
              <span className="queue-date">Date: {queue.date_time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
