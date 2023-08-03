import React, { useState, useEffect } from "react";
import { requestsGet, requestsPost } from "../requestsFromServer.js"; // Assuming you have functions for making GET and POST requests to the server
import "../css/MakeAppointment.css";

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

  // Fetch all future queues, both available and occupied, on component mount
  useEffect(() => {
    fetchFutureQueues();
    fetchMyFutureQueues();
  }, [customer_id]);

  const fetchFutureQueues = async () => {
    try {
      const response = await requestsGet("/appointments/availableAppointments"); // Replace with the appropriate API endpoint to fetch future queues
      let data = await response.json();
      data = data.map((d) => {
        return { ...d, isOccupied: false };
      });
      const response1 = await requestsGet("/appointments/occupiedAppointments"); // Replace with the appropriate API endpoint to fetch future queues
      let data1 = await response1.json();
      data1 = data1.map((d) => {
        return { ...d, isOccupied: true };
      });
      setFutureQueues([...data, ...data1]);
    } catch (error) {
      console.error("Error fetching future queues:", error);
    }
  };
  const fetchMyFutureQueues = async () => {
    console.log(customer_id);
    try {
      const response = await requestsGet(
        `/appointments/futureAppointments/${customer_id}` //
      ); // Replace with the appropriate API endpoint to fetch future queues
      let data = await response.json();

      setMyFutureQueues([...data]);
    } catch (error) {
      console.error("Error fetching my future queues:", error);
    }
  };

  const handleQueueButtonClick = (queue) => {
    if (queue.isOccupied) {
      // Handle "Request a Replacement" button click
      setIsRequestExchangeOpen(true);
      setSelectedQueueForReplace(queue);
      //setSelectedQueue(queue);
    } else {
      // Handle "Call for a Queue" button click
      openAppointmentForm(queue);
    }
  };

  //   useEffect(() => {
  //     // This will be triggered every time selectedQueueForReplace changes
  //     console.log(selectedQueueForReplace);
  //   }, [selectedQueueForReplace]);

  const openAppointmentForm = (queue) => {
    // Implement the logic to open the appointment form and set the selectedQueue state
    setSelectedQueue(queue);
  };

  const deleteObjectById = (idToDelete) => {
    const updatedList = futureQueues.filter(
      (obj) => obj.appointment_id !== idToDelete
    );
    setFutureQueues(updatedList);
  };

  //צריך לרוקן את הטופס אחרי השליחה
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // Implement the logic to submit the form and make a POST request to add a row in the queue table
    try {
      const response = await requestsPost("/appointments/makeAppointment", {
        customer_id: customer_id,
        appointment_id: selectedQueue.appointment_id,
        ...formData,
      });
      alert("Appointment added successfully!");
      deleteObjectById(selectedQueue.appointment_id);
      setSelectedQueue(null);

      // Handle the response as neededs
      console.log("Appointment added successfully!", response);
    } catch (error) {
      console.error("Error adding appointment:", error);
    }
  };

  const handleRequestExchangeSubmit = async (queue) => {
    // Implement the logic to submit the request exchange and make a POST request to add a row in the request table
    try {
      const response = await requestsPost("/requests/createRequest", {
        sender_client_id: customer_id,
        recipient_appointment_id: selectedQueueForReplace.appointment_id,
        sender_appointment_id: queue.appointment_id,
      });
      // Handle the response as needed
      if (response.status == 200) {
        console.log("Exchange request submitted!", response);
        alert("Exchange request submitted successfully!");
      } else if (response.status == 201) {
        console.log(
          "The request already exists. Wait patiently for a reply",
          response
        );
        alert("The request already exists. Wait patiently for a reply");
      }

      setIsRequestExchangeOpen(false);
    } catch (error) {
      console.error("Error submitting exchange request:", error);
    }
  };

  return (
    <div>
      {/* Display all future queues, both available and occupied */}
      {futureQueues.map((queue) => (
        <div key={queue.appointment_id}>
          <span>{queue.date_time}</span>
          {queue.isOccupied ? (
            <button onClick={() => handleQueueButtonClick(queue)}>
              Request a Replacement
            </button>
          ) : (
            <button onClick={() => handleQueueButtonClick(queue)}>
              Call for a Queue
            </button>
          )}
        </div>
      ))}
      {/* Appointment Form */}
      {selectedQueue && (
        <div>
          <h2>Setting an Appointment</h2>
          <form onSubmit={handleFormSubmit}>
            {/* Add form fields for orderer's details, additional information, reminder, etc. */}
            {/* e.g., */}
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
                if (e.target == false) {
                  temp = 0;
                } else temp = 1;
                setFormData({ ...formData, reminder: temp });
              }}
            />
            {/* Add more form fields as needed */}
            <button type="submit">Set an Appointment</button>
          </form>
        </div>
      )}

      {/* Request Exchange Modal */}
      {isRequestExchangeOpen && (
        <div>
          <h2>Which queue do you wish to exchange with?</h2>
          {/* Display your queues for exchange */}
          {/* e.g., */}
          {myFutureQueues.map((queue) => (
            <div key={queue.appointment_id}>
              <span>{queue.date_time}</span>
              <button onClick={() => handleRequestExchangeSubmit(queue)}>
                Submit an exchange request with this appointment
              </button>
            </div>
          ))}
          {/* Add a button or link to close the modal */}
        </div>
      )}
    </div>
  );
};

