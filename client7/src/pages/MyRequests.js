import React, { useState, useEffect } from "react";
import { requestsGet, requestsPost } from "../requestsFromServer.js";
import "../css/MyRequests.css";

const MyRequests = () => {
  const [requestsList, setRequestsList] = useState([]);

  useEffect(() => {
    // Make a GET request to fetch the requests from the server
    requestsGet()
      .then((response) => {
        setRequestsList(response.data); // Assuming the data received is an array of requests
      })
      .catch((error) => {
        console.error("Error fetching requests: ", error);
      });
  }, []);

  const handleReplacementRequest = (request) => {
    // Assuming you have functions for making PUT and DELETE requests to the server
    // Make a PUT request to update the customer_appointment
    // Make a DELETE request to delete the request from the server
    // You can implement these functions in the "../requestsFromServer.js" file
    // and call them here to update and delete the request.
    console.log("Replacement request clicked for: ", request);
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
                Sender: {request.sender_date_time}
              </span>
              <span className="your-datetime">
                You: {request.your_date_time}
              </span>
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
    </div>
  );
};

export default MyRequests;
