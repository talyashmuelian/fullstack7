import React, { useState } from "react";
import { requestsPost } from "../requestsFromServer.js";
import "../css/CreateAppointments.css";

const CreateAppointments = () => {
  const token = sessionStorage.getItem("token");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [meetingDuration, setMeetingDuration] = useState("");
  const [workStartTime, setWorkStartTime] = useState("");
  const [numQueues, setNumQueues] = useState("");

  const handleCreateAppointments = async () => {
    const appointments = [];

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const [hours, minutes] = workStartTime.split(":");
    const workStartTimeObj = new Date(startDateObj);
    workStartTimeObj.setHours(hours);
    workStartTimeObj.setMinutes(minutes);

    while (startDateObj <= endDateObj) {
      // Check if the current date is a Friday (5) or Saturday (6)
      if (startDateObj.getDay() !== 5 && startDateObj.getDay() !== 6) {
        let currentDateTime = new Date(startDateObj);
        currentDateTime.setHours(workStartTimeObj.getHours());
        currentDateTime.setMinutes(workStartTimeObj.getMinutes());

        for (let i = 0; i < numQueues; i++) {
          appointments.push(currentDateTime.toISOString());

          // Increment the current time by the meeting duration
          currentDateTime = new Date(
            currentDateTime.getTime() + meetingDuration * 60 * 1000
          );
        }
      }

      startDateObj.setDate(startDateObj.getDate() + 1);
    }
    console.log(appointments);

    try {
      const response = await requestsPost(`/Admin/createAppointments?token=${token}`, {
        appointments: appointments,
      });
      // Handle the response as needed
      if (response.status == 200) {
        console.log("The appointments have been successfully added!", response);
        alert("The appointments have been successfully added!");
      }
    } catch (error) {
      console.error("Failed to add appointments", error);
    }

    // Make a POST request to the server
    requestsPost(`/create-appointments?token=${token}`, { appointments })
      .then((response) => {
        // Handle success
      })
      .catch((error) => {
        // Handle error
      });
  };

  return (
    <div className="create-appointments-container">
      <div className="date-picker-container">
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label>Meeting Duration (minutes):</label>
        <input
          type="number"
          value={meetingDuration}
          onChange={(e) => setMeetingDuration(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label>Start Time for Work:</label>
        <input
          type="time"
          value={workStartTime}
          onChange={(e) => setWorkStartTime(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label>Number of Queues per Day:</label>
        <input
          type="number"
          value={numQueues}
          onChange={(e) => setNumQueues(e.target.value)}
        />
      </div>
      <button onClick={handleCreateAppointments}>Create</button>
    </div>
  );
};

export default CreateAppointments;
