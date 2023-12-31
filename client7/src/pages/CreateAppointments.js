import React, { useState } from "react";
import { requestsPost } from "../requestsFromServer.js";
import "../css/CreateAppointments.css";
import Modal from "./Modal";

const CreateAppointments = () => {
  const token = sessionStorage.getItem("token");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [meetingDuration, setMeetingDuration] = useState("");
  const [workStartTime, setWorkStartTime] = useState("");
  const [numQueues, setNumQueues] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

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

          currentDateTime = new Date(
            currentDateTime.getTime() + meetingDuration * 60 * 1000
          );
        }
      }

      startDateObj.setDate(startDateObj.getDate() + 1);
    }
    console.log(appointments);

    try {
      const response = await requestsPost(
        `/Admin/createAppointments?token=${token}`,
        {
          appointments: appointments,
        }
      );
      if (response.status == 200) {
        console.log("The appointments have been successfully added!", response);
        setModalMessage("The appointments have been successfully added!");
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Failed to add appointments", error);
    }
  };
  const closeModal = () => {
    setModalVisible(false);
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
        <label>Number of appointment per Day:</label>
        <input
          type="number"
          value={numQueues}
          onChange={(e) => setNumQueues(e.target.value)}
        />
      </div>
      <button onClick={handleCreateAppointments}>Create</button>
      {modalVisible && <Modal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default CreateAppointments;
