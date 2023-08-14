import React, { useState, useEffect } from "react";
import { requestsGet, requestsPost } from "../requestsFromServer.js";
import "../css/MyRequests.css";

const MyRequests = () => {
  const [requestsList, setRequestsList] = useState([]);
  const [customer_id, setCustomer_id] = useState(
    JSON.parse(localStorage.getItem("currentUserID"))
  );

  useEffect(() => {
    fetchRequestsData();
  }, []);

  const fetchRequestsData = async () => {
    try {
      const response = await requestsGet(`/requests/myRequests/${customer_id}`);
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

  return (
    <div className="my-requests-container">
      <h2>Requests I Created</h2>
      {requestsList.length === 0 ? (
        <div className="no-requests">No replacement requests</div>
      ) : (
        requestsList.map((request) => (
          <div key={request.id} className="request-item">
            <div className="request-details">
              <span className="sender-datetime">
                Your:{" "}
                {new Date(request.sender_date_time).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </span>
              <span className="your-datetime">
                Recipient:{" "}
                {new Date(request.recipient_date_time).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyRequests;
