import "./App.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signin from "./pages/Signin";
import LoginAdmin from "./pages/LoginAdmin";
import HomeClients from "./pages/HomeClients";
import MakeAppointment from "./pages/MakeAppointment";
import History from "./pages/History";
import FutureAppointment from "./pages/FutureAppointment";
import MyRequests from "./pages/MyRequests";
import RequestsForMe from "./pages/RequestsForMe";
import HomeAdmin from "./pages/HomeAdmin";
import CreateAppointments from "./pages/CreateAppointments";
import CustomerPayments from "./pages/CustomerPayments";
import AdminPayments from "./pages/AdminPayments";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/" element={<Navigate to="/Login" />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/LoginAdmin" element={<LoginAdmin />} />
        <Route path="/HomeClients" element={<HomeClients />} />
        <Route path="/HomeAdmin" element={<HomeAdmin />} />
        <Route path="Admin" element={<HomeAdmin />}>
          <Route
            path=":id/Appointments/CreateAppointments"
            element={<CreateAppointments />}
          />
          <Route
            path=":id/Appointments/FutureAppointments"
            element={<LoginAdmin />}
          />
          <Route path=":id/Payments" element={<AdminPayments />} />
        </Route>
        <Route path="Users" element={<HomeClients />}>
          <Route path=":id/Home" index />
          <Route
            path=":id/Appointments/MakeAppointment"
            element={<MakeAppointment />}
          />
          <Route path=":id/Appointments/History" element={<History />} />
          <Route
            path=":id/Appointments/Future"
            element={<FutureAppointment />}
          />
          <Route path=":id/Payments" element={<CustomerPayments />} />

          <Route path=":id/Messages" element={<Login />} />

          <Route path=":id/Requests/MyRequests" element={<MyRequests />} />

          <Route
            path=":id/Requests/RequestsForMe"
            element={<RequestsForMe />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