export default MakeAppointment;

// const MakeAppointment = () => {
//   const [weekSchedule, setWeekSchedule] = useState([
//     { day: sunday },
//     { day: monday },
//   ]);

//   // Fetch the week's schedule on component mount (You need to implement the API request)
//   useEffect(() => {
//     fetchWeekSchedule();
//   }, []);

//   const fetchWeekSchedule = async () => {
//     // Implement the logic to fetch the week's schedule by day from the server
//     // Example API endpoint: `/week-schedule`
//     try {
//       const response = await fetch("/week-schedule");
//       const data = await response.json();
//       setWeekSchedule(data);
//     } catch (error) {
//       console.error("Error fetching week's schedule:", error);
//     }
//   };

//   const handleDayClick = (day) => {
//     // Implement the logic to show available and occupied queues for the clicked day
//     // Example: set queuesToShow based on the day
//   };

//   const handleQueueButtonClick = (queue) => {
//     if (queue.isOccupied) {
//       // Handle "Request a Replacement" button click
//       openRequestExchangeModal(queue);
//     } else {
//       // Handle "Call for a Queue" button click
//       openAppointmentForm(queue);
//     }
//   };

//   const openAppointmentForm = (queue) => {
//     // Implement the logic to open the appointment form
//     // Example: set the selectedQueue state to the clicked queue and show the form
//   };

//   const handleFormSubmit = async (event) => {
//     event.preventDefault();
//     // Implement the logic to submit the form and make a POST request to add a row in the queue table
//     // Example: send formData to the server via a POST request
//   };

//   const openRequestExchangeModal = (queue) => {
//     // Implement the logic to open the request exchange modal
//     // Example: set the selectedQueue state to the clicked queue and show the modal
//   };

//   const handleRequestExchangeSubmit = async () => {
//     // Implement the logic to submit the request exchange and make a POST request to add a row in the request table
//     // Example: send selectedQueueId to the server via a POST request
//   };

//   return (
//     <div className="make-appointment-container">
//       {/* Week Schedule */}
//       <div className="week-schedule">
//         {weekSchedule.map((day) => (
//           <div
//             key={day.day}
//             className="day"
//             onClick={() => handleDayClick(day)}
//           >
//             {day.day}
//           </div>
//         ))}
//       </div>

//       {/* Queues */}
//       <div className="queues">
//         {/* Display available and occupied queues here */}
//         {/* Example: Use queuesToShow state */}
//         {/* For each available queue */}
//         <div key={availableQueue.id}>
//           <span>{availableQueue.name}</span>
//           <button onClick={() => handleQueueButtonClick(availableQueue)}>
//             Call for a Queue
//           </button>
//         </div>

//         {/* For each occupied queue */}
//         <div key={occupiedQueue.id}>
//           <span>{occupiedQueue.name}</span>
//           <button onClick={() => handleQueueButtonClick(occupiedQueue)}>
//             Request a Replacement
//           </button>
//         </div>
//       </div>

//       {/* Appointment Form */}
//       {selectedQueue && (
//         <div className="appointment-form">
//           <h2>Setting an Appointment</h2>
//           <form onSubmit={handleFormSubmit}>
//             {/* Add form fields for orderer's details, additional information, reminder, etc. */}
//             {/* e.g., */}
//             <input
//               type="text"
//               placeholder="Name"
//               value={formData.name}
//               onChange={(e) =>
//                 setFormData({ ...formData, name: e.target.value })
//               }
//             />
//             {/* Add more form fields as needed */}
//             <button type="submit">Set an Appointment</button>
//           </form>
//         </div>
//       )}

//       {/* Request Exchange Modal */}
//       {isRequestExchangeOpen && (
//         <div className="request-exchange-modal">
//           <h2>Which queue do you wish to exchange with?</h2>
//           {/* Display your queues for exchange */}
//           {/* e.g., */}
//           {myQueues.map((queue) => (
//             <div key={queue.id}>
//               <span>{queue.name}</span>
//               <button onClick={handleRequestExchangeSubmit}>
//                 Confirm Exchange
//               </button>
//             </div>
//           ))}
//           {/* Add a button or link to close the modal */}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MakeAppointment;
