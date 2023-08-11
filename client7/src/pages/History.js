import React, { useState, useEffect } from "react";
import { requestsGet, requestsPost } from "../requestsFromServer.js";
import "../css/History.css"; // Your original CSS for the component

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
      const response = await requestsGet(
        `/appointments/history/${customer_id}`
      );
      let data = await response.json();

      // Sort the history data by date_time in ascending order
      data.sort((a, b) => a.date_time.localeCompare(b.date_time));

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
          ))
        )}
      </div>
    </div>
  );
};

export default History;
