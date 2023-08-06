import React, { useState, useEffect } from "react";
import {
  requestsGet,
  requestsPost,
  requestsDelete,
  requestsPut,
} from "../requestsFromServer.js";
import "../css/RequestsForMe.css";

const RequestsForMe = () => {
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
      const response = await requestsGet(
        `/requests/requestsForMe/${customer_id}`
      );
      let data = await response.json();
      let data1 = data.requests;
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
      //   if (response.status == 200) {
      //     alert("deleted");
      //   }
      fetchRequestsData(); // Fetch the updated list of queues after cancellation
    } catch (error) {
      console.error("Error canceling queue:", error);
    }

    try {
      const response1 = await requestsPut(
        `/appointments/replaceAppointment/
        ${request.sender_appointment_id}/${request.recipient_appointment_id}`,
        {}
      );
      if (response1.status == 200) {
        console.log("The exchange was made successfully", response1);
        alert("The exchange was made successfully");
      }
      fetchRequestsData();
    } catch (error) {
      console.error("Error The exchange was made", error);
    }
  };

  //   const handleReplacementRequest = (request) => {
  //     // Assuming you have functions for making PUT and DELETE requests to the server
  //     // Make a PUT request to update the customer_appointment
  //     // Make a DELETE request to delete the request from the server
  //     // You can implement these functions in the "../requestsFromServer.js" file
  //     // and call them here to update and delete the request.
  //     console.log("Replacement request clicked for: ", request);
  //   };

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
                Your: {request.recipient_date_time}
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

export default RequestsForMe;
