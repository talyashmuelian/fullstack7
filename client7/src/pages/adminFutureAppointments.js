import React, { useState, useEffect } from "react";
import { requestsGet, requestsPost } from "../requestsFromServer.js"; // Assuming you have functions for making GET and POST requests to the server

import "../css/adminFutureAppointments.css";

// const AdminFutureAppointments = () => {
//   const [queues, setQueues] = useState({});
//   const [expandedDate, setExpandedDate] = useState(null);

//   // Fetch queues from the server
//   useEffect(() => {
//     // Replace this with your actual fetch implementation
//     const fetchQueues = async () => {
//       try {
//         const response = await requestsGet("/Admin/AdminFutureAppointments");
//         let data = await response.json();
//         let data1 = data.futureAppointments;
//         setQueues(data1);
//       } catch (error) {
//         console.error("Error fetching queues:", error);
//       }
//     };

//     fetchQueues();
//   }, []);

//   // Cancel a queue by its ID
//   const cancelQueue = async (queueId) => {
//     try {
//       await fetch(`YOUR_DELETE_ENDPOINT/${queueId}`, {
//         method: "DELETE",
//       });

//       // Update queues after successful deletion
//       const updatedQueues = { ...queues };
//       for (const date in updatedQueues) {
//         updatedQueues[date] = updatedQueues[date].filter(
//           (queue) => queue.id !== queueId
//         );
//       }
//       setQueues(updatedQueues);
//     } catch (error) {
//       console.error("Error cancelling queue:", error);
//     }
//   };

//   return (
//     <div className="admin-future-appointments">
//       {Object.keys(queues).map((date) => (
//         <div className="date-group" key={date}>
//           <div
//             className="date-title"
//             onClick={() => setExpandedDate(expandedDate === date ? null : date)}
//           >
//             {date}{" "}
//             <span className="expand-arrow">
//               {expandedDate === date ? "▼" : "▶"}
//             </span>
//           </div>
//           {expandedDate === date && (
//             <div className="queues-list">
//               {queues[date]
//                 .sort((a, b) => a.date_time.localeCompare(b.date_time))
//                 .map((queue) => (
//                   <div className="queue" key={queue.date_time}>
//                     <div className="queue-time">
//                       {new Date(queue.date_time).toLocaleTimeString("en-US", {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </div>
//                     <div className="queue-details">
//                       {queue.isOccupied ? (
//                         <>
//                           {/* Display occupied queue details */}
//                           {/* ... Same queue rendering code as before ... */}
//                           <div>Name: {queue.name}</div>
//                           <div>ID Number: {queue.id_number}</div>
//                           <div>Phone: {queue.phone}</div>
//                           <div>Email: {queue.email}</div>
//                           <div>Additional Info: {queue.additionalInfo}</div>
//                           <button
//                             className="cancel-button"
//                             onClick={() => cancelQueue(queue.id)}
//                           >
//                             Cancel Queue
//                           </button>
//                         </>
//                       ) : (
//                         <div className="queue-available">
//                           The queue is still available
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AdminFutureAppointments;

const AdminFutureAppointments = () => {
  const [queues, setQueues] = useState([
    {
      date_time: "2023-08-15T10:00:00",
      name: "John Doe",
      id_number: "12345",
      phone: "555-1234",
      email: "john@example.com",
      additionalInfo: "Some additional info",
      isOccupied: true,
    },
    {
      date_time: "2023-08-15T11:00:00",
      name: null,
      id_number: null,
      phone: null,
      email: null,
      additionalInfo: null,
      isOccupied: false,
    },
    // Add more queue objects here...
  ]);
  const [expandedDate, setExpandedDate] = useState(null);

  // Fetch queues from the server
  useEffect(() => {
    // Replace this with your actual fetch implementation
    const fetchQueues = async () => {
      try {
        const response = await requestsGet("/Admin/AdminFutureAppointments");
        let data = await response.json();
        let data1 = data.futureAppointments;
        setQueues(data1);
      } catch (error) {
        console.error("Error fetching queues:", error);
      }
    };

    fetchQueues();
  }, []);

  // Cancel a queue by its ID
  const cancelQueue = async (queueId) => {
    try {
      await fetch(`YOUR_DELETE_ENDPOINT/${queueId}`, {
        method: "DELETE",
      });
      // Update queues after successful deletion
      setQueues((prevQueues) =>
        prevQueues.filter((queue) => queue.id !== queueId)
      );
    } catch (error) {
      console.error("Error cancelling queue:", error);
    }
  };

  // Group queues by date
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

  return (
    <div className="admin-future-appointments">
      {Object.keys(queuesByDate).map((date) => (
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
                .sort((a, b) => a.date_time.localeCompare(b.date_time))
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
                          {/* Display occupied queue details */}
                          <div>Name: {queue.name}</div>
                          <div>ID Number: {queue.id_number}</div>
                          <div>Phone: {queue.phone}</div>
                          <div>Email: {queue.email}</div>
                          <div>Additional Info: {queue.additionalInfo}</div>
                          <button
                            className="cancel-button"
                            onClick={() => cancelQueue(queue.id)}
                          >
                            Cancel Queue
                          </button>
                        </>
                      ) : (
                        <div className="queue-available">
                          The queue is still available
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminFutureAppointments;
