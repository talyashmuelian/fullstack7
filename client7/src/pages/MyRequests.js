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
      // Assuming requests Get function returns an array of queue objects with appointment_id and date_time properties
      const response = await requestsGet(`/requests/myRequests/${customer_id}`);
      let data = await response.json();
      let data1 = data.requests;
      setRequestsList(data1);
    } catch (error) {
      console.error("Error fetching requests: ", error);
    }
  };

  return (
    <div className="my-requests-container">
      {requestsList.length === 0 ? (
        <div className="no-requests">No replacement requests</div>
      ) : (
        requestsList.map((request) => (
          <div key={request.id} className="request-item">
            <div className="request-details">
              <span className="sender-datetime">
                Your: {request.sender_date_time}
              </span>
              <span className="your-datetime">
                Recipient: {request.recipient_date_time}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyRequests;
